import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { gridGameApi } from "@/store/apis";
import { GridGame, GridAnswer, GridCondition, GridGameInstance } from "@/types";

interface GridConditionsMap {
  rows: Array<{ name: string; icon?: string; type: string }>;
  columns: Array<{ name: string; icon?: string; type: string }>;
}

interface GridGameState {
  gridGame: GridGameInstance | null;
  conditions: GridConditionsMap | null;
  /** Record keyed by "rowIndex_colIndex" for quick cell lookup */
  answers: Record<string, {
    player?: { id: number; name: string; img_src: string };
    is_correct?: boolean;
    rarity_score?: number;
  }>;
  isActive: boolean;
  isFinished: boolean;
}

const initialState: GridGameState = {
  gridGame: null,
  conditions: null,
  answers: {},
  isActive: false,
  isFinished: false,
};

/**
 * Transform flat conditions array (from API) into grouped rows/columns
 * with human-readable names.
 */
function transformConditions(conditions: GridCondition[]): GridConditionsMap {
  const rows: Array<{ name: string; icon?: string; type: string }> = [];
  const columns: Array<{ name: string; icon?: string; type: string }> = [];

  // Sort by pos to ensure correct ordering
  const sorted = [...conditions].sort((a, b) => a.pos - b.pos);

  for (const cond of sorted) {
    const item = {
      name: (cond.object as any)?.name ?? `Unknown`,
      icon: (cond.object as any)?.img_src ?? (cond.object as any)?.flag_url ?? undefined,
      type: cond.connection_type,
    };

    if (cond.type === "row") {
      rows.push(item);
    } else if (cond.type === "column") {
      columns.push(item);
    }
  }

  return { rows, columns };
}

const gridGameSlice = createSlice({
  name: "gridGame",
  initialState,
  reducers: {
    startGridGame: (state, action: PayloadAction<GridGameInstance>) => {
      state.gridGame = action.payload;
      state.isActive = true;
      state.isFinished = false;
      state.answers = {};

      // If conditions came with the game creation response, transform them
      if (action.payload?.grid_game?.conditions && action.payload.grid_game.conditions.length > 0) {
        state.conditions = transformConditions(action.payload.grid_game.conditions);
      }
    },
    setGridConditions: (state, action: PayloadAction<GridCondition[]>) => {
      state.conditions = transformConditions(action.payload);
    },
    updateGridCellAnswer: (
      state,
      action: PayloadAction<{
        row: number;
        col: number;
        answer: GridAnswer;
      }>
    ) => {
      const { row, col, answer } = action.payload;
      const key = `${row}_${col}`;
      state.answers[key] = {
        player: answer.player
          ? { id: answer.player.id, name: answer.player.name, img_src: answer.player.img_src }
          : undefined,
        is_correct: answer.is_correct,
        rarity_score: answer.rarity_score,
      };
    },
    finishGame: (state) => {
      state.isFinished = true;
    },
    resetGridGame: (state) => {
      state.gridGame = null;
      state.conditions = null;
      state.answers = {};
      state.isActive = false;
      state.isFinished = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        gridGameApi.endpoints.createGridGameInstance.matchFulfilled,
        (state, { payload }) => {
          state.gridGame = payload.data;
          state.isActive = true;
          state.isFinished = false;
          state.answers = {};

          if (payload.data?.grid_game?.conditions && payload.data.grid_game.conditions.length > 0) {
            state.conditions = transformConditions(payload.data.grid_game.conditions);
          }
        }
      )
      .addMatcher(
        gridGameApi.endpoints.createGridGameInstance.matchRejected,
        (state) => {
          state.gridGame = null;
          state.isActive = false;
        }
      );
  },
});

export const {
  startGridGame,
  setGridConditions,
  updateGridCellAnswer,
  finishGame,
  resetGridGame,
} = gridGameSlice.actions;

export default gridGameSlice.reducer;
