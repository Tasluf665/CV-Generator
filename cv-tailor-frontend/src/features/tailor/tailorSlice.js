import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suggestions: [],
  isAnalysing: false,
  error: null,
};

const tailorSlice = createSlice({
  name: 'tailor',
  initialState,
  reducers: {
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setAnalysing: (state, action) => {
      state.isAnalysing = action.payload;
    },
  },
});

export const { setSuggestions, setAnalysing } = tailorSlice.actions;
export default tailorSlice.reducer;
