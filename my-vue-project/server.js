const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: 'qwerty050',  
  database: 'blocks_db'   
});

db.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключение к базе данных установлено.');
});


app.use(cors());


app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'dist')));


app.get('/api/blocks', (req, res) => {
  const query = 'SELECT * FROM blocks';
  db.query(query, (err, blocks) => {
    if (err) {
      console.error('Ошибка получения блоков:', err);
      return res.status(500).json({ error: 'Ошибка сервера' });
    }

    
    const blockIds = blocks.map(block => block.id);
    const itemQuery = 'SELECT * FROM items WHERE block_id IN (?)';
    db.query(itemQuery, [blockIds], (err, items) => {
      if (err) {
        console.error('Ошибка получения элементов:', err);
        return res.status(500).json({ error: 'Ошибка сервера' });
      }

      
      blocks.forEach(block => {
        block.items = items.filter(item => item.block_id === block.id);
      });

      res.json(blocks); 
    });
  });
});


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


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
