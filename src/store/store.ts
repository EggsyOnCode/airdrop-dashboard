// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./configSlice";
import airdropReducer from "./airdropSlice";

const store = configureStore({
  reducer: {
    config: configReducer,
    airdrop: airdropReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
