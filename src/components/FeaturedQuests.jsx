import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function FeaturedQuests() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state
  // Store XP info per quest id as object { questId: { quest_id, points, project_points } }
  const [questXpMap, setQuestXpMap] = useState({});
  let scrollTimeout = null;

  // Fetch project details for quests
  const fetchProjectDetails = async (questsData) => {
    try {
      const questsWithProjects = await Promise.all(
        questsData.map(async (quest) => {
          const res = await fetch(`https://glaria-api.onrender.com/projects/${quest.project_id}`);
          if (!res.ok) throw new Error("Failed to fetch project");
          const project = await res.json();
          return { ...quest, project };
        })
      );
      setQuests(questsWithProjects);

      // After setting quests, fetch XP for each quest
      fetchXpForQuests(questsWithProjects);
    } catch (err) {
      console.error("Error fetching project details:", err);
      setQuests(questsData); // fallback without projects
    } finally {
      setLoading(false);
    }
  };

  // Fetch XP for each quest and parse project_points from JSON string
  const fetchXpForQuests = async (questsWithProjects) => {
    try {
      const xpEntries = await Promise.all(
        questsWithProjects.map(async (quest) => {
          try {
            const res = await fetch(`https://glaria-api.onrender.com/api/quests/xp-by-quest/${quest.id}`);
            if (!res.ok) throw new Error("Failed to fetch XP");
            const xpText = await res.text(); // API returns a JSON string, e.g. '{"quest_id":2,"points":200,"project_points":300}'
            let xpObj;
            try {
              xpObj = JSON.parse(xpText);
            } catch {
              xpObj = null;
            }
            // Return project_points if available, else points, else 0
            const xpValue = xpObj?.project_points ?? xpObj?.points ?? "0";
            return [quest.id, xpValue];
          } catch (err) {
            console.error(`Failed to fetch XP for quest ${quest.id}`, err);
            return [quest.id, "0"]; // default XP 0 on error
          }
        })
      );
      const xpMap = Object.fromEntries(xpEntries);
      setQuestXpMap(xpMap);
    } catch (err) {
      console.error("Failed to fetch XP for quests:", err);
    }
  };

  // Fetch 6 random quests from API on mount
  useEffect(() => {
    const fetchRandomQuests = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://glaria-api.onrender.com/api/quests/quests/random");
        if (!res.ok) throw new Error("Failed to fetch quests");
        const data = await res.json();
        const firstSix = data.slice(0, 6);
        await fetchProjectDetails(firstSix);
      } catch (err) {
        console.error("Error loading quests:", err);
        setLoading(false);
      }
    };

    fetchRandomQuests();
  }, []);

  // Detect mobile screen width
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Debounced scroll handler to snap to closest card on mobile
  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const cardWidth = container.firstChild.offsetWidth + 16; // gap approx

      const scrollLeft = container.scrollLeft;
      const snapIndex = Math.round(scrollLeft / cardWidth);

      container.scrollTo({
        left: snapIndex * cardWidth,
        behavior: "smooth",
      });
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Show skeleton loader if loading or quests are empty
  if (loading || quests.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-10 py-6 sm:py-10 rounded-3xl border border-white/40 shadow-lg featured-quests-glass bg-white/30 backdrop-blur-md">
        <h2 className="text-lg font-semibold mb-6">FEATURED QUESTS</h2>
        <div className={isMobile ? "grid grid-flow-col auto-cols-[65vw] gap-4 overflow-x-auto scroll-smooth" : "grid grid-cols-2 md:grid-cols-3 gap-4"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-gray-300 animate-pulse border border-gray-400 shadow-inner p-4 sm:p-6"
              style={{ minWidth: isMobile ? "65vw" : "auto" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 sm:py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg featured-quests-glass">
      <h2 className="text-lg font-semibold mb-6">FEATURED QUESTS</h2>

      {isMobile ? (
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="featured-quests-grid"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "65vw",
            gap: "1rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollPaddingLeft: "1rem",
            scrollPaddingRight: "1rem",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => navigate(`/quests/${quest.id}`)}
              className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-4 sm:p-6 flex flex-col justify-between cursor-pointer"
              style={{
                scrollSnapAlign: "center",
                maxWidth: "100%",
                minWidth: "65vw",
              }}
            >
              <p className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
                {quest.title || quest.description}
              </p>
              <p className="text-sm text-gray-700 mt-1 mb-4">{quest.description}</p>

              {quest.project && (
                <div className="flex justify-between items-end mt-auto">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${quest.project_id}`);
                    }}
                  >
                    <img
                      src={quest.project.image_url || "/default-project.png"}
                      alt={quest.project.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {quest.project.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow text-gray-900">
                    +{questXpMap[quest.id] || "0"} XP
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 featured-quests-grid">
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => navigate(`/quests/${quest.id}`)}
              className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-4 sm:p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
            >
              <p className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
                {quest.title || quest.description}
              </p>

              {quest.project && (
                <div className="flex justify-between items-end mt-auto">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${quest.project_id}`);
                    }}
                  >
                    <img
                      src={quest.project.image_url || "/default-project.png"}
                      alt={quest.project.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {quest.project.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow text-gray-900">
                    +{questXpMap[quest.id] || "0"} XP
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .featured-quests-glass {
            padding-left: 2rem;
            padding-right: 2rem;
            margin-left: -2rem;
            margin-right: -2rem;
            border-radius: 2rem;
          }
        }
      `}</style>
    </div>
  );
}