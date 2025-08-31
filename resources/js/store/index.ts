import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import bingoReducer from "./slices/bingoSlice";
import authReducer from "./slices/authSlice";
import topListGameReducer from "./slices/topListGameSlice";
import adminTopListReducer from "./slices/admin/adminTopListSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { identityApi } from '@/services/identityApi';
import { api } from '@/services/api';
import { combineReducers } from 'redux';
import { rtkQueryErrorLogger } from "@/middleware/rtkQueryErrorLogger";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // persist only the auth slice
};
const rootReducer = combineReducers({
  auth: authReducer,
  bingo: bingoReducer,
  toplist:topListGameReducer,
  adminTopList:adminTopListReducer,
  [api.reducerPath]: api.reducer,
  [identityApi.reducerPath]: identityApi.reducer,

});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(api.middleware)
    .concat(identityApi.middleware)
    .concat(rtkQueryErrorLogger)
});

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
