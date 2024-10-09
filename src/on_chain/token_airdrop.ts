// token_airdrop.ts
import { ethers } from "ethers";
import { RootState } from "../store/store";
import store from "../store/store";

export const airdropTokens = async (recipient: string, amount: string) => {
  // Fetching the sender wallet and JSON RPC URL from the Redux store
  const state: RootState = store.getState();
  const { privateKey, rpcUrl } = state.config;

  if (!privateKey || !rpcUrl) {
    throw new Error(
      "Sender wallet or JSON RPC URL is not set in the configuration."
    );
  }

  try {
    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Create a wallet instance using the sender's private key
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create a transaction object
    const tx = {
      to: recipient, 
      value: ethers.utils.parseEther(amount), 
    };

    // Send the transaction
    const transactionResponse = await wallet.sendTransaction(tx);

    // Wait for the transaction to be confirmed
    const receipt = await transactionResponse.wait();

    console.log("Transaction successful with hash:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Error during the airdrop:", error);
    throw error;
  }
};
