const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');


const app = express();

app.use(cookieParser()) //подключаем парсер кук как мидлвэр

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  // перед сдачей проекта удалить
  // app.use((req, res, next) => {
  //   console.log(req.method, req.url);
  //   next();
  // });

  // app.use((req, res, next) => {
  //   req.user = {
  //     _id: '62825e415b228a6658d70b4c', // вставьте сюда _id созданного в предыдущем пункте пользователя, временное решение авторизации
  //   };
  //   next();
  // });

  app.get('/', (req, res) => {
    res.send(req.body);
  });

  app.post('/signin', express.json(), login);
  app.post('/signup', express.json(), createUser);

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
