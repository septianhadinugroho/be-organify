require('dotenv').config();

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const routes = require('./routes');

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  // Register routes
  server.route(routes);

  // Default route
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Todo API with MongoDB Atlas';
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();