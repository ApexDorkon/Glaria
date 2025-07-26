import React, { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({ onClose, onConnected }) {
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectAndSign = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const nonceRes = await fetch(`https://glaria-api.onrender.com/api/auth/nonce?address=${address}`);
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      const message = `Sign this nonce to authenticate: ${nonce}`;
      const signature = await signer.signMessage(message);

      const loginRes = await fetch("https://glaria-api.onrender.com/api/auth/wallet-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      if (!loginRes.ok) {
        const errData = await loginRes.json();
        throw new Error(errData.detail || "Login failed");
      }

      const loginData = await loginRes.json();
      onConnected({ address, signature });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm px-4">
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 w-full max-w-md text-center text-black">
        <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>

        {error && (
          <p className="text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={connectAndSign}
          disabled={connecting}
          className={`w-full py-3 rounded-full transition font-semibold text-white ${
            connecting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {connecting ? "Connecting..." : "🦊 Connect MetaMask"}
        </button>

        <button
  onClick={onClose}
  className="mt-4 px-4 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 hover:text-black transition"
>
  Cancel
</button>
      </div>
    </div>
  );
}