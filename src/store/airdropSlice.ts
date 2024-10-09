import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddressEntry {
  id: string;
  address: string;
  selected: boolean;
  amount: number;
  txHash: string | undefined;
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
    setAddressAmount(
      state,
      action: PayloadAction<{
        index: number;
        amount: number;
        txHash?: string; // Optional, for updating transaction hash
      }>
    ) {
      const { index, amount, txHash } = action.payload;
      state.addresses[index].amount = amount;
      if (txHash) {
        state.addresses[index].txHash = txHash; // Update txHash if provided
      }
    },
  },
});

export const { setAddresses, toggleAddressSelection, setAddressAmount } =
  airdropSlice.actions;
export default airdropSlice.reducer;
