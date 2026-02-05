import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface UserExtended extends User {
    isSpeaking?: boolean;
    isMuted?: boolean;
}
interface RoomState {
    currentInstance: GameInstance | null;
    onlineUsers: UserExtended[];
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
            state.onlineUsers = action.payload.map(u => ({ ...u, isSpeaking: false,isMuted:false }));
        },
        userJoined: (state, action: PayloadAction<User>) => {
            if (!state.onlineUsers.find(u => u.id === action.payload.id)) {
                state.onlineUsers.push({ ...action.payload, isSpeaking: false,isMuted:false });
            }
        },
        userLeft: (state, action: PayloadAction<number>) => {
            state.onlineUsers = state.onlineUsers.filter(u => u.id !== action.payload);
        },
        startGame: (state, action: PayloadAction<any>) => {
            if (state.currentInstance == null) return
            state.currentInstance.status = 'active';
        },
        setUserSpeaking: (state, action: PayloadAction<{ userId: number | string, isSpeaking: boolean }>) => {
            const user = state.onlineUsers.find(u => u.id === action.payload.userId);
            if (user) {
                user.isSpeaking = action.payload.isSpeaking;
            }
        },
        setUserMuted: (state, action: PayloadAction<{ userId: number | string, isMuted: boolean }>) => {
            const user = state.onlineUsers.find(u => u.id === action.payload.userId);
            if (user) {
                user.isMuted = action.payload.isMuted;
            }
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
    resetRoom,
    setUserSpeaking,
    setUserMuted
} = roomSlice.actions;

export default roomSlice.reducer;