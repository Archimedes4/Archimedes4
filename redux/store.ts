import { configureStore } from '@reduxjs/toolkit';
import dimentionsReducer from './dimentionsReducer';


const store = configureStore({
  reducer: {
    dimentions: dimentionsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
    }),
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
