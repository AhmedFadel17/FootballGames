import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export type ObjectType = "player" | "team" | "country";

export interface Top10Item {
    id: number;
    name: string;
    img_src: string;
}

interface AdminTop10State {
    title: string;
    gameId: number | null;
    size: number;
    maxChances: number;
    objectType: ObjectType | null;
    items: Top10Item[];
    objectUrl: string
}

const initialState: AdminTop10State = {
    title: "",
    gameId: null,
    objectType: "player",
    objectUrl: "players",
    items: [],
    size: 3,
    maxChances: 3,
};

const AdminTop10Slice = createSlice({
    name: "admin-top10",
    initialState,
    reducers: {
        resetTop10: (state) => {
            state.title = "";
            state.objectType = null;
            state.items = [];
        },
        setGameId: (state, action: PayloadAction<number>) => {
            state.gameId = action.payload;
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setSize: (state, action: PayloadAction<number>) => {
            state.size = action.payload;
        },
        setMaxChances: (state, action: PayloadAction<number>) => {
            state.maxChances = action.payload;
        },
        setObjectType: (state, action: PayloadAction<ObjectType>) => {
            state.objectType = action.payload;
            switch (action.payload) {
                case "country":
                    state.objectUrl = "countries";
                    break;
                case "player":
                case "team":
                    state.objectUrl = action.payload + "s";
                    break;
            }
            state.items = [];
        },
        addItem: (state, action: PayloadAction<Top10Item>) => {
            const exists = state.items.find((i) => i.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                toast.success("added!")

            } else {
                toast.error("already exist!")
            }
        },
        removeItem: (state, action: PayloadAction<string | number>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        moveItemUp: (state, action: PayloadAction<string | number>) => {
            const index = state.items.findIndex((i) => i.id === action.payload);
            if (index > 0) {
                const temp = state.items[index];
                state.items[index] = state.items[index - 1];
                state.items[index - 1] = temp;
                toast.success("moved up!")
            }
        },
        moveItemDown: (state, action: PayloadAction<string | number>) => {
            const index = state.items.findIndex((i) => i.id === action.payload);
            if (index >= 0 && index < state.items.length - 1) {
                const temp = state.items[index];
                state.items[index] = state.items[index + 1];
                state.items[index + 1] = temp;
                toast.success("moved down!")
            }
        },
    },
});

export const {
    resetTop10,
    setTitle,
    setObjectType,
    addItem,
    removeItem,
    moveItemUp,
    moveItemDown,
    setMaxChances,
    setSize,
    setGameId
} = AdminTop10Slice.actions;

export default AdminTop10Slice.reducer;
