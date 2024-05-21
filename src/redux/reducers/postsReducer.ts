import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadingStateEnum } from '../../Types';
import { listPosts as listPostsApi } from '../../ulti/postFunctions';
import { getValueFromRedux } from '../../ulti/getValueFromRedux';
import store from '../store';

const getTimetableThunk = createAsyncThunk(
  'posts/listPosts',
  async (
    input: {
      type?: "Coding"|"Activities"
    },
    { rejectWithValue },
  ) => {
    const timetableResult = await listPostsApi(false, input.type);
    if (timetableResult.result === loadingStateEnum.success) {
      return timetableResult.data;
    }
    return rejectWithValue(null);
  },
);

export const listPosts = (type?: "Coding"|"Activities") =>
  getValueFromRedux<post[]>(
    getTimetableThunk({
     type 
    }),
    store => {
      if (store.posts.postState === loadingStateEnum.success && store.posts.type === type) {
        return store.posts.posts
      }
      return undefined
    },
    store => {
      return store.posts.postState === loadingStateEnum.loading
    },
    store,
  );


  // TODO pagination
const initalState: {
  postState: loadingStateEnum;
  posts: post[],
  type?: "Coding"|"Activities"
} = {
  postState: loadingStateEnum.notStarted,
  posts: []
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState: initalState,
  reducers: {
    setCoverState: (state, action: PayloadAction<{loadingState: loadingStateEnum.loading, id: string}|{loadingState: loadingStateEnum.failed, id: string}|{loadingState: loadingStateEnum.success, id: string, url: string}>) => {
      const index = state.posts.findIndex((e) => {return e.id === action.payload.id})
      if (index !== -1) {
        const payload = action.payload
        if (payload.loadingState === loadingStateEnum.success) {
          state.posts[index].cover = {
            ...state.posts[index].cover,
            loadingState: loadingStateEnum.success,
            url: payload.url
          }
        } else {
          state.posts[index].cover.loadingState = action.payload.loadingState
        }
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getTimetableThunk.pending, (state) => {
      state.postState = loadingStateEnum.loading
    }),
    builder.addCase(getTimetableThunk.fulfilled, (state, payload) => {
      console.log(payload.payload)
      state.postState = loadingStateEnum.success
      state.posts = payload.payload
      state.type = payload.meta.arg.type
    }),
    builder.addCase(getTimetableThunk.rejected, (state) => {
      state.postState = loadingStateEnum.failed
    });
  },
});

export default postsSlice.reducer;
