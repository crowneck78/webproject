const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Раздача статических файлов из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// Обработка маршрутов и отправка index.html для всех путей (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
