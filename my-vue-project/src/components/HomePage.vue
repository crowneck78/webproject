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

    <!-- Виджет погоды -->
    <div class="weather">
      <h3>Погода в Санкт-Петербурге</h3>
      <p v-if="weather">
        Температура: {{ weather.temperature }}°C<br>
        Скорость ветра: {{ weather.windspeed }} км/ч
      </p>
      <p v-else>Загрузка погоды...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      blocks: [],
      weather: null,
    };
  },
  mounted() {
    this.fetchBlocks();
    this.fetchWeather();
  },
  methods: {
    async fetchBlocks() {
      try {
        const response = await axios.get('http://localhost:3000/api/blocks');
        this.blocks = response.data;
      } catch (error) {
        console.error('Ошибка при загрузке блоков:', error);
      }
    },
    async addNewBlock() {
      const newBlockTitle = prompt('Введите название нового блока');
      if (!newBlockTitle) return;
      try {
        const response = await axios.post('http://localhost:3000/api/blocks', { title: newBlockTitle });
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
    async addItemToBlock(index) {
      const itemText = this.blocks[index].newItem.trim();
      if (!itemText) return;
      try {
        const response = await axios.post('http://localhost:3000/api/items', {
          block_id: this.blocks[index].id,
          content: itemText,
        });
        this.blocks[index].items.push({ id: response.data.id, content: response.data.content });
        this.blocks[index].newItem = '';
      } catch (error) {
        console.error('Ошибка при добавлении элемента:', error);
      }
    },
    async deleteBlock(id) {
      try {
        await axios.delete(`http://localhost:3000/api/blocks/${id}`);
        this.blocks = this.blocks.filter(block => block.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении блока:', error);
      }
    },
    async fetchWeather() {
      try {
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: 59.9343,
            longitude: 30.3351,
            current_weather: true,
          }
        });
        this.weather = response.data.current_weather;
      } catch (error) {
        console.error('Ошибка при загрузке погоды:', error);
      }
    }
  },
};
</script>

<style scoped>
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

.logo {
  position: absolute;
  top: 20px;
  right: 20px;
}

.logo img {
  width: 50px;
  height: auto;
}

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

.weather {
  margin-top: 20px;
  color: white;
}
</style>
