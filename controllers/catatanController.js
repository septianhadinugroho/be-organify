const Catatan = require('../models/catatan');

// Handler untuk membuat catatan baru
const createCatatanHandler = async (request, h) => {
  const { kategori, namaList, tanggalDeadline, status } = request.payload;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    const newCatatan = new Catatan({
      kategori,
      namaList,
      tanggalDeadline: new Date(tanggalDeadline),
      status: status || false,
      user: userId, // MODIFIKASI: Sertakan ID user saat membuat data
    });
    
    const savedCatatan = await newCatatan.save();
    
    return h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: { id: savedCatatan._id },
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal menambahkan catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk membaca semua catatan milik user
const getCatatansHandler = async (request, h) => {
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  try {
    // MODIFIKASI: Filter catatan berdasarkan ID user
    const catatans = await Catatan.find({ user: userId });
    
    return h.response({
      status: 'success',
      data: catatans.map(doc => ({
        id: doc._id,
        kategori: doc.kategori,
        namaList: doc.namaList,
        tanggalDeadline: doc.tanggalDeadline,
        dibuatPada: doc.dibuatPada,
        status: doc.status,
        todoItem: doc.todoItem
      }))
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal mengambil data catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk membaca satu catatan berdasarkan ID milik user
const getCatatanByIdHandler = async (request, h) => {
  const { id } = request.params;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Cari catatan berdasarkan ID dan ID user
    const catatan = await Catatan.findOne({ _id: id, user: userId });
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    return h.response({
      status: 'success',
      data: {
        id: catatan._id,
        kategori: catatan.kategori,
        namaList: catatan.namaList,
        tanggalDeadline: catatan.tanggalDeadline,
        dibuatPada: catatan.dibuatPada,
        status: catatan.status,
        todoItem: catatan.todoItem
      },
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal mengambil data catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk memperbarui catatan milik user
const updateCatatanHandler = async (request, h) => {
  const { id } = request.params;
  const { kategori, namaList, tanggalDeadline, status } = request.payload;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    const updatedData = {};
    
    if (kategori) updatedData.kategori = kategori;
    if (namaList) updatedData.namaList = namaList;
    if (tanggalDeadline) updatedData.tanggalDeadline = new Date(tanggalDeadline);
    if (typeof status !== 'undefined') updatedData.status = status;
    
    // MODIFIKASI: Update catatan berdasarkan ID dan ID user
    const catatan = await Catatan.findOneAndUpdate(
      { _id: id, user: userId },
      updatedData,
      { new: true, runValidators: true }
    );
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Catatan tidak ditemukan atau Anda tidak memiliki izin.',
      }).code(404);
    }
    
    return h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal memperbarui catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk menghapus catatan milik user
const deleteCatatanHandler = async (request, h) => {
  const { id } = request.params;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Hapus catatan berdasarkan ID dan ID user
    const catatan = await Catatan.findOneAndDelete({ _id: id, user: userId });
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Gagal menghapus catatan. Catatan tidak ditemukan atau Anda tidak memiliki izin.',
      }).code(404);
    }
    
    return h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal menghapus catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk memfilter catatan berdasarkan status dan deadline milik user
const getFilteredCatatansHandler = async (request, h) => {
  const { status, deadlineWithin7Days } = request.query;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Tambahkan user ke objek filter
    const filter = { status: false, user: userId };
    
    if (deadlineWithin7Days === 'true') {
      const today = new Date();
      const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      filter.tanggalDeadline = {
        $gte: today,
        $lte: sevenDaysLater
      };
    }
    
    const filteredCatatans = await Catatan.find(filter);
    
    return h.response({
      status: 'success',
      data: filteredCatatans.map(doc => ({
        id: doc._id,
        kategori: doc.kategori,
        namaList: doc.namaList,
        tanggalDeadline: doc.tanggalDeadline,
        dibuatPada: doc.dibuatPada,
        status: doc.status,
        todoItem: doc.todoItem
      }))
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal mengambil data catatan: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk menambahkan todo item ke catatan
const tambahTodoItemHandler = async (request, h) => {
  const { id } = request.params;
  const { judul, isi } = request.payload;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Pastikan catatan milik user yang sedang login
    const catatan = await Catatan.findOne({ _id: id, user: userId });
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    if (catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan sudah memiliki todo item',
      }).code(400);
    }
    
    const todoItemBaru = {
      judul,
      isi,
      terakhirDiperbarui: new Date()
    };
    
    catatan.todoItem = todoItemBaru;
    await catatan.save();
    
    return h.response({
      status: 'success',
      message: 'Todo item berhasil ditambahkan',
      data: todoItemBaru,
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal menambahkan todo item: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk memperbarui todo item di catatan
const updateTodoItemHandler = async (request, h) => {
  const { id } = request.params;
  const { judul, isi } = request.payload;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Pastikan catatan milik user yang sedang login
    const catatan = await Catatan.findOne({ _id: id, user: userId });
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    if (!catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak memiliki todo item',
      }).code(404);
    }
    
    if (judul) catatan.todoItem.judul = judul;
    if (isi) catatan.todoItem.isi = isi;
    catatan.todoItem.terakhirDiperbarui = new Date();
    
    await catatan.save();
    
    return h.response({
      status: 'success',
      message: 'Todo item berhasil diperbarui',
      data: catatan.todoItem,
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal memperbarui todo item: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk menghapus todo item di catatan
const hapusTodoItemHandler = async (request, h) => {
  const { id } = request.params;
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  
  try {
    // MODIFIKASI: Pastikan catatan milik user yang sedang login
    const catatan = await Catatan.findOne({ _id: id, user: userId });
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    if (!catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak memiliki todo item',
      }).code(404);
    }
    
    catatan.todoItem = undefined;
    await catatan.save();
    
    return h.response({
      status: 'success',
      message: 'Todo item berhasil dihapus',
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal menghapus todo item: ${error.message}`,
    }).code(500);
  }
};

// Handler untuk menghapus semua catatan yang sudah beres milik user
const hapusCatatanBeresHandler = async (request, h) => {
  // MODIFIKASI: Ambil ID user dari token JWT
  const userId = request.auth.credentials.id;
  try {
    // MODIFIKASI: Hapus catatan berdasarkan status dan ID user
    const result = await Catatan.deleteMany({ status: true, user: userId });
    
    return h.response({
      status: 'success',
      message: `Berhasil menghapus ${result.deletedCount} catatan yang sudah beres`,
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'error',
      message: `Gagal menghapus catatan: ${error.message}`,
    }).code(500);
  }
};

module.exports = {
  createCatatanHandler,
  getCatatansHandler,
  getCatatanByIdHandler,
  updateCatatanHandler,
  deleteCatatanHandler,
  getFilteredCatatansHandler,
  tambahTodoItemHandler,
  updateTodoItemHandler,
  hapusTodoItemHandler,
  hapusCatatanBeresHandler
};