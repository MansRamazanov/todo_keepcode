import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Todo {
  id: number
  title: string
  completed: boolean
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref('')
  const filter = ref('all')

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'completed':
        return todos.value.filter((todo) => todo.completed)
      case 'active':
        return todos.value.filter((todo) => !todo.completed)
      default:
        return todos.value
    }
  })

  const fetchTodos = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error('Превышено время ожидания ответа от сервера')
        }
        if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
          throw new Error('Нет подключения к интернету или сервер недоступен')
        }
      }
      throw err
    }
  }

  const loadTodos = async () => {
    loading.value = true
    error.value = ''

    try {
      const storedTodos = localStorage.getItem('todos')
      if (storedTodos) {
        todos.value = JSON.parse(storedTodos)
      } else {
        const data = await fetchTodos()
        todos.value = data
        localStorage.setItem('todos', JSON.stringify(data))
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке задач'
      console.error('Ошибка при загрузке задач:', err)
    } finally {
      loading.value = false
    }
  }

  const addTodo = (todo: Todo) => {
    todos.value.unshift(todo)
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  const toggleTodo = (todo: Todo) => {
    todo.completed = !todo.completed
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter((todo) => todo.id !== id)
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }

  const editTodo = (todo: Todo, newTitle: string) => {
    if (newTitle && newTitle.trim()) {
      todo.title = newTitle.trim()
      localStorage.setItem('todos', JSON.stringify(todos.value))
    }
  }

  const setFilter = (newFilter: string) => {
    filter.value = newFilter
  }

  return {
    todos,
    loading,
    error,
    filter,
    filteredTodos,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setFilter,
  }
})
