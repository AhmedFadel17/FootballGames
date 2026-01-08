import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bingoApi } from "@/services/bingoApi";

interface GuessThePlayerState {
  bingoGame: BingoGame | null;
  conditions: BingoCondition[];
  matcher: BingoMatch | null;
  isActive: boolean;
  isFinished: boolean;
  totalAnswers: number;
}

const initialState: GuessThePlayerState = {
  bingoGame: null,
  matcher: null,
  conditions: [],
  isActive: false,
  isFinished: false,
  totalAnswers: 40
};

const bingoSlice = createSlice({
  name: "bingo",
  initialState,
  reducers: {
    startBingo: (state, action: PayloadAction<BingoGame>) => {
      state.bingoGame = action.payload;
      state.totalAnswers = action.payload.remaining_answers;
      state.isActive = true;
    },
    resetBingo: (state) => {
      state.bingoGame = null;
      state.matcher = null;
      state.conditions = [];
      state.isActive = false;
      state.isFinished = false;
    },
    setConditions: (state, action: PayloadAction<BingoCondition[]>) => {
      state.conditions = action.payload;
    },
    setMatcher: (state, action: PayloadAction<BingoMatch>) => {
      state.matcher = action.payload;
      if (state.bingoGame) {
        state.bingoGame.remaining_answers = state.totalAnswers - (action.payload.pos + 1);
      }
    },
    updateCondition: (state, action: PayloadAction<BingoCondition>) => {
      state.conditions = state.conditions.map((c) =>
        c.pos === action.payload.pos ? action.payload : c
      );
      if (!state.bingoGame) {
        return;
      }
      const unMarked = state.conditions.filter((c) => c.is_marked === false).length;
      if (state.bingoGame.remaining_answers == 0 || unMarked === 0 || (state.bingoGame.remaining_answers == 1 && action.payload.bingo_match_id == null)) {
      state.isFinished = true;
      }
    },
    finishGame: (state) => {
      state.isFinished = true;
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

export const {
  startBingo,
  resetBingo,
  setConditions,
  setMatcher,
  updateCondition,
  finishGame
} = bingoSlice.actions;

export default bingoSlice.reducer;
