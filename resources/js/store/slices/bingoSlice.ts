import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bingoApi } from "@/services/bingoApi";



interface BingoState {
  bingoGame: BingoGame | null;
  isActive: boolean;
}

const initialState: BingoState = {
  bingoGame: null,
  isActive: false,
};

const bingoSlice = createSlice({
  name: "bingo",
  initialState,
  reducers: {
    startBingo: (state, action: PayloadAction<BingoGame>) => {
      state.bingoGame = action.payload;
      state.isActive = true;
    },
    resetBingo: (state) => {
      state.bingoGame = null;
      state.isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        bingoApi.endpoints.createBingoGame.matchFulfilled,
        (state, { payload }) => {
          state.bingoGame = payload;
          state.isActive = true;
        }
      )
      .addMatcher(
        bingoApi.endpoints.createBingoGame.matchRejected,
        (state) => {
          state.bingoGame = null;
          state.isActive = false;
        }
      );
  },
});

export const { startBingo, resetBingo } = bingoSlice.actions;
export default bingoSlice.reducer;
