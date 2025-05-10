const Catatan = require('../models/catatan');

// Handler untuk membuat catatan baru
const createCatatanHandler = async (request, h) => {
  const { kategori, namaList, tanggalDeadline, status } = request.payload;
  
  try {
    const newCatatan = new Catatan({
      kategori,
      namaList,
      tanggalDeadline: new Date(tanggalDeadline),
      status: status || false,
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

// Handler untuk membaca semua catatan
const getCatatansHandler = async (request, h) => {
  try {
    const catatans = await Catatan.find();
    
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

// Handler untuk membaca satu catatan berdasarkan ID
const getCatatanByIdHandler = async (request, h) => {
  const { id } = request.params;
  
  try {
    const catatan = await Catatan.findById(id);
    
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

// Handler untuk memperbarui catatan
const updateCatatanHandler = async (request, h) => {
  const { id } = request.params;
  const { kategori, namaList, tanggalDeadline, status } = request.payload;
  
  try {
    const updatedData = {};
    
    if (kategori) updatedData.kategori = kategori;
    if (namaList) updatedData.namaList = namaList;
    if (tanggalDeadline) updatedData.tanggalDeadline = new Date(tanggalDeadline);
    if (typeof status !== 'undefined') updatedData.status = status;
    
    const catatan = await Catatan.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
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

// Handler untuk menghapus catatan
const deleteCatatanHandler = async (request, h) => {
  const { id } = request.params;
  
  try {
    const catatan = await Catatan.findByIdAndDelete(id);
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
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

// Handler untuk memfilter catatan berdasarkan status dan deadline
const getFilteredCatatansHandler = async (request, h) => {
  const { status, deadlineWithin7Days } = request.query;
  
  try {
    // Filter berdasarkan status (hanya tugas yang belum beres)
    const filter = { status: false };
    
    // Filter berdasarkan deadline dalam 7 hari ke depan
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
  
  try {
    const catatan = await Catatan.findById(id);
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    // Cek apakah sudah ada todo item
    if (catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan sudah memiliki todo item',
      }).code(400);
    }
    
    // Buat todo item baru
    const todoItemBaru = {
      judul,
      isi,
      terakhirDiperbarui: new Date()
    };
    
    // Tambahkan todo item ke catatan
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
  
  try {
    const catatan = await Catatan.findById(id);
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    // Cek apakah ada todo item
    if (!catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak memiliki todo item',
      }).code(404);
    }
    
    // Update todo item yang ada
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
  
  try {
    const catatan = await Catatan.findById(id);
    
    if (!catatan) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      }).code(404);
    }
    
    // Cek apakah ada todo item
    if (!catatan.todoItem) {
      return h.response({
        status: 'fail',
        message: 'Catatan tidak memiliki todo item',
      }).code(404);
    }
    
    // Hapus todo item
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

// Handler untuk menghapus semua catatan yang sudah beres (status true)
const hapusCatatanBeresHandler = async (request, h) => {
  try {
    const result = await Catatan.deleteMany({ status: true });
    
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