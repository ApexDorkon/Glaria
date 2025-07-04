import glassMan from "../../assets/glassMan.png";
import React, { useEffect, useState } from "react";
import CreateProfile from "./CreateProfile";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token");

        const res = await fetch("https://glaria-api.onrender.com/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          },
        });

        if (res.status === 404) {
          setNotFound(true);
        } else {
          const data = await res.json();
          console.log("👤 User data:", data);
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Frosted Skeleton Loader
  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col items-center gap-8 animate-pulse">

          <div className="flex flex-col lg:flex-row items-start justify-start gap-12 w-full ml-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow-xl" />
              <div className="h-6 w-40 bg-white/30 rounded-full backdrop-blur-md" />
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-8 w-full lg:w-auto">
              <div className="min-w-[480px] h-40 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 shadow-xl" />
              <div className="min-w-[480px] h-40 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 shadow-xl" />
            </div>
          </div>

          <div className="w-full rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 shadow-xl p-6 flex flex-col items-center gap-4">
            <div className="w-64 h-12 bg-white/30 rounded-full backdrop-blur-sm" />
            <div className="w-48 h-12 bg-white/30 rounded-full backdrop-blur-sm" />
          </div>

          <div className="w-full h-14 rounded-3xl bg-white/20 backdrop-blur-lg border border-white/40 shadow-xl" />
        </div>
      </div>
    );
  }

  if (notFound || !user) return <CreateProfile />;

  // ✅ Your original Profile UI
  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-12 flex flex-col items-center gap-8 text-gray-900">

        <div className="flex flex-col lg:flex-row items-start justify-start gap-12 w-full ml-20">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={glassMan}
              alt="Avatar"
              className="w-48 h-48 rounded-full border-4 border-white shadow-xl"
            />
            <h2 className="text-4xl font-semibold tracking-wide text-left">
              {user.username || user.twitter_username}
            </h2>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-8 w-full lg:w-auto">
            {/* Completed Quests */}
            <div className="min-w-[480px] rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6">
              <p className="text-center font-semibold text-xl">Completed Quests</p>
              <p className="text-center text-4xl font-bold mt-2 mb-4 text-black/90">{user.questsCompleted || 0}</p>
              <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div className="h-3 bg-blue-400/80 rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            {/* GLARIA XP */}
            <div className="min-w-[480px] rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6">
              <p className="text-center font-semibold text-xl">GLARIA XP</p>
              <p className="text-center text-4xl font-bold mt-2 mb-4 text-black/90">{user.xp || 0}</p>
              <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div className="h-3 bg-indigo-400/80 rounded-full" style={{ width: `${user.xp || 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Connect Buttons Container */}
        <div className="w-full rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 shadow-2xl p-6 flex flex-col items-center gap-4">
          {user.twitter_username ? (
            <button
              disabled
              className="flex items-center justify-center gap-2 w-64 px-5 py-3 rounded-full bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] text-white/80 shadow-inner shadow-black/20 backdrop-blur-md border border-white/20 cursor-default"
            >
              <span className="text-lg">✓</span>
              <span className="text-sm font-semibold tracking-wide">
                Connected as <span className="text-white font-bold">@{user.twitter_username}</span>
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
              }}
              className="flex items-center justify-center gap-2 w-64 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 transition text-black font-medium shadow-lg backdrop-blur-md border border-white/40"
            >
              <span className="text-xl">🕊️</span>
              <span className="text-sm font-semibold">Connect X</span>
            </button>
          )}
          <button className="px-6 py-2 w-48 text-sm font-medium rounded-full bg-white/70 hover:bg-white shadow">
            Connect Wallet
          </button>
        </div>

        {/* Generate AI Character */}
        <button className="w-full rounded-3xl bg-white/10 backdrop-blur-lg border border-white/50 py-5 text-lg font-semibold shadow-2xl hover:bg-white/50 transition">
          Generate AI Character
        </button>
      </div>
    </div>
  );
}