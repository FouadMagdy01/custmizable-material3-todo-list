import {configureStore} from '@reduxjs/toolkit';
import themeSlice from './preferences/preferencesSlice';

export const store = configureStore({
  reducer: {
    performance: themeSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
