import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageStackProps {
  stack: Array<string>;
}

const initialState: PageStackProps = {
  stack: [],
}

export const pageStackSlice = createSlice({
  name: 'pageStack',
  initialState,
  reducers: {
    push: (state, action: PayloadAction<PageStackProps>) => {
      console.log('push', action.payload)
      state.stack = action.payload.stack;
    },
    pop: (state) => {
      console.log('pop')
      state.stack.pop();
    }
  }
})

// Action creators are generated for each case reducer function
export const { push, pop } = pageStackSlice.actions;

export default pageStackSlice.reducer;
