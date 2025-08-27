import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface TopListSlot {
  pos: number;
  item?: TopListItem;
}
interface TopListGameState {
  game: TopListGame | null;
  slots: TopListSlot[];
  answers: TopListAnswer[];
  isActive: boolean;
  isFinished: boolean;
}

const initialState: TopListGameState = {
  game: null,
  answers: [],
  slots:[],
  isActive: false,
  isFinished: false,
};

const topListGameSlice = createSlice({
  name: "toplist",
  initialState,
  reducers: {
    startTop10: (state, action: PayloadAction<TopListGame>) => {
      state.game = action.payload;
      state.slots = Array.from({ length: action.payload.size }, (_, i) => ({
        pos: i + 1,
      }));
      state.isActive = true;
    },
    resetTop10: (state) => {
      state.game = null;
      state.answers = [];
      state.slots = [];
      state.isActive = false;
      state.isFinished = false;
    },
    setItem: (state,action: PayloadAction<TopListItem>) => {
      console.log("ITEEEEEEEEEEEM",action.payload)
      const slot = state.slots.find((s) => s.pos === action.payload.pos);
      if (slot) {
        slot.item = action.payload;
      }
    },
    submitAnswer: (
      state,
      action: PayloadAction<{ pos: number; answer: TopListAnswer }>
    ) => {
      const slot = state.slots.find((s) => s.pos === action.payload.pos);
      if (slot) {
        slot.answer = action.payload.answer;
        state.answers.push(action.payload.answer);
      }
    },
    
    finishGame: (state) => {
      state.isFinished = true;
    },
  },
});

export const {
  startTop10,
  resetTop10,
  finishGame,
  setItem
} = topListGameSlice.actions;

export default topListGameSlice.reducer;
