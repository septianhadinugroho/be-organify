const db = require('./firebase');

// Handler untuk membuat catatan baru
const createCatatanHandler = async (request, h) => {
    const { kategori, namaList, tanggalDeadline, status } = request.payload;
    const newCatatan = {
        kategori,
        namaList,
        tanggalDeadline: new Date(tanggalDeadline).toISOString(),
        dibuatPada: new Date().toISOString(),
        status: status || false,
        todoItem: null,
    };

    try {
        const catatanRef = db.ref('catatan').push();
        await catatanRef.set(newCatatan);
        return h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: { id: catatanRef.key },
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
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();
        const catatanList = Object.keys(catatans || {}).map(key => ({
            id: key,
            ...catatans[key],
        }));

        return h.response({
            status: 'success',
            data: catatanList,
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
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        const catatan = {
            id: snapshot.key,
            ...snapshot.val(),
        };

        return h.response({
            status: 'success',
            data: catatan,
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
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        const updatedData = {
            ...(kategori && { kategori }),
            ...(namaList && { namaList }),
            ...(tanggalDeadline && { tanggalDeadline: new Date(tanggalDeadline).toISOString() }),
            ...(typeof status !== 'undefined' && { status }),
        };

        await catatanRef.update(updatedData);
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
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        await catatanRef.remove();
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
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();
        const catatanList = Object.keys(catatans || {}).map(key => ({
            id: key,
            ...catatans[key],
        }));

        // Filter berdasarkan status (hanya tugas yang belum beres)
        let filteredCatatans = catatanList.filter(catatan => catatan.status === false);

        // Filter berdasarkan deadline dalam 7 hari ke depan
        if (deadlineWithin7Days === 'true') {
            const today = new Date();
            const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

            filteredCatatans = filteredCatatans.filter(catatan => {
                const deadline = new Date(catatan.tanggalDeadline);
                return deadline >= today && deadline <= sevenDaysLater; // Deadline dalam 7 hari ke depan
            });
        }

        return h.response({
            status: 'success',
            data: filteredCatatans,
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

    const todoItemBaru = {
        id: `todoItem${Date.now()}`,
        judul,
        isi,
        terakhirDiperbarui: new Date().toISOString(),
    };

    try {
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        const catatan = snapshot.val();

        // Cek apakah sudah ada todo item
        if (catatan.todoItem) {
            return h.response({
                status: 'fail',
                message: 'Catatan sudah memiliki todo item',
            }).code(400);
        }

        // Tambahkan todo item baru
        await catatanRef.update({ todoItem: todoItemBaru });
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
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        const catatan = snapshot.val();

        // Cek apakah ada todo item
        if (!catatan.todoItem) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak memiliki todo item',
            }).code(404);
        }

        // Update todo item yang ada
        const updatedTodoItem = {
            ...catatan.todoItem,
            judul,
            isi,
            terakhirDiperbarui: new Date().toISOString(),
        };

        await catatanRef.update({ todoItem: updatedTodoItem });
        return h.response({
            status: 'success',
            message: 'Todo item berhasil diperbarui',
            data: updatedTodoItem,
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
        const catatanRef = db.ref(`catatan/${id}`);
        const snapshot = await catatanRef.once('value');

        if (!snapshot.exists()) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak ditemukan',
            }).code(404);
        }

        const catatan = snapshot.val();

        // Cek apakah ada todo item
        if (!catatan.todoItem) {
            return h.response({
                status: 'fail',
                message: 'Catatan tidak memiliki todo item',
            }).code(404);
        }

        // Hapus todo item dengan mengubahnya menjadi null
        await catatanRef.update({ todoItem: null });
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
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();

        if (!catatans) {
            return h.response({
                status: 'success',
                message: 'Tidak ada catatan yang ditemukan',
            }).code(200);
        }

        const catatanList = Object.keys(catatans);
        let deletedCount = 0;

        // Loop melalui semua catatan dan hapus yang statusnya true
        for (const id of catatanList) {
            if (catatans[id].status === true) {
                await db.ref(`catatan/${id}`).remove();
                deletedCount++;
            }
        }

        return h.response({
            status: 'success',
            message: `Berhasil menghapus ${deletedCount} catatan yang sudah beres`,
        }).code(200);
    } catch (error) {
        return h.response({
            status: 'error',
            message: `Gagal menghapus catatan: ${error.message}`,
        }).code(500);
    }
};

const getKategoriHandler = async (request, h) => {
    try {
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();
        const kategoriCount = {};

        // Menghitung jumlah catatan untuk setiap kategori
        Object.values(catatans || {}).forEach(catatan => {
            if (catatan.kategori) {
                if (!kategoriCount[catatan.kategori]) {
                    kategoriCount[catatan.kategori] = 0;
                }
                kategoriCount[catatan.kategori]++;
            }
        });

        // Format data untuk response
        const kategoriList = Object.keys(kategoriCount).map(kategori => ({
            kategori,
            jumlahCatatan: kategoriCount[kategori],
        }));

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

const createKategoriHandler = async (request, h) => {
    const { kategori } = request.payload;

    try {
        // Cek apakah kategori sudah ada di catatan
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();
        const kategoriExists = Object.values(catatans || {}).some(catatan => catatan.kategori === kategori);

        if (kategoriExists) {
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

const getGrafikTugasSelesaiHandler = async (request, h) => {
    const { tanggalAwal } = request.query; // Format: YYYY-MM-DD

    try {
        // Validasi input
        if (!tanggalAwal || !/^\d{4}-\d{2}-\d{2}$/.test(tanggalAwal)) {
            return h.response({
                status: 'fail',
                message: 'Format tanggal awal tidak valid. Gunakan format YYYY-MM-DD',
            }).code(400);
        }

        // Hitung rentang 7 hari dari tanggal awal
        const startDate = new Date(tanggalAwal);
        const dateRange = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        });

        // Ambil semua catatan dari database
        const snapshot = await db.ref('catatan').once('value');
        const catatans = snapshot.val();

        // Hitung jumlah tugas selesai untuk setiap hari dalam rentang
        const grafikData = dateRange.map((tanggal) => {
            const jumlahTugasSelesai = Object.values(catatans || {}).filter((catatan) => {
                const deadline = catatan.tanggalDeadline.split('T')[0]; // Ambil tanggal saja
                return deadline === tanggal && catatan.status === true;
            }).length;

            return {
                hari: new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' }),
                tanggal,
                jumlahTugasSelesai,
            };
        });

        return h.response({
            status: 'success',
            data: grafikData,
        }).code(200);
    } catch (error) {
        return h.response({
            status: 'error',
            message: `Gagal mengambil data grafik: ${error.message}`,
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
    hapusCatatanBeresHandler,
    getKategoriHandler,
    createKategoriHandler,
    getGrafikTugasSelesaiHandler,
};