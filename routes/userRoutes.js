const Joi = require('joi');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

const validateToken = (decoded, request, h) => {
  return { isValid: true };
};

module.exports = [
  {
    method: 'POST',
    path: '/signup',
    handler: userController.signupHandler,
    options: {
      validate: {
        payload: Joi.object({
          nama: Joi.string().required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(6).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/verify-otp',
    handler: userController.verifyOtpHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          otp: Joi.string().length(6).required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/verify-email',
    handler: userController.verifyEmailByTokenHandler,
  },
  {
    method: 'POST',
    path: '/login',
    handler: userController.loginHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/forgot-password',
    handler: userController.forgotPasswordHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/reset-password',
    handler: userController.resetPasswordHandler,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          otp: Joi.string().length(6).required(),
          newPassword: Joi.string().min(6).required()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/delete-account',
    handler: userController.deleteAccountHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/me',
    handler: userController.getMeHandler,
    options: {
      auth: 'jwt' // Endpoint ini memerlukan otentikasi
    }
  }
];