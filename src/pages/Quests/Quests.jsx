import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function QuestsPage() {
  const navigate = useNavigate();
  const [quests, setQuests] = useState([]);
  const [projectsMap, setProjectsMap] = useState({});
  const [filteredCategory, setFilteredCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(["All"]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questRes = await fetch("https://glaria-api.onrender.com/api/quests/");
        const questData = await questRes.json();

        const uniqueProjectIds = [...new Set(questData.map((q) => q.project_id))];
        const projectMap = {};

        await Promise.all(
          uniqueProjectIds.map(async (id) => {
            try {
              const res = await fetch(`https://glaria-api.onrender.com/projects/${id}`);
              const project = await res.json();
              projectMap[id] = project;
            } catch (err) {
              console.error(`Failed to fetch project ${id}`, err);
              projectMap[id] = { name: "Unknown", image_url: "/fallback.png" };
            }
          })
        );

        const mergedQuests = questData.map((q) => ({
          id: q.id,
          category: q.type,
          description: q.title,
          projectId: q.project_id,
          projectName: projectMap[q.project_id]?.name || "Unknown",
          project: projectMap[q.project_id],
          projectLogo: projectMap[q.project_id]?.image_url || "/fallback.png",
          xp: q.points,
          createdAt: q.created_at || new Date().toISOString(),
        }));

        const uniqueCategories = ["All", ...new Set(mergedQuests.map((q) => q.category))];
        const sorted = mergedQuests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setQuests(sorted);
        setCategories(uniqueCategories);
        setProjectsMap(projectMap);
      } catch (err) {
        console.error("Error fetching quests or projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuests =
    filteredCategory === "All"
      ? quests
      : quests.filter((q) => q.category === filteredCategory);

  const loadMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="relative w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">All Quests</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilteredCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow ${
              filteredCategory === cat
                ? "bg-indigo-500 text-white"
                : "bg-white/70 hover:bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl bg-white/50 animate-pulse border border-white/30 shadow-inner p-6"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredQuests.slice(0, visibleCount).map((quest) => (
            <div
              key={quest.id}
              onClick={() => navigate(`/quests/${quest.id}`)}
              className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
            >
              <p className="text-xl font-semibold text-gray-800 leading-snug">
                {quest.description}
              </p>
              <div className="flex justify-between items-end mt-4">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${quest.projectId}`);
                  }}
                  onMouseEnter={(e) => {
                    const { clientX: x, clientY: y } = e;
                    hoverTimeoutRef.current = setTimeout(() => {
                      setHoverPosition({ x, y });
                      setHoveredProject(quest.project);
                    }, 500);
                  }}
                  onMouseLeave={() => {
                    clearTimeout(hoverTimeoutRef.current);
                    setHoveredProject(null);
                  }}
                >
                  <img
                    src={quest.projectLogo}
                    alt={quest.projectName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {quest.projectName}
                  </span>
                </div>
                <div className="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full shadow text-xs font-semibold text-gray-900">
                  +{quest.xp} XP
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && visibleCount < filteredQuests.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-white/70 hover:bg-white text-sm font-semibold rounded-full shadow"
          >
            Load More
          </button>
        </div>
      )}

      {/* Hover Project Popup */}
      {hoveredProject && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 w-80 bg-white/10 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-5 transition-all"
          style={{
            top: hoverPosition.y + 20,
            left: hoverPosition.x + 20,
          }}
        >
          <div className="flex flex-col items-center text-center text-gray-900">
            <img
              src={hoveredProject.image_url || "/fallback.png"}
              alt={hoveredProject.name}
              className="w-16 h-16 rounded-full mb-3 shadow-md"
            />
            <h3 className="text-lg font-semibold">{hoveredProject.name}</h3>
            <p className="text-sm text-gray-800 mt-1 mb-3 line-clamp-3">
              {hoveredProject.description || "No description available"}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {hoveredProject.twitter_url && (
                <a
                  href={hoveredProject.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/30 px-2 py-1 rounded-full shadow border border-white/40 hover:bg-white/50 transition"
                >
                  Twitter
                </a>
              )}
              {hoveredProject.telegram_url && (
                <a
                  href={hoveredProject.telegram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/30 px-2 py-1 rounded-full shadow border border-white/40 hover:bg-white/50 transition"
                >
                  Telegram
                </a>
              )}
              {hoveredProject.discord_url && (
                <a
                  href={hoveredProject.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-white/30 px-2 py-1 rounded-full shadow border border-white/40 hover:bg-white/50 transition"
                >
                  Discord
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}