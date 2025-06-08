<template>
  <div class="add-todo">
    <input
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="Добавить новую задачу..."
      type="text"
    />
    <button @click="addTodo" :disabled="!newTodo.trim()">Добавить</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'

const store = useTodoStore()
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    store.addTodo({
      id: Date.now(),
      title: newTodo.value.trim(),
      completed: false,
    })
    newTodo.value = ''
  }
}
</script>

<style scoped>
.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.add-todo button {
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-todo button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-todo button:hover:not(:disabled) {
  background: #45a049;
}

@media (max-width: 480px) {
  .add-todo {
    flex-direction: column;
  }

  .add-todo button {
    width: 100%;
  }
}
</style>
