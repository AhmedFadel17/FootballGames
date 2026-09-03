import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { bingoGameApi } from '@/store/apis';
import {
  BingoCondition,
  BingoGameInstance,
  BingoMatch,
  BingoGuess,
} from '@/types';

interface BingoState {
  bingoInstance: BingoGameInstance | null;
  conditions: BingoCondition[];
  currentMatch: BingoMatch | null;
  guesses: BingoGuess[];
  isActive: boolean;
  isFinished: boolean;
}

const initialState: BingoState = {
  bingoInstance: null,
  conditions: [],
  currentMatch: null,
  guesses: [],
  isActive: false,
  isFinished: false,
};

const bingoSlice = createSlice({
  name: 'bingo',
  initialState,
  reducers: {
    startBingo: (state, action: PayloadAction<BingoGameInstance>) => {
      state.bingoInstance = action.payload;
      if (action.payload.conditions && action.payload.conditions.length > 0) {
        state.conditions = action.payload.conditions;
      }
      if (action.payload.current_match) {
        state.currentMatch = action.payload.current_match;
      }
      if (action.payload.guesses) {
        state.guesses = action.payload.guesses;
      }
      state.isActive = true;
      state.isFinished = false;
    },
    resetBingo: (state) => {
      state.bingoInstance = null;
      state.conditions = [];
      state.currentMatch = null;
      state.guesses = [];
      state.isActive = false;
      state.isFinished = false;
    },
    setConditions: (state, action: PayloadAction<BingoCondition[]>) => {
      state.conditions = action.payload;
    },
    setCurrentMatch: (state, action: PayloadAction<BingoMatch>) => {
      state.currentMatch = action.payload;
    },
    recordGuess: (state, action: PayloadAction<BingoGuess>) => {
      state.guesses.push(action.payload);

      if (typeof action.payload.remaining_answers === 'number' && state.bingoInstance) {
        state.bingoInstance.remaining_answers = action.payload.remaining_answers;
      } else if (state.bingoInstance && state.bingoInstance.remaining_answers > 0) {
        state.bingoInstance.remaining_answers -= 1;
      }

      if (action.payload.next_match) {
        state.currentMatch = action.payload.next_match;
      }

    },
    setIsFinished: (state, action: PayloadAction<boolean>) => {
      state.isFinished = action.payload;
    },
    finishGame: (state) => {
      state.isFinished = true;
      state.isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Start Game lifecycle matching API state
      .addMatcher(
        bingoGameApi.endpoints.startBingoGame.matchFulfilled,
        (state, { payload }) => {
          state.bingoInstance = payload.data;
          if (payload.data.conditions && payload.data.conditions.length > 0) {
            state.conditions = payload.data.conditions;
          }
          if (payload.data.current_match) {
            state.currentMatch = payload.data.current_match;
          }
          if (payload.data.guesses) {
            state.guesses = payload.data.guesses;
          }
          state.isActive = true;
          state.isFinished = false;
        }
      )
      .addMatcher(
        bingoGameApi.endpoints.startBingoGame.matchRejected,
        (state) => {
          state.bingoInstance = null;
          state.isActive = false;
        }
      )
      // Keep current match synchronized on query response
      .addMatcher(
        bingoGameApi.endpoints.getNextBingoMatch.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.currentMatch = payload.data;
          }
        }
      )
      // Keep current match and remaining answers synchronized on skip
      .addMatcher(
        bingoGameApi.endpoints.skipBingoMatch.matchFulfilled,
        (state, { payload }) => {
          if (state.bingoInstance && state.bingoInstance.remaining_answers > 0) {
            state.bingoInstance.remaining_answers -= 1;
          }
          if (payload.data) {
            state.currentMatch = payload.data.match;
          }
          if (payload.data.is_complete) {
            state.isFinished = true;
          }
        }
      );
  },
});

export const {
  startBingo,
  resetBingo,
  setConditions,
  setCurrentMatch,
  recordGuess,
  finishGame,
  setIsFinished,
} = bingoSlice.actions;

export default bingoSlice.reducer;