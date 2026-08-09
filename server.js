const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // เพิ่มการดึงใช้งาน mysql2
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. ตั้งค่าการเชื่อมต่อฐานข้อมูล MySQL
// ==========================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || '119.59.102.161',
  user: process.env.DB_USER || 'std6730202009',
  password: process.env.DB_PASSWORD || 'X2$kfHr1',
  database: process.env.DB_NAME || 'ip_std6730202009', // ชื่อ DB ของหนู
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00"
});

const PRODUCTS_TABLE = 'inventory'; // ชื่อตารางสินค้าใน phpMyAdmin

// ทดสอบการเชื่อมต่อฐานข้อมูลเมื่อรัน Server
(async function testMySQL() {
  try {
    const conn = await pool.getConnection();
    console.log('Connected to MySQL Database:', process.env.DB_NAME || 'ip_std6730202009');
    conn.release();
  } catch (err) {
    console.error('MySQL Connection Failed:', err.message);
  }
})();

// ==========================================
// 2. Route หน้าแรก
// ==========================================
app.get('/', (req, res) => {
  res.send('Backend Projector API is running!');
});

// ==========================================
// 3. API ดึงข้อมูลโปรเจกเตอร์ทั้งหมด (GET)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    // ดึงข้อมูลสินค้าทั้งหมดจากตาราง inventory
    const [rows] = await pool.query(`SELECT * FROM ${PRODUCTS_TABLE}`);
    res.json(rows);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลโปรเจกเตอร์ได้' });
  }
});

// ==========================================
// 4. API เพิ่มโปรเจกเตอร์ใหม่ลง DB (POST)
// ==========================================
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category, image, status } = req.body;

    // ตรวจสอบว่าใส่ชื่อโปรเจกเตอร์มาหรือไม่
    if (!name) {
      return res.status(400).json({ error: 'กรุณากรอกชื่อโปรเจกเตอร์ (Name is required)' });
    }

    // คำสั่ง SQL เพิ่มข้อมูลให้ตรงกับคอลัมน์ใน phpMyAdmin ของหนู
    const sql = `
      INSERT INTO ${PRODUCTS_TABLE} 
      (name, price, stock, category, image, status, lastUpdate) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.query(sql, [
      name,
      price || 0,
      stock || 0,
      category || 'Projector',
      image || null,
      status || 'Active'
    ]);

    return res.status(201).json({
      success: true,
      message: 'เพิ่มโปรเจกเตอร์เรียบร้อยแล้ว!',
      productId: result.insertId
    });

  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'ไม่สามารถเพิ่มโปรเจกเตอร์ได้: ' + error.message });
  }
});

// ==========================================
// 5. สั่งรัน Server (ไว้ล่างสุดเสมอ)
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});