import { useNavigate } from "react-router-dom";
import { useState } from "react";
import xLogo from "../assets/xLogo.svg";
export default function LoginModal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleXLogin = () => {
    window.location.href = "https://glaria-api.onrender.com/auth/twitter/login";
  };

  const handleWalletLogin = () => {
    alert("Wallet login not implemented yet.");
  };

  // New close handler that navigates home
  const handleClose = () => {
    navigate("/");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
        <div
          className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl text-center space-y-4 relative
                     sm:max-w-sm md:max-w-md"
        >
          <button
            className="absolute top-3 right-4 text-gray-500 text-xl"
            onClick={handleClose}
            aria-label="Close"
            title="Close"
          >
            ×
          </button>
          <h3 className="text-xl font-semibold text-gray-800">
  Login to{" "}
  <span className="text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]">
    GLARIA
  </span>
</h3>

<button
  onClick={handleXLogin}
  disabled={loading}
  className="w-full py-2 px-4 rounded-full bg-black text-white flex items-center justify-center space-x-2 backdrop-blur-md border border-white/20 hover:bg-black/90 transition"
>
  <span className="text-sm font-medium tracking-wide">Connect</span>
  <img src={xLogo} alt="X Logo" className="w-5 h-5 invert" />
</button>
          
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div.max-w-md {
            max-width: 280px !important;
          }
        }
      `}</style>
    </>
  );
}