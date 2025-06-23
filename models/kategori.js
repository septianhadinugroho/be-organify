const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
    trim: true
  },
  // TAMBAHKAN FIELD INI
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Buat index unik untuk kombinasi nama dan user
kategoriSchema.index({ nama: 1, user: 1 }, { unique: true });

const Kategori = mongoose.model('Kategori', kategoriSchema);

module.exports = Kategori;