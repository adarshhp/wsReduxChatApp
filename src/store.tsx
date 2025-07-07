import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/CounterSlice";
import numberReducer from "./features/Numberslice";
import loginReducer from "./features/LoginSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default is localStorage
import groupReducer from "./features/MyGroupsSlice";
import groupUserSlice from"./features/GroupUserSlice";
// Configure persist for the login state
const persistConfig = {
  key: "root",
  storage, // Use localStorage by default
  //whitelist: ["login"], // things in white list wont get persisted,if not in both list it will get persisted
   blacklist:["login"]//things in black list will get persisted
};

// Wrap the login reducer with persistReducer
const persistedLoginReducer = persistReducer(persistConfig, loginReducer);

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    number: numberReducer,
    login: persistedLoginReducer, // Use the persisted reducer for login state
    mygroup:groupReducer,
    groupusers:groupUserSlice
  },
});

export const persistor = persistStore(store); // Create persistor for Redux Persist

export type RootState = ReturnType<typeof store.getState>; // For typing the state in components
export type AppDispatch = typeof store.dispatch; // For typing the dispatch function in components
