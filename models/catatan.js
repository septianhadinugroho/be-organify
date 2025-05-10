const mongoose = require('mongoose');

// Define the TodoItem schema (subdocument)
const todoItemSchema = new mongoose.Schema({
  judul: {
    type: String,
    required: true
  },
  isi: {
    type: String,
    required: true
  },
  terakhirDiperbarui: {
    type: Date,
    default: Date.now
  }
});

// Define the main Catatan schema
const catatanSchema = new mongoose.Schema({
  kategori: {
    type: String,
    required: true
  },
  namaList: {
    type: String,
    required: true
  },
  tanggalDeadline: {
    type: Date,
    required: true
  },
  dibuatPada: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: false
  },
  todoItem: todoItemSchema
});

// Create indexes for improved query performance
catatanSchema.index({ status: 1 });
catatanSchema.index({ kategori: 1 });
catatanSchema.index({ tanggalDeadline: 1 });

const Catatan = mongoose.model('Catatan', catatanSchema);

module.exports = Catatan;