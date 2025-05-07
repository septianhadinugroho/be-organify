require('dotenv').config();

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');

// koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3001,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello Hapi with MongoDB Atlas!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();