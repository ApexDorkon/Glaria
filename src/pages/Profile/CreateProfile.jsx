import { useLocation } from "react-router-dom";
import { useState } from "react";

export default function CreateProfile() {
  const location = useLocation();
  const { twitter_id, twitter_username } = location.state || {};

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleCreate = async () => {
    const res = await fetch("https://glaria-api.onrender.com/api/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        twitter_id,
        twitter_username,
        wallet_address: "", // optional
      }),
    });

    if (res.ok) {
      window.location.href = "/profile";
    } else {
      alert("Failed to create profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white/20 rounded-3xl p-8 shadow-lg shadow-white/30 text-black border border-white/30">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sign up to <span className="text-indigo-600">Glaria</span>
      </h2>

      <label className="block text-sm mb-2 font-semibold">Set up your Username</label>
      <input
        className="w-full mb-5 p-3 rounded-xl bg-white/90 text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Glaria username"
      />

      <label className="block text-sm mb-2 font-semibold">Verify email (optional)</label>
      <input
        className="w-full mb-8 p-3 rounded-xl bg-white/90 text-black placeholder-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
      />

      <button
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold transition text-white"
        onClick={handleCreate}
      >
        Sign Up
      </button>
    </div>
  );
}