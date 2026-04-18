import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLetter: null,
  isGenerating: false,
};

const coverLetterSlice = createSlice({
  name: 'coverLetter',
  initialState,
  reducers: {
    setLetter: (state, action) => {
      state.currentLetter = action.payload;
    },
    setGenerating: (state, action) => {
      state.isGenerating = action.payload;
    },
  },
});

export const { setLetter, setGenerating } = coverLetterSlice.actions;
export default coverLetterSlice.reducer;
