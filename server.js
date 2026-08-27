const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล MySQL
// ==========================================
const requiredDatabaseVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingDatabaseVariables = requiredDatabaseVariables.filter((name) => !process.env[name]);

if (missingDatabaseVariables.length > 0) {
  throw new Error(`Missing required database configuration: ${missingDatabaseVariables.join(', ')}`);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00"
});

const PRODUCTS_TABLE = 'inventory';

class ClientError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function isNonNegativeNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

// ทดสอบการเชื่อมต่อฐานข้อมูลเมื่อรัน Server
(async function testMySQL() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL Database');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL Connection Failed Reason:', err.message);
    console.error('รายละเอียดเพิ่มเติม:', err.code);
  }
})();

// ==========================================
// 2. Route หน้าแรก
// ==========================================
app.get('/', (req, res) => {
  res.send('Backend Projector API is running!');
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Health check error:', error.message);
    res.status(503).json({ status: 'unavailable', error: 'Database is unavailable' });
  }
});

// ==========================================
// 3. API ดึงข้อมูลโปรเจกเตอร์ทั้งหมด (GET)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${PRODUCTS_TABLE}`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลโปรเจกเตอร์ได้' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${PRODUCTS_TABLE} WHERE id = ?`, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบสินค้าที่ต้องการ' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error('Fetch product error:', error);
    return res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลสินค้าได้' });
  }
});

// ==========================================
// 4. API เพิ่มโปรเจกเตอร์ใหม่ลง DB (POST)
// ==========================================
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category, image, status } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'กรุณากรอกชื่อโปรเจกเตอร์ (Name is required)' });
    }

    if (price !== undefined && !isNonNegativeNumber(price)) {
      return res.status(400).json({ error: 'ราคาต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป' });
    }

    if (stock !== undefined && !isNonNegativeNumber(stock)) {
      return res.status(400).json({ error: 'จำนวนสต็อกต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป' });
    }

    const sql = `
      INSERT INTO ${PRODUCTS_TABLE} 
      (name, price, stock, category, image, status, lastUpdate) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.query(sql, [
      name.trim(),
      price ?? 0,
      stock ?? 0,
      category || 'Projector',
      image || null,
      status || 'Available'
    ]);

    return res.status(201).json({
      success: true,
      message: 'เพิ่มโปรเจกเตอร์เรียบร้อยแล้ว!',
      productId: result.insertId
    });

  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'ไม่สามารถเพิ่มสินค้าได้' });
  }
});

// ==========================================
// 5. API สั่งซื้อสินค้าและตัดสต็อกในฐานข้อมูล (Checkout)
// ==========================================
app.post('/api/checkout', async (req, res) => {
  let connection;
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'ไม่มีรายการสินค้าในตะกร้า' });
    }

    if (items.some((item) => !item?.id || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      return res.status(400).json({ error: 'รูปแบบรายการสินค้าไม่ถูกต้อง' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    for (const item of items) {
      const qty = item.quantity;
      const sql = `
        UPDATE ${PRODUCTS_TABLE} 
        SET stock = stock - ?, lastUpdate = NOW() 
        WHERE id = ? AND stock >= ?
      `;
      const [result] = await connection.query(sql, [qty, item.id, qty]);

      if (result.affectedRows === 0) {
        throw new ClientError(`สินค้า ID: ${item.id} สต็อกไม่พอ หรือไม่พบสินค้า`, 409);
      }
    }

    await connection.commit();
    return res.json({ success: true, message: 'สั่งซื้อสำเร็จและตัดสต็อกเรียบร้อยแล้ว!' });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Checkout Error:', error);
    const status = error instanceof ClientError ? error.status : 500;
    const message = error instanceof ClientError ? error.message : 'ไม่สามารถทำรายการสั่งซื้อได้';
    return res.status(status).json({ error: message });
  } finally {
    if (connection) connection.release();
  }
});

// ==========================================
// 6. API แก้ไขสินค้า / ปรับจำนวนสต็อก (PUT)
// ==========================================
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, price, name, category, image, status } = req.body;

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: 'ชื่อสินค้าต้องไม่ว่าง' });
    }

    if (price !== undefined && !isNonNegativeNumber(price)) {
      return res.status(400).json({ error: 'ราคาต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป' });
    }

    if (stock !== undefined && !isNonNegativeNumber(stock)) {
      return res.status(400).json({ error: 'จำนวนสต็อกต้องเป็นตัวเลขตั้งแต่ 0 ขึ้นไป' });
    }

    const sql = `
      UPDATE ${PRODUCTS_TABLE} 
      SET stock = COALESCE(?, stock),
          price = COALESCE(?, price),
          name = COALESCE(?, name),
          category = COALESCE(?, category),
          image = COALESCE(?, image),
          status = COALESCE(?, status),
          lastUpdate = NOW()
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [stock, price, name?.trim(), category, image, status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบสินค้าที่ต้องการแก้ไข' });
    }

    return res.json({ success: true, message: 'อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว!' });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ error: 'ไม่สามารถอัปเดตสินค้าได้' });
  }
});

// ==========================================
// 7. API ลบสินค้า (DELETE)
// ==========================================
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM ${PRODUCTS_TABLE} WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบสินค้าที่ต้องการลบ' });
    }

    return res.json({ success: true, message: 'ลบสินค้าเรียบร้อยแล้ว!' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้' });
  }
});

// ==========================================
// 8. สั่งรัน Server (ไว้ล่างสุดเสมอ)
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
