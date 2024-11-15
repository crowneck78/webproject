const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Настройка подключения к базе данных MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Замените на имя пользователя MySQL
  password: 'qwerty050',  // Замените на пароль MySQL
  database: 'blocks_db'   // Название вашей базы данных
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных установлено.');
});

// Разрешение CORS для фронтенд-запросов
app.use(cors());

// Настройка bodyParser для обработки JSON запросов
app.use(bodyParser.json());

// Раздача статических файлов из папки dist
app.use(express.static(path.join(__dirname, 'dist')));

// API маршрут для получения всех блоков и их элементов
app.get('/api/blocks', (req, res) => {
  const query = 'SELECT * FROM blocks';
  db.query(query, (err, blocks) => {
    if (err) {
      console.error('Ошибка получения блоков:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    // Для каждого блока получаем его элементы
    const blockIds = blocks.map(block => block.id);
    const itemQuery = 'SELECT * FROM items WHERE block_id IN (?)';
    db.query(itemQuery, [blockIds], (err, items) => {
      if (err) {
        console.error('Ошибка получения элементов:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      // Добавляем элементы к каждому блоку
      blocks.forEach(block => {
        block.items = items.filter(item => item.block_id === block.id);
      });

      res.json(blocks); // Отправляем блоки с элементами
    });
  });
});

// API маршрут для создания нового блока
app.post('/api/blocks', (req, res) => {
  const { title } = req.body;
  const query = 'INSERT INTO blocks (title) VALUES (?)';
  db.query(query, [title], (err, result) => {
    if (err) {
      console.error('Ошибка создания блока:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json({ id: result.insertId, title });
  });
});

// API маршрут для добавления элемента в блок
app.post('/api/items', (req, res) => {
  const { block_id, content } = req.body;

  if (!block_id || !content) {
    return res.status(400).json({ error: 'Не указаны данные для добавления элемента' });
  }

  const query = 'INSERT INTO items (block_id, content) VALUES (?, ?)';
  db.query(query, [block_id, content], (err, result) => {
    if (err) {
      console.error('Ошибка добавления элемента:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    res.json({ id: result.insertId, content });
  });
});

// API маршрут для удаления блока и связанных элементов
app.delete('/api/blocks/:id', (req, res) => {
  const blockId = req.params.id;
  const deleteItemsQuery = 'DELETE FROM items WHERE block_id = ?';
  const deleteBlockQuery = 'DELETE FROM blocks WHERE id = ?';

  db.query(deleteItemsQuery, [blockId], (err) => {
    if (err) {
      console.error('Ошибка удаления элементов блока:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    db.query(deleteBlockQuery, [blockId], (err) => {
      if (err) {
        console.error('Ошибка удаления блока:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      } else {
        res.json({ message: 'Блок и его элементы удалены' });
      }
    });
  });
});

// Обработка маршрутов и отправка index.html для всех путей (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
