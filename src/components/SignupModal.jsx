import { useEffect, useState } from "react";

export default function SignupModal({ onClose, onSubmit, twitterId, twitterUsername }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("MetaMask not found");
    }
  };

const handleSubmit = async () => {
  if (username.length < 4) {
    alert("Username must be at least 4 characters.");
    return;
  }

  const payload = {
    username,
    email: email || "", // ensure string
    twitter_id: twitterId || "", // from URL param
    twitter_username: twitterUsername || "", // from URL param
    wallet_address: "", // leave empty for now
  };

  try {
    const res = await fetch("https://glaria-api.onrender.com/api/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    console.log("Signup result:", result);

    if (res.ok) {
      localStorage.setItem("access_token", result?.access_token || "");
      window.location.href = "/"; // redirect to home
    } else {
      console.error("Signup failed:", result);
      alert("Signup failed. Try again.");
    }
  } catch (err) {
    console.error("Network error:", err);
    alert("Something went wrong.");
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 max-w-md w-full shadow-xl text-white relative">
        <button onClick={onClose} className="absolute top-3 right-5 text-white text-xl">×</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>

        <div className="mb-4">
          <label className="text-sm block mb-1">Your Twitter</label>
          <div className="bg-white/10 p-2 rounded-lg text-white/80">
            @{twitterUsername} ({twitterId})
          </div>
        </div>

        <label className="text-sm mb-1 block">Choose a Username *</label>
        <input
          type="text"
          className="w-full p-2 rounded-lg bg-white/20 mb-4 text-white placeholder-white/70"
          placeholder="e.g. apebuilder"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="text-sm mb-1 block">Email (optional)</label>
        <input
          type="email"
          className="w-full p-2 rounded-lg bg-white/20 mb-4 text-white placeholder-white/70"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="mb-4">
          <label className="text-sm block mb-1">Wallet (optional)</label>
          {walletAddress ? (
            <div className="bg-white/10 p-2 rounded-lg text-white/80 truncate">
              {walletAddress}
            </div>
          ) : (
            <button
              className="w-full py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-full bg-white/90 text-black font-semibold hover:bg-white transition"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
}
