const express = require('express');

const cards = express.Router();

const {
  cardValidation,
  paramsCardByIdValidation,
} = require('../validator/validator');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getCard);
cards.post('/cards', cardValidation, createCard);
cards.delete('/cards/:cardId', paramsCardByIdValidation, deleteCard);
cards.put('/cards/:cardId/likes', paramsCardByIdValidation, likeCard);
cards.delete('/cards/:cardId/likes', paramsCardByIdValidation, dislikeCard);

module.exports = {
  cards,
};
