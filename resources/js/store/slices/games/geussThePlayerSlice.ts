import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const guessThePlayerConfig: GameConfig = {
  displayName: 'Guess The Player',
  sliceName: 'guess-the-player',
  route: `/games/guess-the-player`,
}
interface GuessThePlayerState {
  game: GuessThePlayerGame | null;
  isActive: boolean;
  isFinished: boolean;
  result: GameResult | null;
}

const initialState: GuessThePlayerState = {
  game: null,
  isActive: false,
  isFinished: false,
  result: null
};

const guessThePlayerSlice = createSlice({
  name: "guess-the-player",
  initialState,
  reducers: {
    setGameDetails: (state, action: PayloadAction<GuessThePlayerGame>) => {
      state.game = action.payload;
    },
    startGame: (state, action: PayloadAction<GuessThePlayerGame>) => {
      state.game = action.payload;
      state.isActive = true;
    },
    solveAssignment: (state, action: PayloadAction<GuessThePlayerGameAssignment>) => {
      if (state.game && state.game.assignments) {
        const index = state.game.assignments.findIndex(
          (a) => a.id === action.payload.id
        );

        if (index !== -1) {
          state.game.assignments[index] = {
            ...state.game.assignments[index],
            ...action.payload,
            is_solved: true,
          };
        }
      }

      const allSolved = state.game?.assignments.every(a => a.is_solved);
      if (allSolved) {
        state.isFinished = true;
      }
    },
    resetGame: (state) => {
      state.game = null;
      state.isActive = false;
      state.isFinished = false;
    },
    finishGame: (state, action: PayloadAction<GameResult>) => {
      state.result = action.payload;
      state.isFinished = true;
    },
  },

});

export const {
  setGameDetails,
  startGame,
  resetGame,
  solveAssignment,
  finishGame
} = guessThePlayerSlice.actions;

export default guessThePlayerSlice.reducer;
