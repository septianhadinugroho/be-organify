const Kategori = require('../models/kategori');
const Catatan = require('../models/catatan');

/**
 * Handler untuk mendapatkan semua kategori, baik yang sudah dipakai maupun yang belum.
 * Akan digabungkan dengan jumlah catatan yang menggunakan kategori tersebut.
 */
const getKategoriHandler = async (request, h) => {
  try {
    // 1. Ambil jumlah catatan untuk setiap kategori yang ada di collection 'Catatan'
    const catatanCounts = await Catatan.aggregate([
      { $group: { _id: "$kategori", jumlahCatatan: { $sum: 1 } } }
    ]);

    // 2. Ambil semua kategori yang sudah dibuat secara eksplisit dari collection 'Kategori'
    const explicitKategoris = await Kategori.find().lean();

    // 3. Gunakan Map untuk menggabungkan data dan memastikan keunikan
    const kategoriMap = new Map();

    // Tambahkan dulu semua kategori yang ada di collection 'Kategori' dengan jumlah awal 0
    explicitKategoris.forEach(k => {
      kategoriMap.set(k.nama, { kategori: k.nama, jumlahCatatan: 0 });
    });

    // Perbarui jumlah catatan berdasarkan data agregasi
    catatanCounts.forEach(c => {
      if (c._id) { // Pastikan _id (nama kategori) tidak null
        const data = kategoriMap.get(c._id) || { kategori: c._id };
        data.jumlahCatatan = c.jumlahCatatan;
        kategoriMap.set(c._id, data);
      }
    });

    // Ubah Map kembali menjadi array untuk respons
    const finalList = Array.from(kategoriMap.values());

    return h.response({
      status: 'success',
      data: finalList,
    }).code(200);

  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal mengambil data kategori: ${error.message}`,
    }).code(500);
  }
};

/**
 * Handler untuk membuat kategori baru dan menyimpannya ke database.
 */
const createKategoriHandler = async (request, h) => {
  const { kategori } = request.payload;
  
  try {
    // Cek apakah kategori sudah ada di collection 'Kategori'
    const existingKategori = await Kategori.findOne({ nama: kategori });
    
    if (existingKategori) {
      return h.response({
        status: 'fail',
        message: 'Kategori sudah ada',
      }).code(409); // 409 Conflict lebih sesuai
    }
    
    // Buat dan simpan kategori baru
    const newKategori = new Kategori({ nama: kategori });
    await newKategori.save();
    
    return h.response({
      status: 'success',
      message: 'Kategori berhasil ditambahkan',
      data: newKategori
    }).code(201);

  } catch (error) {
    // Tangani error jika validasi unique gagal
    if (error.code === 11000) {
        return h.response({
            status: 'fail',
            message: 'Kategori sudah ada',
        }).code(409);
    }
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