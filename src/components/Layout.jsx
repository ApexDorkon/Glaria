import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GlariaLogo from "../assets/GlariaLogoName3.png";
import SignupModal from "../components/SignupModal";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [twitterUser, setTwitterUser] = useState(null);

  // ✅ Load token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) setIsAuthenticated(true);
  }, []);

  // ✅ Handle Twitter OAuth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && state) {
      window.history.replaceState({}, document.title, window.location.pathname);

      const completeTwitterLogin = async () => {
        try {
          const res = await fetch(`https://glaria-api.onrender.com/auth/twitter/callback?code=${code}&state=${state}`);
          const data = await res.json();

          if (!data || !data.twitter_user || !data.access_token) {
            alert("Twitter login failed.");
            return;
          }

          const { twitter_user, userExists, access_token } = data;

          localStorage.setItem("access_token", access_token);
          setIsAuthenticated(true);
          setTwitterUser(twitter_user);

          setTimeout(() => {
            if (userExists) navigate("/profile");
            else setShowSignupModal(true);
          }, 150);
        } catch (err) {
          console.error("Twitter login error:", err);
          alert("Twitter login failed. Try again.");
        }
      };

      completeTwitterLogin();
    }
  }, [navigate]);

  const handleXLogin = () => {
    window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
  };

  const handleWalletLogin = () => {
    setTwitterUser(null);
    setShowSignupModal(true);
    setShowLoginOptions(false);
  };

  const handleSignupSubmit = async (userData) => {
    try {
      const res = await fetch(`https://glaria-api.onrender.com/api/create-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.access_token) throw new Error("Signup failed");

      localStorage.setItem("access_token", data.access_token);
      setIsAuthenticated(true);
      setShowSignupModal(false);
      navigate("/profile");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
    setTwitterUser(null);
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center gap-12 text-black">
        {/* Navbar */}
        <header className="w-full flex justify-between items-center px-8 py-4 bg-white/30 backdrop-blur-lg rounded-3xl border border-white/40 shadow-md">
          <div className="flex items-center space-x-3">
            <img src={GlariaLogo} alt="Logo" className="w-20 h-20" />
            <span className="text-xl font-bold">GLARIA</span>
          </div>
          <nav className="space-x-8 font-medium text-gray-800">
            <Link to="/">Home</Link>
            <Link to="/quests">Quests</Link>
            <Link to="/projects">Projects</Link>
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-4">
                <Link to="/profile" className="hover:underline">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginOptions(true)}
                className="px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/30 hover:scale-105 transition"
              >
                Login
              </button>
            )}
          </nav>
        </header>

        <main className="w-full">{children || <Outlet />}</main>

        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onSubmit={handleSignupSubmit}
            twitterId={twitterUser?.id}
            twitterUsername={twitterUser?.username}
          />
        )}
      </div>

      {showLoginOptions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl text-center space-y-4 relative">
            <button
              className="absolute top-3 right-4 text-gray-500 text-xl"
              onClick={() => setShowLoginOptions(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold text-gray-800">Login to GLARIA</h3>
            <button
              className="w-full py-2 bg-black text-white rounded-full hover:bg-gray-900 transition"
              onClick={handleXLogin}
            >
              Login using X
            </button>
            <button
              className="w-full py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
              onClick={handleWalletLogin}
            >
              Login using Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}