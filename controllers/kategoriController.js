const Catatan = require('../models/catatan');

// Handler untuk mendapatkan semua kategori dan jumlah catatan per kategori
const getKategoriHandler = async (request, h) => {
  try {
    // Menggunakan MongoDB aggregation untuk menghitung jumlah catatan per kategori
    const kategoriList = await Catatan.aggregate([
      { $group: { _id: "$kategori", jumlahCatatan: { $sum: 1 } } },
      { $project: { _id: 0, kategori: "$_id", jumlahCatatan: 1 } }
    ]);
    
    return h.response({
      status: 'success',
      data: kategoriList,
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal mengambil data kategori: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk membuat kategori baru
const createKategoriHandler = async (request, h) => {
  const { kategori } = request.payload;
  
  try {
    // Cek apakah kategori sudah ada di catatan
    const existingKategori = await Catatan.findOne({ kategori });
    
    if (existingKategori) {
      return h.response({
        status: 'fail',
        message: 'Kategori sudah ada',
      }).code(400);
    }
    
    // Jika kategori belum ada, bisa langsung digunakan saat membuat catatan baru
    return h.response({
      status: 'success',
      message: 'Kategori baru siap digunakan',
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal membuat kategori: ${error.message}`,
    }).code(500);
  }
};

module.exports = {
  getKategoriHandler,
  createKategoriHandler
};