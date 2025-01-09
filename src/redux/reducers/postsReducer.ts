import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadingStateEnum } from '@types';
import { listPosts as listPostsApi, getPost as getPostApi } from '@functions/postFunctions';
import { getValueFromRedux } from '@functions/getValueFromRedux';
import store from '../store';

const listPostsThunk = createAsyncThunk(
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

export function listPosts(type?: "Coding"|"Activities") {
  return getValueFromRedux<post[]>(
    listPostsThunk({
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
}

export async function getPost(id: string) {
  const post = store.getState().posts.posts.find((e) => {return e.id === id})
  if (post !== undefined) {
    return {
      result: loadingStateEnum.success,
      data: post
    }
  } else {
    const result = await getPostApi(id)
    return result
  }
}

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
    builder.addCase(listPostsThunk.pending, (state) => {
      state.postState = loadingStateEnum.loading
    }),
    builder.addCase(listPostsThunk.fulfilled, (state, payload) => {
      console.log(payload.payload)
      state.postState = loadingStateEnum.success
      state.posts = payload.payload
      state.type = payload.meta.arg.type
    }),
    builder.addCase(listPostsThunk.rejected, (state) => {
      state.postState = loadingStateEnum.failed
    });
  },
});

export default postsSlice.reducer;
