import { useState } from "react";
import { createPortal } from "react-dom";

export default function CreateProjectModal({ onClose }) {
  // Step management: 1 or 2
  const [step, setStep] = useState(1);

  // X user data from connect
  const [xUser, setXUser] = useState(null);

  // Form data for step 2
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discord_url: "",
    telegram_url: "",
    twitter_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate Connect X flow:
  // In real, you'd redirect or open a popup, here we mock success
  const handleConnectX = async () => {
    // This should trigger your real OAuth flow, here is a mock:
    try {
      // Example: After OAuth, fetch user info from your backend or directly from X API
      // Mock data:
      const fetchedUser = {
        name: "Alen James",
        profile_image_url: "https://pbs.twimg.com/profile_images/1234567890/alens_avatar.jpg",
        twitter_username: "alenjamesNFT",
      };
      setXUser(fetchedUser);
      setStep(2);
    } catch {
      alert("Failed to connect X account.");
    }
  };

  // Step 2: form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit project creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      // Compose payload
      const payload = {
        name: formData.name,
        twitter_username: xUser.twitter_username,
        description: formData.description,
        discord_url: formData.discord_url || null,
        telegram_url: formData.telegram_url || null,
        twitter_url: formData.twitter_url || null,
      };

      const res = await fetch("https://glaria-api.onrender.com/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.detail?.[0]?.msg || "Failed to create project");
        setLoading(false);
        return;
      }

      onClose();
      alert("Project created successfully!");
    } catch {
      setError("Error submitting the form");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <>
      {/* Fullscreen Black Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[9999]"
      />

      {/* Modal */}
      <div
        className="fixed z-[10000] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl
          shadow-2xl p-10 max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Step 1 */}
        {step === 1 && (
          <div className="text-center">
            <p className="mb-6 text-gray-900 font-semibold text-lg">
              Let's connect your project's X account
            </p>
            <button
              onClick={handleConnectX}
              className="inline-block w-full max-w-xs mx-auto py-3 rounded-full bg-black text-white font-semibold hover:opacity-90 transition"
            >
              Connect X
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && xUser && (
          <>
            <div className="flex flex-col items-center gap-4 mb-8">
              <img
                src={xUser.profile_image_url}
                alt={xUser.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <p className="text-xl font-semibold text-gray-900">
                @{xUser.twitter_username}
              </p>
              <p className="text-gray-700">{xUser.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-gray-900">
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Project Name"
                className="w-full px-4 py-3 rounded-2xl bg-white/30 border border-white/50
                  backdrop-blur-md text-gray-900 placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/30 border border-white/50
                  backdrop-blur-md text-gray-900 placeholder-gray-600 resize-none
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <input
                name="discord_url"
                value={formData.discord_url}
                onChange={handleChange}
                placeholder="Discord URL"
                className="w-full px-4 py-3 rounded-2xl bg-white/30 border border-white/50
                  backdrop-blur-md text-gray-900 placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <input
                name="telegram_url"
                value={formData.telegram_url}
                onChange={handleChange}
                placeholder="Telegram URL"
                className="w-full px-4 py-3 rounded-2xl bg-white/30 border border-white/50
                  backdrop-blur-md text-gray-900 placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <input
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                placeholder="Twitter URL"
                className="w-full px-4 py-3 rounded-2xl bg-white/30 border border-white/50
                  backdrop-blur-md text-gray-900 placeholder-gray-600
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

              {error && (
                <p className="text-red-600 text-sm font-semibold mt-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Create Project"}
              </button>
            </form>
          </>
        )}
      </div>
    </>,
    document.body
  );
}