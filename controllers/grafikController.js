const Catatan = require('../models/catatan');

const getGrafikTugasSelesaiHandler = async (request, h) => {
  const { tanggalAwal } = request.query;
  const userId = request.auth.credentials.id; // Ambil ID user

  try {
    const startDate = new Date(tanggalAwal);
    const dateRange = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const grafikData = [];

    for (const tanggal of dateRange) {
      const tanggalStart = new Date(tanggal);
      tanggalStart.setHours(0, 0, 0, 0);
      
      const tanggalEnd = new Date(tanggal);
      tanggalEnd.setHours(23, 59, 59, 999);
      
      // Hitung tugas selesai pada tanggal tersebut milik user
      const jumlahTugasSelesai = await Catatan.countDocuments({
        user: userId, // Tambahkan filter user
        tanggalDeadline: {
          $gte: tanggalStart,
          $lte: tanggalEnd
        },
        status: true
      });
      
      grafikData.push({
        hari: new Date(tanggal).toLocaleDateString('id-ID', { weekday: 'long' }),
        tanggal,
        jumlahTugasSelesai,
      });
    }
    
    return h.response({ status: 'success', data: grafikData }).code(200);
  } catch (error) {
    return h.response({ status: 'error', message: `Gagal mengambil data grafik: ${error.message}` }).code(500);
  }
};

module.exports = { getGrafikTugasSelesaiHandler };