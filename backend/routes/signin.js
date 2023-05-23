const express = require('express');

const { celebrate, Joi } = require('celebrate');

const { login } = require('../controllers/users');

const signInRouter = express.Router();

signInRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

module.exports = signInRouter;
