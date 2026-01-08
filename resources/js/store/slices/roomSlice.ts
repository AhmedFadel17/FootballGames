import { RoomStatus } from "@/types/room";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameUser {
    user: User | null,
    isMe: boolean
}
interface RoomState {
    players: GameUser[];
    activePlayers:number,
    totalPlayers: number;
    isActive: RoomStatus;
}


const initialState: RoomState = {
    players: [],
    isActive: RoomStatus.IDLE,
    activePlayers:1,
    totalPlayers: 4
};

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        startRoom: (state, action: PayloadAction<{
            user: User,
            totalPlayers: number
        }>) => {
            const { user, totalPlayers } = action.payload;
            state.isActive = RoomStatus.ACTIVE;
            state.totalPlayers = totalPlayers;
            const meAsGameUser: GameUser = {
                user,
                isMe: true
            };

            state.players = [
                meAsGameUser,
                ...Array(totalPlayers - 1).fill(null)
            ];
        },
        endRoom: (state) => {
            state.players = [];
            state.isActive = RoomStatus.IDLE;
            state.totalPlayers = 4;
            state.activePlayers=1;
        },
        // setPlayers: (state, action: PayloadAction<User[]>) => {
        //     state.players = action.payload;
        // },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addMatcher(
    //             bingoApi.endpoints.createBingoGame.matchFulfilled,
    //             (state, { payload }) => {
    //                 state.bingoGame = payload;
    //                 state.isActive = true;
    //             }
    //         )
    //         .addMatcher(
    //             bingoApi.endpoints.createBingoGame.matchRejected,
    //             (state) => {
    //                 state.bingoGame = null;
    //                 state.isActive = false;
    //             }
    //         );
    // },
});

export const {
    startRoom,
    // setPlayers,
    endRoom
} = roomSlice.actions;

export default roomSlice.reducer;
