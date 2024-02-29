const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/sendMessage', (req, res) => {
  const { name, lastName, email, phoneNumber, message } = req.body;

  if (!name || !lastName || !email || !message) {
    return res.status(400).json({ success: false, error: 'Отсутствуют обязательные поля' });
  }

  const messageToTelegram = `
    Новая заявка!\n\n
    Имя: ${name}\n
    Фамилия: ${lastName}\n
    Email: ${email}\n
    Телефон: ${phoneNumber}\n
    Сообщение: ${message}
  `;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const telegramData = {
    chat_id: chatId,
    text: messageToTelegram,
  };

  axios.post(telegramUrl, telegramData)
    .then(response => {
      console.log('Сообщение успешно отправлено в Telegram');
      res.json({ success: true });
    })
    .catch(error => {
      console.error('Ошибка отправки сообщения в Telegram:', error);
      res.status(500).json({ success: false, error: 'Ошибка отправки сообщения в Telegram' });
    });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
