import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RoomState {
    currentInstance: GameInstance | null;
    onlineUsers: User[];
    isLoading: boolean;
    game: GameConfig | null;
}

const initialState: RoomState = {
    currentInstance: null,
    onlineUsers: [],
    isLoading: false,
    game: null
};

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<{ instance: GameInstance, game: GameConfig }>) => {
            state.currentInstance = action.payload.instance;
            state.game = action.payload.game;
        },
        setOnlineUsers: (state, action: PayloadAction<User[]>) => {
            state.onlineUsers = action.payload;
        },
        userJoined: (state, action: PayloadAction<User>) => {
            if (!state.onlineUsers.find(u => u.id === action.payload.id)) {
                state.onlineUsers.push(action.payload);
            }
        },
        userLeft: (state, action: PayloadAction<number>) => {
            state.onlineUsers = state.onlineUsers.filter(u => u.id !== action.payload);
        },
        startGame: (state, action: PayloadAction<any>) => {
            if (state.currentInstance == null) return
            state.currentInstance.status = 'active';
        },
        resetRoom: () => initialState,
    },
});

export const {
    setRoom,
    setOnlineUsers,
    userJoined,
    userLeft,
    startGame,
    resetRoom
} = roomSlice.actions;

export default roomSlice.reducer;