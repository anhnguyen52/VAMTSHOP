// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // ví dụ: "order_251231"
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);