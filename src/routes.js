const Joi = require('joi');
const {
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
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/catatan',
        handler: createCatatanHandler,
    },
    {
        method: 'GET',
        path: '/catatan',
        handler: getCatatansHandler,
    },
    {
        method: 'GET',
        path: '/catatan/{id}',
        handler: getCatatanByIdHandler,
    },
    {
        method: 'PUT',
        path: '/catatan/{id}',
        handler: updateCatatanHandler,
    },
    {
        method: 'DELETE',
        path: '/catatan/{id}',
        handler: deleteCatatanHandler,
    },
    {
        method: 'GET',
        path: '/catatan/filter',
        handler: getFilteredCatatansHandler,
    },
    {
        method: 'POST',
        path: '/catatan/{id}/todoItem',
        handler: tambahTodoItemHandler,
    },
    {
        method: 'PUT',
        path: '/catatan/{id}/todoItem',
        handler: updateTodoItemHandler,
    },
    {
        method: 'DELETE',
        path: '/catatan/{id}/todoItem',
        handler: hapusTodoItemHandler,
    },
    {
        method: 'DELETE',
        path: '/catatan/hapusBeres',
        handler: hapusCatatanBeresHandler,
    },
    {
        method: 'GET',
        path: "/kategori",
        handler: getKategoriHandler,
    },
    {
        method: 'POST',
        path: "/kategori",
        handler: createKategoriHandler,
    },
    {
        method: 'GET', // Method yang benar untuk endpoint grafik
        path: '/grafik',
        handler: getGrafikTugasSelesaiHandler,
        options: {
            validate: {
                query: Joi.object({
                    tanggalAwal: Joi.string()
                        .pattern(/^\d{4}-\d{2}-\d{2}$/)
                        .required()
                        .description('Tanggal awal rentang 7 hari (format: YYYY-MM-DD)'),
                }),
            },
        },
    }
];

module.exports = routes;