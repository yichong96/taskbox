/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const TaskBoxData = {
    tasks: [],
    status: 'idle',
    error: null,
  };

export const fetchTasks = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?userId=1'
    );
    const data = await response.json();
    const result = data.map((task) => ({
        id: `${task.id}`,
        title: task.title,
        state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
    }))
    return result;
})


  /*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
    name: 'taskbox',
    initialState: TaskBoxData,
    reducers: {
      updateTaskState: (state, action) => {
        const { id, newTaskState } = action.payload;
        const task = state.tasks.findIndex((task) => task.id === id);
        if (task >= 0) {
          state.tasks[task].state = newTaskState;
        }
      },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading',
                state.error = null;
                state.tasks = [];
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded',
                state.error = null;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.status = 'failed';
                state.error = 'Something went wrong';
                state.tasks = [];
            })
    }
});


// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;