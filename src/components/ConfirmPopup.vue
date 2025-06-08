<template>
  <div v-if="modelValue" class="popup-overlay" @click="handleOverlayClick">
    <div class="popup" @click.stop>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="popup-actions">
        <button class="cancel-button" @click="handleCancel">{{ cancelText }}</button>
        <button class="confirm-button" @click="handleConfirm">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

const handleOverlayClick = () => {
  handleCancel()
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.popup p {
  margin: 0 0 20px 0;
  color: #666;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.popup-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.cancel-button {
  background: #f5f5f5;
  color: #333;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.confirm-button {
  background: #f44336;
  color: white;
}

.confirm-button:hover {
  background: #d32f2f;
}

@media (max-width: 480px) {
  .popup {
    margin: 20px;
    width: calc(100% - 40px);
  }
}
</style>
