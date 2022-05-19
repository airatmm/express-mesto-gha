const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCard = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate('owner').exec();
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const owner = req.userId;
    const { name, link } = req.body;
    const card = new Card({ name, link, owner });
    res.status(201).send(await card.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Поля должны быть заполнены createCard'));
      // res.status(400).send({
      //   message: `Произошла ошибка. Поля должны быть заполнены: ${err.message}`,
      // });
      return;
    }
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    const cardOwner = await card.owner.toString();
    console.log(card);
    if (!card) {
      next(new NotFoundError('Нет карточки с таким id deleteCard'));
      //  res.status(404).send({ message: 'Нет карточки с таким id' });
      return;
    }
    if (cardOwner !== req.userId) {
      next(new ForbiddenError('Нельзя удалить чужие карточки'));
      return;
    }
    res.status(200).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки deleteCard'));
      // res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.userId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!like) {
      next(new NotFoundError('Нет карточки с таким id likeCard'));
      // res.status(404).send({ message: 'Нет карточки с таким id' });
      return;
    }
    res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки likeCard'));
      // res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.userId } }, // убрать _id из массива
      { new: true },
    );
    if (!like) {
      next(new NotFoundError('Нет карточки с таким id dislikeCard'));
      // res.status(404).send({ message: 'Нет карточки с таким id' });
      return;
    }
    res.status(200).send(like);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный id карточки dislikeCard'));
      // res.status(400).send({ message: 'Некорректный id карточки' });
      return;
    }
    next(err);
  }
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
