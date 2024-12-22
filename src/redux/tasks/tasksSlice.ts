import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TaskItem, Todo} from '../../types/appTypes';
type TaskSliceStateTypes = {
  todos: Array<Todo & TaskItem>;
};
const initialState: TaskSliceStateTypes = {
  todos: [],
};
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Todo>) => {
      state.todos = [
        ...state.todos,
        {...action.payload, isCompleted: false, id: Math.random().toString()},
      ];
    },

    toggleTaskState: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(item => item.id === action.payload);
      if (todo) {
        todo.isCompleted = !todo.isCompleted;
      }
    },
  },
  extraReducers(builder) {},
});

export const addTask = tasksSlice.actions.addTask;
export const toggleTaskState = tasksSlice.actions.toggleTaskState;
export default tasksSlice.reducer;
