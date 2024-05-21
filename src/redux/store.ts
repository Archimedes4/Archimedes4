import { configureStore } from '@reduxjs/toolkit';
import dimentionsReducer from './reducers/dimentionsReducer';
import postsReducer from './reducers/postsReducer';


const store = configureStore({
  reducer: {
    dimentions: dimentionsReducer,
    posts: postsReducer
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

export type StoreType = typeof store;