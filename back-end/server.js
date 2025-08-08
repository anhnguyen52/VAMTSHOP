const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./src/routers/index.js");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); 
const fs = require("fs");
const cookieParser = require('cookie-parser')

dotenv.config();

const app = express();

app.use(express.json()); // Cho phép đọc JSON body
app.use(cors()); // Cho phép frontend gọi API

// Middleware để parse cookie
app.use(cookieParser());

const imagesPath = path.join(__dirname, "src/assets/images");
// console.log("Serving images from:", imagesPath);

app.use("/images", express.static(imagesPath));

// Kiểm tra xem thư mục có ảnh không
// fs.readdir(imagesPath, (err, files) => {
//   if (err) {
//     console.error("Lỗi khi đọc thư mục ảnh:", err);
//   } else {
//     console.log("Ảnh có trong thư mục:", files);
//   }
// });

const PORT = process.env.PORT ;
const MONGODB_URI = process.env.MONGODB_URI;

// Kết nối MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connect DB success!");

    // Kiểm tra database thực sự tồn tại bằng cách lấy danh sách collection
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.warn("Warning: Database exists but has no collections.");
    } else {
      console.log("Collections:", collections.map((col) => col.name));
    }
  })
  .catch((err) => {
    console.error("❌ Connect DB failed:", err);
    process.exit(1);
  });

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
