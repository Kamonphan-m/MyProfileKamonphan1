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
      image: 'https://e-express.co.th/wp-content/uploads/2025/04/p1-1.webp'
    },
    {
      id: 2,
      name: 'WANBO Mini Projector',
      price: 3502,
      stock: 10,
      category: 'Projector',
      image: 'https://www.gtoengineer.com/wp-content/uploads/2025/03/2023011616162157355_1.webp'
    },
    {
      id: 3,
      name: 'WANBO Projector Android 9.0 / Mozart',
      price: 17590,
      stock: 15,
      category: 'Projector',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzmaN2pdHvbH1EvXrMiRyOEG4KQsx1v0i1PBmBgl9ulxR2RonnlcZWGRXK&s=10'
    },
    {
      id: 4,
      name: 'ACER ACER Projector x 1328wi',
      price: 17390,
      stock: 15,
      category: 'Projector',
      image: 'https://img.advice.co.th/cdn-cgi/image/format=auto,width=700,quality=82,fit=contain/images_nas/pic_product4/A0145144/A0145144OK_BIG_1.jpg'
    },
    {
      id: 5,
      name: 'Epson EPSON Projector / EB-E24',
      price: 17790,
      stock: 25,
      category: 'Projector',
      image: 'https://www.smartmediaprojector.com/uploads/6426/shop/202604/202604-27-142331_Wz-0.png'
    },
    {
      id: 5,
      name: 'Xiaomi Mi Smart Projector 2 Pro',
      price: 23999,
      stock: 10,
      category: 'Projector',
      image: 'https://media-cdn.bnn.in.th/151919/Xiaomi-Mi-Smart-Projector-2-White-2.jpg'
    }
  ]);
});

// 3. สั่งรัน Server (ไว้ล่างสุดเสมอ)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});