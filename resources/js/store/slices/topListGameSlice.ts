import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
interface TopListSlot {
  pos: number;
  answer?: TopListAnswer;
}
interface TopListGameState {
  id: number | null;
  game: TopListGame | null;
  slots: TopListSlot[];
  answers: TopListAnswer[];
  isActive: boolean;
  isFinished: boolean;
  wrongAnswers: number;
}

const initialState: TopListGameState = {
  id: null,
  game: null,
  answers: [],
  wrongAnswers: 0,
  slots: [],
  isActive: false,
  isFinished: false,
};

const topListGameSlice = createSlice({
  name: "toplist",
  initialState,
  reducers: {
    startTop10: (state, action: PayloadAction<TopListGame>) => {
      state.id = action.payload.game_instance_id ?? null;
      state.game = action.payload;

      const answers = action.payload.answers ?? [];

      state.answers = answers;
      state.wrongAnswers = answers.filter(a => !a.item).length;
      state.slots = Array.from({ length: action.payload.size }, (_, i) => {
        const pos = i + 1;
        const answer = answers.find(a => a.item && a.item.pos === pos) ?? undefined;
        return {
          pos,
          answer,
        };
      });

      state.isActive = true;
    },

    resetTop10: (state) => {
      state.id = null;
      state.game = null;
      state.answers = [];
      state.wrongAnswers = 0;
      state.slots = [];
      state.isActive = false;
      state.isFinished = false;
    },
    submitAnswer: (
      state,
      action: PayloadAction<TopListAnswer>
    ) => {
      if (!action.payload.item) {
        state.wrongAnswers += 1;
        toast.error("Wrong Answer!");
        if (state.wrongAnswers === state.game?.max_chances) {
          state.isFinished = true;
        }
      }
      const slot = state.slots.find((s) => s.pos === action.payload.item?.pos);
      if (slot) {
        slot.answer = action.payload;
        toast.success("Right Answer!");
      }
      state.answers.push(action.payload);
      if (state.answers.filter(a => a.item).length === state.game?.size) {
          state.isFinished = true;
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
  submitAnswer
} = topListGameSlice.actions;

export default topListGameSlice.reducer;
