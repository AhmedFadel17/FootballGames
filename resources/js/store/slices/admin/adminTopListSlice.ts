import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export type ObjectType = "player" | "team" | "country";

export interface TopListItem {
    id: number;
    name: string;
    img_src: string;
}

interface AdminTopListState {
    title: string;
    maxChances: number;
    objectType: ObjectType | null;
    items: TopListItem[];
    objectUrl: string
}

const initialState: AdminTopListState = {
    title: "",
    objectType: "player",
    objectUrl: "players",
    items: [],
    maxChances: 3,
};

const AdminTopListSlice = createSlice({
    name: "admin-top-list",
    initialState,
    reducers: {
        resetTopList: (state) => {
            state.title = "";
            state.objectType = null;
            state.items = [];
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
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
        addItem: (state, action: PayloadAction<TopListItem>) => {
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
    resetTopList,
    setTitle,
    setObjectType,
    addItem,
    removeItem,
    moveItemUp,
    moveItemDown,
    setMaxChances,
} = AdminTopListSlice.actions;

export default AdminTopListSlice.reducer;
