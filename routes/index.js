const Joi = require('joi');
const catatanController = require('../controllers/catatanController');
const kategoriController = require('../controllers/kategoriController');
const grafikController = require('../controllers/grafikController');

const routes = [
  // Catatan routes
  {
    method: 'POST',
    path: '/catatan',
    handler: catatanController.createCatatanHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        payload: Joi.object({
          kategori: Joi.string().required(),
          namaList: Joi.string().required(),
          tanggalDeadline: Joi.string().required(),
          status: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/catatan',
    handler: catatanController.getCatatansHandler,
    options: { auth: 'jwt' } // Tambahkan otentikasi
  },
  {
    method: 'GET',
    path: '/catatan/{id}',
    handler: catatanController.getCatatanByIdHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/catatan/{id}',
    handler: catatanController.updateCatatanHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        payload: Joi.object({
          kategori: Joi.string().optional(),
          namaList: Joi.string().optional(),
          tanggalDeadline: Joi.string().optional(),
          status: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/catatan/{id}',
    handler: catatanController.deleteCatatanHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  
  // Filter route
  {
    method: 'GET',
    path: '/catatan/filter',
    handler: catatanController.getFilteredCatatansHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        query: Joi.object({
          status: Joi.boolean().optional(),
          deadlineWithin7Days: Joi.string().valid('true', 'false').optional()
        })
      }
    }
  },
  
  // TodoItem routes
  {
    method: 'POST',
    path: '/catatan/{id}/todoItem',
    handler: catatanController.tambahTodoItemHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: Joi.object({
          judul: Joi.string().required(),
          isi: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/catatan/{id}/todoItem',
    handler: catatanController.updateTodoItemHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({ id: Joi.string().required() }),
        payload: Joi.object({
          judul: Joi.string().optional(),
          isi: Joi.string().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/catatan/{id}/todoItem',
    handler: catatanController.hapusTodoItemHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        params: Joi.object({ id: Joi.string().required() })
      }
    }
  },
  
  // Bulk operation route
  {
    method: 'DELETE',
    path: '/catatan/hapusBeres',
    handler: catatanController.hapusCatatanBeresHandler,
    options: { auth: 'jwt' } // Tambahkan otentikasi
  },
  
  // Kategori routes
  {
    method: 'GET',
    path: "/kategori",
    handler: kategoriController.getKategoriHandler,
    options: { auth: 'jwt' } // Tambahkan otentikasi
  },
  {
    method: 'POST',
    path: "/kategori",
    handler: kategoriController.createKategoriHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        payload: Joi.object({
          kategori: Joi.string().required()
        })
      }
    }
  },
  
  // Grafik route
  {
    method: 'GET',
    path: '/grafik',
    handler: grafikController.getGrafikTugasSelesaiHandler,
    options: {
      auth: 'jwt', // Tambahkan otentikasi
      validate: {
        query: Joi.object({
          tanggalAwal: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .required()
            .description('Tanggal awal rentang 7 hari (format: YYYY-MM-DD)')
        })
      }
    }
  }
];

module.exports = routes;