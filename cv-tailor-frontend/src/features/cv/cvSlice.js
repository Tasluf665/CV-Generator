import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCv: null,
  cvList: [],
  isLoading: false,
  error: null,
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCv: (state, action) => {
      state.currentCv = action.payload;
    },
    setCvList: (state, action) => {
      state.cvList = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCv, setCvList, setLoading } = cvSlice.actions;
export default cvSlice.reducer;
