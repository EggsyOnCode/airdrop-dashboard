// components/DashboardPage.tsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddresses,
  toggleAddressSelection,
  setAddressAmount,
} from "../store/airdropSlice";
import { RootState } from "../store/store";
import { airdropTokens } from "../on_chain/token_airdrop";

interface AddressEntry {
  id: string;
  address: string;
  selected: boolean;
  amount: number;
  txHash: string;
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.airdrop);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const [globalAmount, setGlobalAmount] = useState<number>(0);

  // Handle Excel file upload and parse addresses
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
      });

      const addressList = jsonData
        .slice(1) // Skip the header row
        .filter((row) => row[0] && row[1]) // Filter out empty rows
        .map((row) => ({
          id: row[0],
          address: row[1],
          selected: true,
          amount: globalAmount,
          txHash: "",
        }));

      dispatch(setAddresses(addressList as AddressEntry[]));
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle global amount change
  const handleGlobalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseFloat(e.target.value);
    setGlobalAmount(newAmount);

    const updatedAddresses = addresses.map((address) => ({
      ...address,
      amount: newAmount,
    }));
    dispatch(setAddresses(updatedAddresses));
  };

  // Handle individual amount change
  const handleAmountChange = (
    index: number,
    amount: number,
    txHash: string
  ) => {
    dispatch(setAddressAmount({ index, amount, txHash }));
  };

  // Airdrop All function
  const handleAirdropAll = async () => {
    for (let index = 0; index < addresses.length; index++) {
      const entry = addresses[index];
      if (entry.selected) {
        // Set the loading state for the current index
        setLoadingStates((prev) => ({ ...prev, [index]: true }));

        try {
          const txHash: string = await airdropTokens(
            entry.address,
            entry.amount.toString()
          );

          // Dispatch an action to update the address with the transaction hash
          dispatch(
            setAddressAmount({
              index,
              amount: entry.amount,
              txHash: txHash,
            })
          );
        } catch (error) {
          console.error(`Error during airdrop for ${entry.address}:`, error);
        } finally {
          // Clear the loading state for the current index
          setLoadingStates((prev) => ({ ...prev, [index]: false }));
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 overflow-y-scroll">
      <h1 className="text-6xl font-bold mb-6">Airdrop Dashboard</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white-700">
          Import Addresses (.xlsx):
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer"
          />
        </label>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white-700">
          Set Global Amount for Airdrop:
          <input
            type="number"
            value={globalAmount}
            onChange={handleGlobalAmountChange}
            placeholder="Enter global amount"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
      </div>

      <button
        onClick={handleAirdropAll}
        className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200"
      >
        AIRDROP ALL
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Select
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Identifier
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Address
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                TX Hash
              </th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={entry.selected}
                    onChange={() => dispatch(toggleAddressSelection(index))}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  {entry.id}
                </td>
                <td className="p-4 text-sm font-medium text-gray-900">
                  {entry.address}
                </td>
                <td className="p-4">
                  <input
                    type="number"
                    value={entry.amount}
                    onChange={(e) =>
                      handleAmountChange(index, parseFloat(e.target.value), "")
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </td>
                <td className="p-4">
                  {loadingStates[index] ? (
                    <div className="loader text-amber-500">Loading...</div> // Replace with your loading spinner
                  ) : (
                    <div className="text-purple-950">{entry.txHash || "-"}</div> // Display txHash if available, otherwise show "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
