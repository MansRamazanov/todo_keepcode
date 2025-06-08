<script setup lang="ts">
import { ref } from 'vue'
import AddTodo from './components/AddTodo.vue'
import TodoList from './components/TodoList.vue'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const todoList = ref<InstanceType<typeof TodoList> | null>(null)

const addTodo = (todo: Todo) => {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]')
  todos.unshift(todo)
  localStorage.setItem('todos', JSON.stringify(todos))
  todoList.value?.loadTodos()
}
</script>

<template>
  <div class="app">
    <h1>Todo List</h1>
    <AddTodo />
    <TodoList />
  </div>
</template>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

body {
  margin: 0;
  background: #f5f5f5;
}

@media (max-width: 480px) {
  .app {
    padding: 10px;
  }
}
</style>
