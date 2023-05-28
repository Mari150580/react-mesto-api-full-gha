const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AccessRightsError = require('../errors/AccessRightsError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      card.populate(['owner'])
        .then(() => res.status(201).send(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Error validation card'));
      } else {
        next(err);
      }
    });
};
// eslint-disable-next-line consistent-return
const deleteCard = async (req, res, next) => {
  try {
    const findedCard = await Card.findById(req.params.cardId)
    //  .populate(['owner', 'likes'])
      .orFail();
    const deletedCard = await Card.deleteOne({
      _id: findedCard._id,
      owner: req.user._id,
    });
    if (deletedCard.deletedCount === 0) {
      next(new AccessRightsError('Ошибка доступа! Карточка с данным не принадлежит пользователю'));
    } else {
      return res
        .status(200)
        .send({ message: 'Карточка удалена успешно и без ошибок' });
    }
  } catch (err) {
    if (err.name === 'DocumentNotFoundError') { // проверка _id не существует в базе
      return next(new NotFoundError('Not found'));
    }
    next(err);
  }
};

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Card not found'));
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        next(new BadRequestError('Not found'));
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        next(new NotFoundError('Not found'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Card not found'));
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      // проверка _id не валидный
      if (err.name === 'CastError') {
        next(new BadRequestError('Not found'));
      } else if (err.name === 'Error') { // проверка _id не существует в базе
        next(new NotFoundError('Not found'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
