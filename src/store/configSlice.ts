// store/configSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
  rpcUrl: string;
  privateKey: string;
}

const initialState: ConfigState = {
  rpcUrl: "",
  privateKey: "",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setRpcUrl: (state, action: PayloadAction<string>) => {
      state.rpcUrl = action.payload;
    },
    setPrivateKey: (state, action: PayloadAction<string>) => {
      state.privateKey = action.payload;
    },
  },
});

export const { setRpcUrl, setPrivateKey } = configSlice.actions;
export default configSlice.reducer;
