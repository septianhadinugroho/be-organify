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
    handler: catatanController.getCatatansHandler
  },
  {
    method: 'GET',
    path: '/catatan/{id}',
    handler: catatanController.getCatatanByIdHandler,
    options: {
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
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
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
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
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
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  
  // Bulk operation route
  {
    method: 'DELETE',
    path: '/catatan/hapusBeres',
    handler: catatanController.hapusCatatanBeresHandler
  },
  
  // Kategori routes
  {
    method: 'GET',
    path: "/kategori",
    handler: kategoriController.getKategoriHandler
  },
  {
    method: 'POST',
    path: "/kategori",
    handler: kategoriController.createKategoriHandler,
    options: {
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