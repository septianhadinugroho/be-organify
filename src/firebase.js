const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database'); // Menggunakan Realtime Database
const serviceAccount = require('../organify4-aecf35cf7b3e.json'); // Ganti dengan path ke file service account Anda

// Inisialisasi Firebase
initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://organify4-default-rtdb.asia-southeast1.firebasedatabase.app/' // Ganti dengan URL Realtime Database Anda
});

// Inisialisasi Realtime Database
const db = getDatabase();
module.exports = db;