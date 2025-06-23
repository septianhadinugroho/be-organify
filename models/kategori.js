const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    unique: true, // Memastikan tidak ada nama kategori yang sama
    trim: true     // Menghapus spasi di awal dan akhir
  }
}, { timestamps: true });

const Kategori = mongoose.model('Kategori', kategoriSchema);

module.exports = Kategori;