<template>
  <div class="container">
    <!-- Логотип -->
    <div class="logo">
      <img src="@/assets/logo.png" alt="Logo" />
    </div>

    <!-- Кнопка для добавления нового блока -->
    <button @click="addNewBlock" class="add-block-button">Добавить новый блок</button>

    <!-- Список динамических блоков -->
    <div class="blocks">
      <div v-for="(block, index) in blocks" :key="block.id" class="block">
        <h2>{{ block.title }}</h2>
        <input 
          v-model="block.newItem" 
          placeholder="Добавить элемент..." 
          @keyup.enter="addItemToBlock(index)" 
        />
        <button @click="addItemToBlock(index)">Добавить</button>
        <div class="items">
          <div v-for="(item, i) in block.items" :key="i" class="item">{{ item.content }}</div>
        </div>
        <button @click="deleteBlock(block.id)">Удалить блок</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      blocks: [], // Список блоков
    };
  },
  mounted() {
    this.fetchBlocks();
  },
  methods: {
    // Загрузка блоков с сервера
    async fetchBlocks() {
      try {
        const response = await axios.get('http://localhost:3000/api/blocks');
        this.blocks = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке блоков:', error);
      }
    },

    // Добавление нового блока
    async addNewBlock() {
  const newBlockTitle = prompt('Введите название нового блока');
  if (!newBlockTitle) return;

  try {
    const response = await axios.post('http://localhost:3000/api/blocks', { title: newBlockTitle });
    console.log(response.data); // Проверка полученных данных

    this.blocks.push({
      id: response.data.id,
      title: response.data.title,
      items: [],
      newItem: "", 
    });
  } catch (error) {
    console.error('Ошибка при создании блока:', error);
  }
},
    // Добавление элемента в блок
    async addItemToBlock(index) {
  const itemText = this.blocks[index].newItem.trim();
  if (!itemText) return;

  try {
    const response = await axios.post('http://localhost:3000/api/items', {
      block_id: this.blocks[index].id,
      content: itemText,
    });

    console.log(response.data); // Проверка полученных данных
    this.blocks[index].items.push({ id: response.data.id, content: response.data.content });
    this.blocks[index].newItem = ''; // Очистка поля ввода
  } catch (error) {
    console.error('Ошибка при добавлении элемента:', error);
  }
},

    // Удаление блока
    async deleteBlock(id) {
      try {
        await axios.delete(`http://localhost:3000/api/blocks/${id}`);
        this.blocks = this.blocks.filter(block => block.id !== id); // Удаление блока из списка
      } catch (error) {
        console.error('Ошибка при удалении блока:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Общий стиль страницы */
.container {
  background-color: #1a1a1a;
  color: white;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Логотип */
.logo {
  position: absolute;
  top: 20px;
  right: 20px;
}

.logo img {
  width: 50px;
  height: auto;
}

/* Кнопка для добавления блока */
.add-block-button {
  background-color: #333;
  color: #ddd;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  margin: 15px 0;
  border-radius: 5px;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.add-block-button:hover {
  background-color: #444;
}

/* Стили для блоков */
.blocks {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
}

.block {
  background-color: #2c2c2c;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.block h2 {
  font-size: 1.5em;
  color: white;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.item {
  background-color: #383838;
  padding: 10px;
  border-radius: 5px;
  font-size: 1em;
  color: white;
}

/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-content {
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-content input {
  padding: 8px;
  font-size: 1em;
}

.modal-content button {
  background-color: #333;
  color: #ddd;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #444;
}
</style>
