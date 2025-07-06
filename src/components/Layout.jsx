import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import GlariaLogo from "../assets/GlariaLogoName3.png";
import SignupModal from "../components/SignupModal";

export default function Layout({ children }) {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [twitterUser, setTwitterUser] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Load token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) setIsAuthenticated(true);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Handle Twitter OAuth callback in URL
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
    setProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[url('/bg-texture.jpg')] bg-cover bg-fixed bg-center bg-[#c2dafc]">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10 flex flex-col items-center gap-12 text-black">
        {/* Navbar */}
        <header className="w-full flex justify-between items-center px-6 py-4 bg-white/30 backdrop-blur-lg rounded-3xl border border-white/40 shadow-md">
          {/* Left: Logo and GLARIA text side by side */}
          <div
            className="flex items-center cursor-pointer space-x-3"
            onClick={() => navigate("/")}
          >
            <img src={GlariaLogo} alt="Logo" className="w-14 h-14 sm:w-16 sm:h-16" />
            <span className="text-xl sm:text-2xl font-bold select-none">GLARIA</span>
          </div>

          {/* Right: Links and profile/login */}
          <div className="flex items-center space-x-6">
            {/* Quests and Projects links */}
            <nav className="flex space-x-6 text-gray-800 font-medium text-base md:text-lg lg:text-xl">
              <Link
                to="/quests"
                className="hover:no-underline hover:text-gray-900 px-3 py-2 md:px-4 md:py-3"
              >
                Quests
              </Link>
              <Link
                to="/projects"
                className="hover:no-underline hover:text-gray-900 px-3 py-2 md:px-4 md:py-3"
              >
                Projects
              </Link>
            </nav>

            {/* Profile photo / Login */}
            <div className="relative" ref={profileMenuRef}>
              {isAuthenticated ? (
                <>
                  <img
                    src={twitterUser?.profile_image_url || "/default-profile.png"}
                    alt="Profile"
                    className="rounded-full cursor-pointer w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    title="Account menu"
                  />
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-semibold"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowLoginOptions(true)}
                  className="py-2 px-5 bg-white/50 backdrop-blur-md rounded-full border border-white/30 hover:scale-105 transition text-gray-800 font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full">{children || <Outlet />}</main>

        {/* Signup Modal */}
        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onSubmit={handleSignupSubmit}
            twitterId={twitterUser?.id}
            twitterUsername={twitterUser?.username}
          />
        )}
      </div>

      {/* Login Options Modal */}
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