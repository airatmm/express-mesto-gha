const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');

const { validateUser, validateLogin } = require('./validator/validator');

const app = express();

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.use(cookieParser()); // подключаем парсер кук как мидлвэр

  app.get('/', (req, res) => {
    res.send(req.body);
  });

  // мидлвэр c методом express.json(),
  // встроенный в express для распознавания входящего объекта запроса как объекта JSON.
  app.use(express.json());
  app.post('/signin', validateLogin, login);
  app.post('/signup', validateUser, createUser);

  app.use(auth); // защищаем все роуты ниже, нет доступа неавторизованным пользователям
  app.use('/', users);
  app.use('/', cards);

  app.use(errors()); // обработчик ошибок celebrate

  app.use((req, res) => {
    res.status(404).send({ message: 'Ooops! Page not found' });
  });

  app.use((err, req, res, next) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
    next();
  });

  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

main();
