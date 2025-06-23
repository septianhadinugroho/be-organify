const Kategori = require('../models/kategori');
const Catatan = require('../models/catatan');
const mongoose = require('mongoose'); // Impor mongoose untuk casting ObjectId

const getKategoriHandler = async (request, h) => {
  const userId = request.auth.credentials.id; // Ambil ID user
  try {
    // 1. Ambil jumlah catatan untuk setiap kategori milik user
    const catatanCounts = await Catatan.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } }, // Filter berdasarkan user
      { $group: { _id: "$kategori", jumlahCatatan: { $sum: 1 } } }
    ]);

    // 2. Ambil semua kategori yang dibuat oleh user
    const explicitKategoris = await Kategori.find({ user: userId }).lean();

    const kategoriMap = new Map();
    explicitKategoris.forEach(k => {
      kategoriMap.set(k.nama, { kategori: k.nama, jumlahCatatan: 0 });
    });
    catatanCounts.forEach(c => {
      if (c._id) {
        const data = kategoriMap.get(c._id) || { kategori: c._id };
        data.jumlahCatatan = c.jumlahCatatan;
        kategoriMap.set(c._id, data);
      }
    });

    const finalList = Array.from(kategoriMap.values());
    return h.response({ status: 'success', data: finalList }).code(200);
  } catch (error) {
    return h.response({ status: 'error', message: `Gagal mengambil data kategori: ${error.message}` }).code(500);
  }
};

const createKategoriHandler = async (request, h) => {
  const { kategori } = request.payload;
  const userId = request.auth.credentials.id; // Ambil ID user
  
  try {
    // Cek apakah kategori sudah ada untuk user ini
    const existingKategori = await Kategori.findOne({ nama: kategori, user: userId });
    
    if (existingKategori) {
      return h.response({ status: 'fail', message: 'Kategori sudah ada' }).code(409);
    }
    
    // Buat dan simpan kategori baru dengan ID user
    const newKategori = new Kategori({ nama: kategori, user: userId });
    await newKategori.save();
    
    return h.response({ status: 'success', message: 'Kategori berhasil ditambahkan', data: newKategori }).code(201);
  } catch (error) {
    if (error.code === 11000) {
        return h.response({ status: 'fail', message: 'Kategori sudah ada' }).code(409);
    }
    return h.response({ status: 'error', message: `Gagal membuat kategori: ${error.message}` }).code(500);
  }
};

module.exports = { getKategoriHandler, createKategoriHandler };