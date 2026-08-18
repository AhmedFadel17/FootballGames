import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import bingoReducer from "./slices/bingoSlice";
import topListGameReducer from "./slices/topListGameSlice";
import adminTopListReducer from "./slices/admin/adminTopListSlice";
import guessThePlayerReducer from "./slices/games/geussThePlayerSlice";
import roomReducer from "./slices/roomSlice";
import { api } from "@/services/api";
import { combineReducers } from "redux";
import { rtkQueryErrorLogger } from "@/middleware/rtkQueryErrorLogger";
import { mainApi } from "./apis";
import authReducer from "./slices/authSlice";

/**
 * Redux store.
 *
 * Auth state is no longer stored here — it is managed entirely by
 * react-oidc-context (oidc-client-ts) in localStorage.
 *
 * redux-persist is kept only if other slices need it in the future;
 * the auth whitelist has been removed.
 */
const rootReducer = combineReducers({
    auth: authReducer,
    // room: roomReducer,
    // bingo: bingoReducer,
    // guessThePlayer: guessThePlayerReducer,
    // toplist: topListGameReducer,
    // adminTopList: adminTopListReducer,
    // [api.reducerPath]: api.reducer,
    [mainApi.reducerPath]: mainApi.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setUser'],
                ignoredPaths: ['auth.user'],
            },
        })
            .concat(mainApi.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
