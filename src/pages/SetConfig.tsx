// components/ConfigPage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setRpcUrl, setPrivateKey } from "../store/configSlice";
import { useNavigate } from "react-router-dom";

const ConfigPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rpcUrl, privateKey } = useSelector(
    (state: RootState) => state.config
  );

  const [localRpcUrl, setLocalRpcUrl] = useState(rpcUrl);
  const [localPrivateKey, setLocalPrivateKey] = useState(privateKey);

  const handleRpcUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRpcUrl(e.target.value);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPrivateKey(e.target.value);
  };

  const handleSave = () => {
    dispatch(setRpcUrl(localRpcUrl));
    dispatch(setPrivateKey(localPrivateKey));
    alert("Configuration saved!");
  };

  const handleNav = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col">
      <h1>Airdrop Configuration</h1>
      <div style={{ marginBottom: "20px" }} className="m-10">
        <label className="m-3">
          JSON RPC Provider URL:
          <input
            type="text"
            className="p-3"
            value={localRpcUrl}
            onChange={handleRpcUrlChange}
            placeholder="Enter RPC URL"
          />
        </label>
      </div>
      <div style={{ marginBottom: "20px" }} className="m-10">
        <label className="m-3">
          Funder Wallet Private Key:
          <input
            type="password"
            className="p-3"
            value={localPrivateKey}
            onChange={handlePrivateKeyChange}
            placeholder="Enter Private Key"
          />
        </label>
      </div>
      <button onClick={handleSave}>Save Configuration</button>
      <button className="mt-4" onClick={handleNav}>Navigate to Dashboard</button>
    </div>
  );
};

export default ConfigPage;
