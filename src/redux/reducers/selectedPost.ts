import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { loadingStateEnum } from '../../Types';

const empty: post = {
  title: '',
  cover: {
    name: '',
    fileType: '',
    loadingState: loadingStateEnum.success,
    url: ''
  },
  assests: [],
  content: '',
  updated: '',
  type: '',
  id: 'empty',
  url: '',
  technologies: [],
  status: '',
  githubUrl: '',
  hidden: false,
  views: []
}

const initalState: post = empty

export const selectedPostSlice = createSlice({
  name: 'selectedPost',
  initialState: initalState,
  reducers: {
    setSelectedPost: (_state, action: PayloadAction<post | undefined>) => {
      if (action.payload === undefined) {
        return empty
      }
      return action.payload
    }
  },
});

export default selectedPostSlice.reducer;
