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
    <div className="max-w-md mx-auto mt-20 bg-white/10 backdrop-blur-xl p-6 rounded-3xl text-white border border-white/30 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Sign up to Glaria</h2>

      <label className="block text-sm mb-1">Set up your Username</label>
      <input
        className="w-full mb-4 p-2 rounded bg-white/20 text-white"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Glaria username"
      />

      <label className="block text-sm mb-1">Verify email (optional)</label>
      <input
        className="w-full mb-6 p-2 rounded bg-white/20 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <button
        className="w-full py-2 bg-white text-black rounded-full font-semibold"
        onClick={handleCreate}
      >
        Sign Up
      </button>
    </div>
  );
}
