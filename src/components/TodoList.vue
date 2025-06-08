<template>
  <div class="todo-list">
    <h2>Список задач</h2>
    <div v-if="store.loading" class="loading">Загрузка задач...</div>
    <div v-else-if="store.error" class="error">
      {{ store.error }}
      <button @click="store.loadTodos" class="retry-button">Повторить</button>
    </div>
    <template v-else>
      <div class="filters">
        <button :class="{ active: store.filter === 'all' }" @click="store.setFilter('all')">
          Все
        </button>
        <button
          :class="{ active: store.filter === 'completed' }"
          @click="store.setFilter('completed')"
        >
          Выполненные
        </button>
        <button :class="{ active: store.filter === 'active' }" @click="store.setFilter('active')">
          Активные
        </button>
      </div>
      <div class="todos">
        <div v-for="todo in store.filteredTodos" :key="todo.id" class="todo-item">
          <input type="checkbox" :checked="todo.completed" @change="store.toggleTodo(todo)" />
          <template v-if="editingTodoId === todo.id">
            <EditTodo :todo="todo" @save="handleSaveEdit" @cancel="cancelEdit" />
          </template>
          <template v-else>
            <span :class="{ completed: todo.completed }">{{ todo.title }}</span>
          </template>
          <div class="actions">
            <button v-if="editingTodoId !== todo.id" @click="startEdit(todo)" class="edit">
              ✎
            </button>
            <button @click="confirmDelete(todo)" class="delete">×</button>
          </div>
        </div>
      </div>
    </template>

    <ConfirmPopup
      v-model="showDeleteConfirm"
      title="Удалить задачу"
      message="Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить."
      confirm-text="Удалить"
      cancel-text="Отмена"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import type { Todo } from '../stores/todoStore'
import EditTodo from './EditTodo.vue'
import ConfirmPopup from './ConfirmPopup.vue'

const store = useTodoStore()
const editingTodoId = ref<number | null>(null)
const showDeleteConfirm = ref(false)
const todoToDelete = ref<Todo | null>(null)

const startEdit = (todo: Todo) => {
  editingTodoId.value = todo.id
}

const handleSaveEdit = (newTitle: string) => {
  const todo = store.todos.find((t) => t.id === editingTodoId.value)
  if (todo) {
    store.editTodo(todo, newTitle)
  }
  editingTodoId.value = null
}

const cancelEdit = () => {
  editingTodoId.value = null
}

const confirmDelete = (todo: Todo) => {
  todoToDelete.value = todo
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = () => {
  if (todoToDelete.value) {
    store.deleteTodo(todoToDelete.value.id)
    todoToDelete.value = null
  }
}

onMounted(() => {
  store.loadTodos()
})
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #f44336;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #45a049;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.filters button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.filters button.active {
  background: #4caf50;
  color: white;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-item span {
  flex: 1;
  margin: 0 10px;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.todo-item span.completed {
  text-decoration: line-through;
  color: #888;
}

.actions {
  display: flex;
  gap: 5px;
}

.actions button {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0 5px;
}

.actions .edit {
  color: #2196f3;
}

.actions .delete {
  color: #f44336;
}

@media (max-width: 480px) {
  .todo-list {
    padding: 10px;
  }

  .filters {
    flex-wrap: wrap;
  }

  .filters button {
    flex: 1;
    min-width: 100px;
  }
}
</style>
