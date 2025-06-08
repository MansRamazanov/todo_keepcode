<template>
  <div class="edit-todo">
    <input
      ref="inputRef"
      v-model="editedTitle"
      @keyup.esc="cancelEdit"
      type="text"
      class="edit-input"
    />
    <div class="edit-actions">
      <button class="save-button" @click="saveEdit">Сохранить</button>
      <button class="cancel-button" @click="cancelEdit">Отмена</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Todo } from '../stores/todoStore'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  (e: 'save', title: string): void
  (e: 'cancel'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const editedTitle = ref(props.todo.title)

const saveEdit = () => {
  if (editedTitle.value.trim()) {
    emit('save', editedTitle.value.trim())
  } else {
    cancelEdit()
  }
}

const cancelEdit = () => {
  emit('cancel')
}

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.edit-todo {
  flex: 1;
  margin: 0 10px;
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #2196f3;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.edit-input:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.edit-actions {
  display: flex;
  gap: 5px;
}

.edit-actions button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.save-button {
  background: #4caf50;
  color: white;
}

.save-button:hover {
  background: #45a049;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
}

.cancel-button:hover {
  background: #e0e0e0;
}

@media (max-width: 550px) {
  .edit-todo {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    width: 100%;
  }

  .edit-input {
    width: 100%;
    max-width: 100%;
  }

  .edit-actions {
    justify-content: flex-end;
  }

  .edit-actions button {
    flex: 1;
    padding: 8px;
    font-size: 16px;
  }
}
</style>
