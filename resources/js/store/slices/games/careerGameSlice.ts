import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { careerGameApi } from "@/store/apis";
import { CareerGame, PlayerTeamPeriod } from "@/types";

interface CareerGameState {
  isActive: boolean;
  isFinished: boolean;
  game: CareerGame | null;
  attemptsLeft: number;
}

const initialState: CareerGameState = {
  isActive: false,
  isFinished: false,
  game: null,
  attemptsLeft: 3,
};

const careerSlice = createSlice({
  name: "career",
  initialState,
  reducers: {
    setCareerGame: (state, action: PayloadAction<CareerGame>) => {
      state.game = action.payload;
      state.isActive = true;
      state.attemptsLeft = action.payload.attempts_left ?? 3;
    },
    resetCareerGame: (state) => {
      state.game = null;
      state.isActive = false;
      state.isFinished = false;
      state.attemptsLeft = 3;
    },
    revealNextStep: (state, action: PayloadAction<CareerGame>) => {
      if (state.game) {
        state.game = action.payload;
      }
    },
    updateAttempts: (state, action: PayloadAction<number>) => {
      state.attemptsLeft = action.payload;
    },
    finishCareerGame: (state) => {
      state.isFinished = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Game Creation
      .addMatcher(
        careerGameApi.endpoints.createCareerGame.matchFulfilled,
        (state, { payload }) => {
          state.game = payload.data;
          state.isActive = true;
          state.isFinished = false;
          state.attemptsLeft = payload.data.attempts_left ?? 3;
        }
      )
      .addMatcher(
        careerGameApi.endpoints.createCareerGame.matchRejected,
        (state) => {
          state.game = null;
          state.isActive = false;
        }
      )
      // Handle Step Reveal Sync
      .addMatcher(
        careerGameApi.endpoints.revealNextCareerGameStep.matchFulfilled,
        (state, { payload }) => {
          if (state.game && payload.data) {
            state.game = payload.data;
          }
        }
      )
      // Handle Player Guessing Sync
      .addMatcher(
        careerGameApi.endpoints.guessCareerGameStep.matchFulfilled,
        (state, { payload }) => {
          if (payload.data) {
            state.attemptsLeft = payload.data.attempts_left;
            if (payload.data.correct || payload.data.attempts_left <= 0) {
              state.isFinished = true;
            }
          }
        }
      );
  },
});

export const {
  setCareerGame,
  resetCareerGame,
  revealNextStep,
  updateAttempts,
  finishCareerGame,
} = careerSlice.actions;

export default careerSlice.reducer;