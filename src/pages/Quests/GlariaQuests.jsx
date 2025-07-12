import { useEffect, useState } from "react";

function GlariaQuests({ updateUserStats }) {
  const [glariaQuests, setGlariaQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [questStates, setQuestStates] = useState({});
  const [cooldowns, setCooldowns] = useState({});

  useEffect(() => {
    const fetchGlariaQuests = async () => {
      setLoading(true);
      setError(false);

      const token = localStorage.getItem("access_token");
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://glaria-api.onrender.com/api/glaria-quests/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 403) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setGlariaQuests(data);

        const initialStates = {};
        data.forEach((quest) => {
          initialStates[quest.id] = quest.completed ? "verified" : "initial";
        });
        setQuestStates(initialStates);
      } catch (err) {
        console.error("Failed to load GLARIA quests:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGlariaQuests();
  }, []);

  const handleButtonClick = async (quest) => {
    const state = questStates[quest.id];

    if (state === "initial") {
      window.open(quest.target_url.trim(), "_blank");
      setQuestStates((prev) => ({ ...prev, [quest.id]: "clicked" }));
      setCooldowns((prev) => ({ ...prev, [quest.id]: 10 }));
    } else if (state === "clicked") {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          alert("You must be logged in to verify quests.");
          return;
        }

        const res = await fetch(
          `https://glaria-api.onrender.com/api/glaria-quests/collect-glaria-xp?quest_id=${quest.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Failed to collect XP:", errorData);
          alert("Failed to verify quest XP. Please try again.");
          return;
        }

        setQuestStates((prev) => ({ ...prev, [quest.id]: "verified" }));
        setCooldowns((prev) => ({ ...prev, [quest.id]: 0 }));

        // Update Profile stats dynamically here
        if (updateUserStats) updateUserStats();
      } catch (err) {
        console.error("Error verifying quest XP:", err);
        alert("An error occurred during verification. Please try again.");
      }
    }
  };

  useEffect(() => {
    const activeCooldowns = Object.entries(cooldowns).filter(([_, cd]) => cd > 0);
    if (activeCooldowns.length === 0) return;

    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const newCooldowns = { ...prev };
        activeCooldowns.forEach(([id, cd]) => {
          if (cd > 0) newCooldowns[id] = cd - 1;
        });
        return newCooldowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldowns]);

  if (loading) {
    return (
      <div className="w-full mb-10">
        <h3 className="text-lg font-semibold mb-4">Main GLARIA Quests</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-2xl bg-white/50 animate-pulse border border-white/40 shadow-lg p-5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || glariaQuests.length === 0) {
    return (
      <div className="w-full mb-10">
        <h3 className="text-lg font-semibold mb-4">Main GLARIA Quests</h3>
        <p className="text-center text-gray-600">No quests available or access denied.</p>
      </div>
    );
  }

  return (
    <div className="w-full mb-10">
      <h3 className="text-lg font-semibold mb-4">Main GLARIA Quests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {glariaQuests.map((quest) => {
          const state = questStates[quest.id] || "initial";
          const cooldown = cooldowns[quest.id] || 0;

          return (
            <div
              key={quest.id}
              className={`
                relative
                bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-transform duration-200
                ${state === "verified" ? "bg-gradient-to-t from-black/80 to-transparent" : ""}
              `}
            >
              {state === "verified" && (
                <div className="absolute top-3 right-3 text-3xl text-yellow-400 drop-shadow-lg select-none">
                  ✓⃝
                </div>
              )}

              <div>
                <h4 className="text-base font-semibold text-gray-900">{quest.title}</h4>
                <p className="text-sm text-gray-700 mt-1 mb-4">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium text-gray-800 bg-white/50 px-2 py-1 rounded-full shadow">
                  +{quest.points} XP
                </span>

                <button
                  disabled={state === "verified" || cooldown > 0}
                  onClick={() => handleButtonClick(quest)}
                  className={`
                    text-xs font-semibold px-4 py-1.5 rounded-full transition
                    ${
                      state === "initial"
                        ? "bg-black text-white hover:opacity-90"
                        : state === "clicked"
                        ? "bg-yellow-400 text-black cursor-pointer"
                        : "bg-gray-500 text-white cursor-default"
                    }
                    ${cooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {state === "initial" && quest.button_type}
                  {state === "clicked" && (cooldown > 0 ? `Wait ${cooldown}s` : "Verify")}
                  {state === "verified" && "claimed"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GlariaQuests;