import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { TopListGameInstance, TopListGuess } from "@/types";
import { topListGameApi } from "../apis/gameList/topListGame.api";

export interface TopListGameState {
  topListGame: TopListGameInstance | null;
  guesses: TopListGuess[];
  wrongAnswers: number;
  isActive: boolean;
  isFinished: boolean;
}

const initialState: TopListGameState = {
  topListGame: null,
  guesses: [],
  wrongAnswers: 0,
  isActive: false,
  isFinished: false,
};

const topListGameSlice = createSlice({
  name: "toplist",
  initialState,
  reducers: {
    startTopListGame: (state, action: PayloadAction<TopListGameInstance>) => {
      state.topListGame = action.payload;
      const initialGuesses = action.payload.guesses ?? [];
      state.guesses = initialGuesses;
      state.wrongAnswers = initialGuesses.filter((g) => !g.is_correct).length;
      state.isActive = true;
      state.isFinished = false;
    },

    setTopListDetails: (state, action: PayloadAction<TopListGameInstance>) => {
      state.topListGame = action.payload;
      const initialGuesses = action.payload.guesses ?? [];
      state.guesses = initialGuesses;
      state.wrongAnswers = initialGuesses.filter((g) => !g.is_correct).length;

      const question = action.payload.question ?? action.payload.masterQuestion;
      const maxAttempts = action.payload.max_attempts ?? 3;
      const totalItems = question?.total_items ?? question?.items?.length ?? 10;
      const correctCount = initialGuesses.filter((g) => g.is_correct).length;

      if (state.wrongAnswers >= maxAttempts || correctCount >= totalItems) {
        state.isFinished = true;
      }
    },

    updateTopListGuess: (state, action: PayloadAction<TopListGuess>) => {
      const guess = action.payload;
      // Prevent duplicate push if already present
      if (!state.guesses.some((g) => g.id === guess.id || (g.object_id === guess.object_id && g.is_correct === guess.is_correct))) {
        state.guesses.push(guess);
      }

      const question = state.topListGame?.question ?? state.topListGame?.masterQuestion;
      const maxAttempts = state.topListGame?.max_attempts ?? 3;
      const totalItems = question?.total_items ?? question?.items?.length ?? 10;

      if (!guess.is_correct) {
        state.wrongAnswers += 1;
        toast.error("Wrong answer!");
        if (state.wrongAnswers >= maxAttempts) {
          state.isFinished = true;
        }
      } else {
        toast.success("Correct answer!");
        const correctCount = state.guesses.filter((g) => g.is_correct).length;
        if (correctCount >= totalItems) {
          state.isFinished = true;
        }
      }
    },

    finishGame: (state) => {
      state.isFinished = true;
    },

    resetTop10: (state) => {
      state.topListGame = null;
      state.guesses = [];
      state.wrongAnswers = 0;
      state.isActive = false;
      state.isFinished = false;
    },
    resetTopListGame: (state) => {
      state.topListGame = null;
      state.guesses = [];
      state.wrongAnswers = 0;
      state.isActive = false;
      state.isFinished = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        topListGameApi.endpoints.createTopListGame.matchFulfilled,
        (state, { payload }) => {
          state.topListGame = payload.data;
          const initialGuesses = payload.data.guesses ?? [];
          state.guesses = initialGuesses;
          state.wrongAnswers = initialGuesses.filter((g) => !g.is_correct).length;
          state.isActive = true;
          state.isFinished = false;
        }
      )
      .addMatcher(
        topListGameApi.endpoints.createTopListGame.matchRejected,
        (state) => {
          state.topListGame = null;
          state.isActive = false;
        }
      );
  },
});

export const {
  startTopListGame,
  setTopListDetails,
  updateTopListGuess,
  finishGame,
  resetTop10,
  resetTopListGame,
} = topListGameSlice.actions;

export default topListGameSlice.reducer;
