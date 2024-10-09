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

interface AddressEntry {
  id: string;
  address: string;
  selected: boolean;
  amount: number;
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.airdrop);

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

      const addressList = jsonData.slice(1).map((row) => ({
        id: row[0],
        address: row[1],
        selected: true,
        amount: globalAmount,
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
  const handleAmountChange = (index: number, amount: number) => {
    dispatch(setAddressAmount({ index, amount }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
                      handleAmountChange(index, parseFloat(e.target.value))
                    }
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                  />
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
