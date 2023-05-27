/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const BodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const validationErrors = require('celebrate').errors;
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users'); // импортируем роутер
const cardsRouter = require('./routes/cards');
const signupRouter = require('./routes/signup');
const signInRouter = require('./routes/signin');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/limiter');
const { PORT, DB_ADDRESS } = require('./config');

const app = express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(helmet());

// корс изменили
// app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'] }));
app.use(cors());

app.use(limiter);

// подключаем мидлвары, роуты и всё остальное...

app.use(requestLogger); // подключаем логгер запросов

// Краш-тест
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/signup', signupRouter);

app.use('/signin', signInRouter);

app.use('/users', usersRouter); // Подключаем роутеры

app.use('/cards', cardsRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('URL does not exist'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(validationErrors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
