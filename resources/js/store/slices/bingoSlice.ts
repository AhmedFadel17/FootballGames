import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BingoState {
  isActive: boolean;
  size:number;
}

const initialState: BingoState = {
  isActive:false,
  size:3
};

const bingoSlice = createSlice({
  name: "bingo",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    startBingo: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
      state.isActive=true
    },
  },
});

export const { increment, decrement, startBingo } = bingoSlice.actions;
export default bingoSlice.reducer;
