<template>
    <div>
      <section>
        <h2>База Знаний</h2>
        <p>Организуйте свои заметки и исследуйте взаимосвязанные идеи с умными ссылками.</p>
        <button @click="addNote">Добавить заметку</button>
        <div v-for="(note, index) in notes" :key="index" class="item">{{ note }}</div>
      </section>
  
      <section>
        <h2>Управление Проектами</h2>
        <p>Разбейте большие проекты на задачи, устанавливайте сроки и отслеживайте прогресс.</p>
        <button @click="addTask">Добавить задачу</button>
        <div v-for="(task, index) in tasks" :key="index" class="item">{{ task }}</div>
      </section>
  
      <section>
        <h2>Трекер Привычек и Целей</h2>
        <p>Отслеживайте свои ежедневные привычки и долгосрочные цели с визуальными отчетами о прогрессе.</p>
        <button @click="addGoal">Добавить цель</button>
        <div v-for="(goal, index) in goals" :key="index" class="item">{{ goal }}</div>
      </section>
    </div>
  </template>
  
  <script>
export default {
  name: "HomePage",  // Обновляем имя компонента на многосложное
  data() {
    return {
      notes: [],
      tasks: [],
      goals: []
    };
  },
  methods: {
    addNote() {
      this.notes.push("Новая заметка");
    },
    addTask() {
      this.tasks.push("Новая задача");
    },
    addGoal() {
      this.goals.push("Новая цель");
    }
  }
};
</script>
  
  <style>
  section {
    margin-bottom: 20px;
  }
  
  h2 {
    color: #4CAF50;
  }
  
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin: 10px 0;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  .item {
    background: #f1f1f1;
    padding: 10px;
    margin: 5px 0;
  }
  </style>
  