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

// 2. API ดึงข้อมูลสินค้า (ปรับเพิ่มรูปภาพและรายละเอียดให้สมบูรณ์)
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'WANBO X2 Max Smart Android Projector',
      price: 5990,
      stock: 5,
      category: 'Projector',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'WANBO Mini Projector',
      price: 3502,
      stock: 10,
      category: 'Projector',
      image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'WANBO Projector Android 9.0 / Mozart',
      price: 17590,
      stock: 15,
      category: 'Projector',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop'
    }
  ]);
});

// 3. สั่งรัน Server (ไว้ล่างสุดเสมอ)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});