const express = require('express');

const cards = express.Router();

const {
  cardsValidation,
  paramsByIdValidation,
} = require('../validator/validator');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getCard);
cards.post('/cards', cardsValidation, createCard);
cards.delete('/cards/:cardId', paramsByIdValidation, deleteCard);
cards.put('/cards/:cardId/likes', paramsByIdValidation, likeCard);
cards.delete('/cards/:cardId/likes', paramsByIdValidation, dislikeCard);

module.exports = {
  cards,
};
