const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт
const { users } = require('./routes/users');
const { cards } = require('./routes/cards');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6273e90c13add9d629248071', // вставьте сюда _id созданного в предыдущем пункте пользователя, временное решение авторизации
  };
  next();
});

app.get('/', (req, res) => {
  res.send(req.body);
});

app.use('/', users);
app.use('/', cards);

app.use((req, res) => {
  res.status(404).send({ message: 'Ooops! Page not found' });
});

// подключаемся к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`);
  });
}

main();
