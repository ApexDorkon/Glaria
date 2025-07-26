import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import LoginModal from "../../components/LoginModal"; 
export default function ProjectQuest() {
  const { questId } = useParams();
  const navigate = useNavigate();

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collecting, setCollecting] = useState(false);
  const [collected, setCollected] = useState(false);
  const [collectError, setCollectError] = useState(null);
const [showLoginModal, setShowLoginModal] = useState(false);
  const [xpInfo, setXpInfo] = useState({ points: 0, project_points: 0 });

  // actionStates: for each actionId: { status: "idle" | "inProgress" | "done", timer: number, shake: boolean }
  const [actionStates, setActionStates] = useState({});
  const timers = useRef({});

  useEffect(() => {
    const fetchQuestAndXp = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch quest WITH auth if token, else WITHOUT auth
        const questRes = await fetch(
          `https://glaria-api.onrender.com/api/quests/${questId}`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined
        );

        if (!questRes.ok) {
          // Try to read error body for more info
          let errMsg = `Failed to fetch quest: ${questRes.statusText}`;
          try {
            const errData = await questRes.json();
            if (errData.detail) errMsg += ` - ${JSON.stringify(errData.detail)}`;
          } catch {}
          throw new Error(errMsg);
        }
        const data = await questRes.json();

        // Fetch project info for the quest
        const projectRes = await fetch(`https://glaria-api.onrender.com/projects/${data.project_id}`);
        if (!projectRes.ok) throw new Error("Failed to fetch project info");
        const projectData = await projectRes.json();

        setQuest({ ...data, project: projectData });

        // Initialize action states
        const initialStates = {};
        (data.actions || []).forEach(a => {
          initialStates[a.id] = { status: "idle", timer: 0, shake: false };
        });
        setActionStates(initialStates);

        // Set collected only if authenticated and quest is completed
        setCollected(token && data.completed === true);
        setCollectError(null);

        // Fetch XP info (no auth needed)
        const xpRes = await fetch(`https://glaria-api.onrender.com/api/quests/xp-by-quest/${questId}`);
        if (xpRes.ok) {
          const xpData = await xpRes.json();
          setXpInfo({
            points: xpData.points || 0,
            project_points: xpData.project_points || 0,
          });
        } else {
          setXpInfo({ points: 0, project_points: 0 });
        }
      } catch (err) {
        setError(err.message || "Failed to load quest");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestAndXp();

    // Clear timers on unmount
    return () => {
      Object.values(timers.current).forEach(clearInterval);
    };
  }, [questId]);

  // Handle action button click (start timer)
  const handleActionClick = (actionId, url) => {
  if (!localStorage.getItem("access_token")) {
    setShowLoginModal(true);
    return;
  }
  const currentState = actionStates[actionId];
  if (currentState.status === "idle") {
    const countdown = 10;
    setActionStates(prev => ({
      ...prev,
      [actionId]: { status: "inProgress", timer: countdown, shake: false },
    }));

    timers.current[actionId] = setInterval(() => {
      setActionStates(prev => {
        const newTimer = prev[actionId].timer - 1;
        if (newTimer <= 0) {
          clearInterval(timers.current[actionId]);
          return { ...prev, [actionId]: { ...prev[actionId], timer: 0 } };
        }
        return { ...prev, [actionId]: { ...prev[actionId], timer: newTimer } };
      });
    }, 1000);

    // Fix here: make sure URL is absolute
    let fullUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = "https://" + url;
    }

    window.open(fullUrl, "_blank");
  }
};

  // Handle reload button click
  const handleReloadClick = (actionId, e) => {
    e.stopPropagation();
    const currentState = actionStates[actionId];
    if (currentState.status === "idle") {
      // Trigger shake animation for 1s
      setActionStates(prev => ({
        ...prev,
        [actionId]: { ...prev[actionId], shake: true }
      }));
      setTimeout(() => {
        setActionStates(prev => ({
          ...prev,
          [actionId]: { ...prev[actionId], shake: false }
        }));
      }, 1000);
    } else if (currentState.status === "inProgress" && currentState.timer === 0) {
      clearInterval(timers.current[actionId]);
      setActionStates(prev => ({
        ...prev,
        [actionId]: { status: "done", timer: 0, shake: false }
      }));
    }
  };

  const allActionsDone = quest && quest.actions
    ? quest.actions.every(a => actionStates[a.id]?.status === "done")
    : false;

  // Handle XP collection
  const handleCollectXp = async () => {
    if (!allActionsDone || collecting || collected) return;
    if (!localStorage.getItem("access_token")) {
    setShowLoginModal(true);
    return;
  }
    setCollecting(true);
    setCollectError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`https://glaria-api.onrender.com/api/quests/collect-xp?quest_id=${questId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail?.[0]?.msg || "Failed to collect XP");
      }
      await res.text();

      setCollected(true);
    } catch (err) {
      setCollectError(err.message);
    } finally {
      setCollecting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-12 flex flex-col gap-10 px-4 animate-pulse">
        {/* Optional loading skeleton */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto mt-12 p-4 text-red-600 font-semibold">
        Error: {error}
      </div>
    );
  }

  if (!quest) return null;

  return (
    <>
      <style>{`
        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          color: black;
          border: none;
          padding: 0.5rem 1rem 0.5rem 1.5rem;
          border-radius: 9999px;
          box-shadow: 0 3px 6px rgba(0,0,0,0.12);
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease;
          width: 100%;
          position: relative;
          overflow: visible;
        }
        .action-button.done {
          background: linear-gradient(90deg, #22c55e, #16a34a);
          color: white;
          cursor: default;
          box-shadow: 0 4px 6px rgba(22, 163, 74, 0.4);
          font-weight: 600;
          letter-spacing: 0.03em;
          user-select: none;
          border: none;
        }
        .action-button.done .action-text {
          color: white !important;
        }
        .action-button.inProgress {
          background-color: #374151;
          color: white;
          cursor: default;
        }
        .action-button:disabled {
          cursor: not-allowed;
          background-color: #cbd5e1;
          color: #94a3b8;
        }
        .action-text {
          flex-grow: 1;
          text-align: center;
          user-select: none;
        }
        .timer {
          position: absolute;
          right: 56px;
          top: 50%;
          transform: translateY(-50%);
          background: #e2e8f0;
          color: #334155;
          font-family: monospace;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0 6px;
          border-radius: 9999px;
          user-select: none;
          pointer-events: none;
          z-index: 5;
        }
        .reload-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background-color: transparent;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
          z-index: 10;
        }
        .reload-button:hover {
          background-color: #e0e7ff;
        }
        .reload-icon {
          width: 20px;
          height: 20px;
          stroke: #374151;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.3s ease;
          user-select: none;
        }
        .reload-button:hover .reload-icon {
          stroke: #1e40af;
        }
        .reload-button-done .reload-icon {
          stroke: white !important;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        .collect-button {
          background-color: #6366f1;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease;
          margin-top: 1rem;
          width: 100%;
        }
        .collect-button:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }
        .collect-button:hover:not(:disabled) {
          background-color: #4f46e5;
        }
        .collect-message {
          margin-top: 0.5rem;
          color: #16a34a;
          font-weight: 600;
        }
        .collect-error {
          margin-top: 0.5rem;
          color: #dc2626;
          font-weight: 600;
        }
        .xp-indicators {
          margin-top: 12px;
          display: flex;
          gap: 12px;
        }
        .xp-pill {
          flex: 1;
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          background: rgba(255 255 255 / 0.25);
          backdrop-filter: blur(8px);
          color: #1f2937;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
          user-select: none;
        }
        .xp-pill .label {
          margin-right: 8px;
          opacity: 0.75;
        }
        .xp-pill .value {
          font-weight: 700;
          color: #4f46e5;
        }
      `}</style>
<div className="max-w-5xl mx-auto mt-12 flex flex-col gap-10 px-4">
  <button
    onClick={() => navigate(-1)}
    className="self-start px-5 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow text-sm font-medium text-gray-800 hover:bg-white/50 transition"
  >
    ← Back to Quests
  </button>

  <div className="flex gap-10 items-start flex-col md:flex-row">
    <div className="flex-1 bg-white/30 backdrop-blur-lg p-8 rounded-3xl border border-white/40 shadow-md">
      <h2 className="text-3xl font-bold mb-4">{quest.title}</h2>
      <p className="text-lg leading-relaxed text-black/80">{quest.description}</p>

      {/* XP Indicators */}
      <div className="xp-indicators">
        <div className="xp-pill">
          <span className="label">Glaria XP:</span>
          <span className="value">{xpInfo.points}</span>
        </div>
        <div className="xp-pill">
          <span className="label">{quest?.project?.name || "Project"} XP:</span>
          <span className="value">{xpInfo.project_points}</span>
        </div>
      </div>
    </div>

    <div
      className="w-full md:w-[320px] relative rounded-3xl border border-white/40 shadow-md bg-white/30 backdrop-blur-lg p-6 flex flex-col gap-6"
      style={{ pointerEvents: collected ? "none" : "auto" }}
    >
      {/* Black gradient overlay on top */}
      {collected && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-56 rounded-t-3xl pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0))",
              zIndex: 10,
            }}
          />
          <div
            className="absolute top-4 right-4 text-6xl text-yellow-400 drop-shadow-lg select-none z-20"
            aria-label="Claimed"
            title="Quest Claimed"
          >
            ✓⃝
          </div>
        </>
      )}

      {quest.actions.map((action) => {
        const state = actionStates[action.id] || { status: "idle", timer: 0, shake: false };
        const isInProgress = state.status === "inProgress" && state.timer > 0;
        const isDone = state.status === "done";

        return (
          <div key={action.id} style={{ position: "relative", width: "100%" }}>
            <button
              onClick={() => !isInProgress && !isDone && handleActionClick(action.id, action.target_url)}
              disabled={isInProgress || isDone || collected}
              className={`action-button ${isDone ? "done" : isInProgress ? "inProgress" : ""} ${state.shake ? "shake" : ""}`}
            >
              <span className="action-text">{action.button_type}</span>
              {isInProgress && <span className="timer">{state.timer}s</span>}

              <button
                className={`reload-button ${isDone ? "reload-button-done" : ""}`}
                title="Reload"
                onClick={(e) => handleReloadClick(action.id, e)}
                disabled={isDone || isInProgress || collected}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="reload-icon"
                  style={{ stroke: isDone ? "white" : undefined }}
                >
                  <path d="M4 4v5h.582M20 20v-5h-.581M4.93 19.07a9 9 0 1 0 0-14.14" />
                </svg>
              </button>
            </button>
          </div>
        );
      })}

      <button
        disabled={!allActionsDone || collecting || collected}
        onClick={handleCollectXp}
        className="collect-button"
        title={
          !allActionsDone
            ? "Complete all actions first"
            : collecting
            ? "Collecting XP..."
            : collected
            ? "XP Collected"
            : "Claim"
        }
      >
         {collected ? "Claimed" : allActionsDone ? "Claim" : `Collect ${xpInfo.points} XP`}
      </button>

      {collectError && <p className="collect-error">{collectError}</p>}
    </div>
  </div>

  <div
    onClick={() => navigate(`/projects/${quest.project_id}`)}
    className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md flex items-center gap-6 cursor-pointer hover:bg-white/40 transition"
  >
    <img
      src={quest.project.image_url || quest.project.logo || "/fallback.png"}
      alt={quest.project.name}
      className="w-16 h-16 rounded-full object-cover"
    />
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{quest.project.name}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{quest.project.description}</p>
    </div>
  </div>
  {showLoginModal && (
    <LoginModal onClose={() => setShowLoginModal(false)} />
  )}
</div>
      {showLoginModal && (
  <LoginModal onClose={() => setShowLoginModal(false)} />
)}
    </>
  );
}