import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressEntry {
  id: string;
  address: string;
  selected: boolean;
  amount: number;
}

interface AirdropState {
  addresses: AddressEntry[];
}

const initialState: AirdropState = {
  addresses: [],
};

const airdropSlice = createSlice({
  name: "airdrop",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<AddressEntry[]>) => {
      state.addresses = action.payload;
    },
    toggleAddressSelection: (state, action: PayloadAction<number>) => {
      const address = state.addresses[action.payload];
      address.selected = !address.selected;
    },
    setAddressAmount: (
      state,
      action: PayloadAction<{ index: number; amount: number }>
    ) => {
      state.addresses[action.payload.index].amount = action.payload.amount;
    },
  },
});

export const { setAddresses, toggleAddressSelection, setAddressAmount } =
  airdropSlice.actions;
export default airdropSlice.reducer;
