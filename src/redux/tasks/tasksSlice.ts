import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {TaskItem, TodoFormData, TodosState, TodoFilter, TodoSortBy, SortOrder} from '../../types/appTypes';
import firebaseService from '../../services/firebaseService';

// Utility function to serialize Firestore timestamps to prevent Redux serialization warnings
const serializeTimestamps = (todo: TaskItem): TaskItem => {
  const serializeTimestamp = (timestamp: any): string => {
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp?.toDate) return timestamp.toDate().toISOString();
    if (timestamp instanceof Date) return timestamp.toISOString();
    return timestamp;
  };

  return {
    ...todo,
    createdAt: serializeTimestamp(todo.createdAt),
    updatedAt: serializeTimestamp(todo.updatedAt),
    dueDate: todo.dueDate ? serializeTimestamp(todo.dueDate) : todo.dueDate,
  };
};

const serializeTimestampsArray = (todos: TaskItem[]): TaskItem[] => {
  return todos.map(serializeTimestamps);
};

// Async thunks for Firebase operations
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (params: {
    limit?: number;
    sortBy?: TodoSortBy;
    sortOrder?: SortOrder;
  } = {}) => {
    const {limit = 20, sortBy = 'createdAt', sortOrder = 'desc'} = params;
    const result = await firebaseService.getTodos(limit, undefined, sortBy, sortOrder);
    return {
      todos: serializeTimestampsArray(result.todos),
      // Removed lastVisible to prevent serialization issues - pagination not currently used
    };
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData: TodoFormData) => {
    const todo = await firebaseService.createTodo(todoData);
    return serializeTimestamps(todo);
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({id, updates}: {id: string; updates: Partial<TaskItem>}) => {
    await firebaseService.updateTodo(id, updates);
    return {id, updates};
  }
);

export const toggleTodoCompletion = createAsyncThunk(
  'todos/toggleTodoCompletion',
  async (todoId: string) => {
    await firebaseService.toggleTodoCompletion(todoId);
    return todoId;
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: string) => {
    await firebaseService.deleteTodo(todoId);
    return todoId;
  }
);

export const deleteCompletedTodos = createAsyncThunk(
  'todos/deleteCompletedTodos',
  async () => {
    await firebaseService.deleteCompletedTodos();
  }
);

export const searchTodos = createAsyncThunk(
  'todos/searchTodos',
  async (searchTerm: string) => {
    const todos = await firebaseService.searchTodos(searchTerm);
    return serializeTimestampsArray(todos);
  }
);

export const getTodosByFilter = createAsyncThunk(
  'todos/getTodosByFilter',
  async (filter: TodoFilter) => {
    let todos: TaskItem[];
    switch (filter) {
      case 'completed':
        todos = await firebaseService.getTodosByCompletion(true);
        break;
      case 'pending':
        todos = await firebaseService.getTodosByCompletion(false);
        break;
      case 'high':
        todos = await firebaseService.getTodosByPriority('high');
        break;
      case 'medium':
        todos = await firebaseService.getTodosByPriority('medium');
        break;
      case 'low':
        todos = await firebaseService.getTodosByPriority('low');
        break;
      default:
        const result = await firebaseService.getTodos();
        todos = result.todos;
        break;
    }
    return serializeTimestampsArray(todos);
  }
);

const initialState: TodosState & {
  filter: TodoFilter;
  sortBy: TodoSortBy;
  sortOrder: SortOrder;
  searchQuery: string;
} = {
  todos: [],
  loading: false,
  error: null,
  hasMore: true,
  filter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Sync actions for real-time updates
    setTodos: (state, action: PayloadAction<TaskItem[]>) => {
      state.todos = serializeTimestampsArray(action.payload);
      state.loading = false;
      state.error = null;
    },
    addTodoSync: (state, action: PayloadAction<TaskItem>) => {
      state.todos.unshift(serializeTimestamps(action.payload));
    },
    updateTodoSync: (state, action: PayloadAction<{id: string; updates: Partial<TaskItem>}>) => {
      const {id, updates} = action.payload;
      const index = state.todos.findIndex(todo => todo.id === id);
      if (index !== -1) {
        state.todos[index] = {...state.todos[index], ...updates};
      }
    },
    deleteTodoSync: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    toggleTodoSync: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(item => item.id === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    setSorting: (state, action: PayloadAction<{sortBy: TodoSortBy; sortOrder: SortOrder}>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTodos: (state) => {
      state.todos = [];
      state.loading = false;
      state.error = null;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.hasMore = action.payload.todos.length > 0;
        // Removed lastVisible handling - pagination not currently used
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      });

    // Create todo
    builder
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state) => {
        state.loading = false;
        // Don't add to state here - the real-time listener will handle it
        // This prevents duplication when both the action and listener add the same todo
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create todo';
      });

    // Update todo
    builder
      .addCase(updateTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const {id, updates} = action.payload;
        const index = state.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
          state.todos[index] = {...state.todos[index], ...updates};
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update todo';
      });

    // Toggle todo completion
    builder
      .addCase(toggleTodoCompletion.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTodoCompletion.fulfilled, (state, action) => {
        const todo = state.todos.find(item => item.id === action.payload);
        if (todo) {
          todo.isCompleted = !todo.isCompleted;
        }
      })
      .addCase(toggleTodoCompletion.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle todo';
      });

    // Delete todo
    builder
      .addCase(deleteTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete todo';
      });

    // Delete completed todos
    builder
      .addCase(deleteCompletedTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompletedTodos.fulfilled, (state) => {
        state.loading = false;
        state.todos = state.todos.filter(todo => !todo.isCompleted);
      })
      .addCase(deleteCompletedTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete completed todos';
      });

    // Search todos
    builder
      .addCase(searchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(searchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search todos';
      });

    // Filter todos
    builder
      .addCase(getTodosByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodosByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(getTodosByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to filter todos';
      });
  },
});

// Export actions
export const {
  setTodos,
  addTodoSync,
  updateTodoSync,
  deleteTodoSync,
  toggleTodoSync,
  setFilter,
  setSorting,
  setSearchQuery,
  clearError,
  resetTodos,
} = tasksSlice.actions;

// Export selectors
export const selectTodos = (state: {todos: typeof initialState}) => state.todos.todos;
export const selectTodosLoading = (state: {todos: typeof initialState}) => state.todos.loading;
export const selectTodosError = (state: {todos: typeof initialState}) => state.todos.error;
export const selectTodosFilter = (state: {todos: typeof initialState}) => state.todos.filter;
export const selectTodosSort = (state: {todos: typeof initialState}) => ({
  sortBy: state.todos.sortBy,
  sortOrder: state.todos.sortOrder,
});
export const selectSearchQuery = (state: {todos: typeof initialState}) => state.todos.searchQuery;

// Export legacy actions for backward compatibility
export const addTask = createTodo;
export const toggleTaskState = toggleTodoCompletion;

export default tasksSlice.reducer;