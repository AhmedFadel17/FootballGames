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
}

const initialState: GuessThePlayerState = {
  game: null,
  isActive: false,
  isFinished: false,
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
    resetGame: (state) => {
      state.game = null;
      state.isActive = false;
      state.isFinished = false;
    },
    finishGame: (state) => {
      state.isFinished = true;
    },
  },

});

export const {
  setGameDetails,
  startGame,
  resetGame,
  finishGame
} = guessThePlayerSlice.actions;

export default guessThePlayerSlice.reducer;
