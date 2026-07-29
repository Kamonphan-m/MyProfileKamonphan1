const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// 1. หน้าแรก
app.get('/', (req, res) => {
  res.send('Backend is running on Cloud with Supabase!');
});

// 2. API ดึงข้อมูลสินค้า
app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 }
  ]);
});

// 3. สั่งรัน Server (ไว้ล่างสุดเสมอ)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});