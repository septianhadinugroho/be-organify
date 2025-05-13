require('dotenv').config();

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const Jwt = require('hapi-auth-jwt2');

const routes = require('./routes');
const userRoutes = require('./routes/userRoutes');

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

  // JWT Auth setup
  await server.register(Jwt);
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
      return { isValid: true };
    },
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Register all routes
  server.route([...routes, ...userRoutes]);

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