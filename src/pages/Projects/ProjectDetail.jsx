import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Leaderboard from "../../components/Leaderboard";
export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [xpData, setXpData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    const fetchProjectAndQuests = async () => {
      try {
        const token = localStorage.getItem("access_token");
        setIsAuthenticated(!!token);

        // Fetch project details (no auth needed)
        const projectRes = await fetch(`https://glaria-api.onrender.com/projects/${projectId}`);
        if (!projectRes.ok) {
          setProject(null);
          setLoading(false);
          return;
        }
        const projectData = await projectRes.json();

        setProject({
          ...projectData,
          logo: projectData.image_url || "/fallback.png",
        });
if (token) {
        const leaderboardRes = await fetch(`https://glaria-api.onrender.com/projects/${projectId}/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (leaderboardRes.ok) {
          const leaderboardJson = await leaderboardRes.json();
          setLeaderboardData(leaderboardJson);
        } else {
          setLeaderboardData([]);
        }
      }
        // Fetch quests by project id (no auth needed)
        const questsRes = await fetch(`https://glaria-api.onrender.com/api/quests/by-project/${projectId}`);
        if (!questsRes.ok) throw new Error("Failed to fetch quests");
        const questsData = await questsRes.json();

        // Map quests for display
        const mappedQuests = questsData.map(q => ({
          id: q.id,
          description: q.title,
          xp: q.points,
          projectName: projectData.name,
          projectLogo: projectData.image_url || "/fallback.png",
        }));

        setQuests(mappedQuests);

        // If authenticated, fetch XP info
        if (token) {
          const xpRes = await fetch(`https://glaria-api.onrender.com/projects/xp-by-project/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (xpRes.ok) {
            const xpInfo = await xpRes.json();
            setXpData(xpInfo);
          } else {
            setXpData(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch project or quests:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndQuests();
  }, [projectId]);

  if (loading) {
    return (
      <div className="w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg max-w-5xl mx-auto mt-12 animate-pulse">
        <div className="h-20 w-20 rounded-full bg-gray-300 mb-6 mx-auto" />
        <div className="h-8 bg-gray-300 rounded mb-4 w-3/5 mx-auto" />
        <div className="h-4 bg-gray-300 rounded mb-2 w-4/5 mx-auto" />
        <div className="h-4 bg-gray-300 rounded mb-6 w-2/3 mx-auto" />
        <div className="h-6 bg-gray-300 rounded mb-2 w-full mx-auto" />
        <div className="h-6 bg-gray-300 rounded w-full mx-auto" />
      </div>
    );
  }

  if (!project) return <p className="text-center mt-20 text-lg font-semibold text-red-600">Project not found.</p>;

  const totalXp = xpData?.total_project_xp || 0;
  const userClaimedXp = xpData?.user_claimed_xp || 0;
  const claimedPercent = totalXp ? Math.min(100, Math.round((userClaimedXp / totalXp) * 100)) : 0;

  return (
    <div className="w-full px-6 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg max-w-5xl mx-auto">
      {/* Project Header */}
      <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg p-6 rounded-[2rem] shadow mb-8">
        <img src={project.logo} alt={project.name} className="w-20 h-20 rounded-full mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 text-center">{project.name}</h1>
        <p className="text-sm text-gray-700 mt-2 text-center">{project.description}</p>

        {/* XP Display only if authenticated and xpData available */}
        {isAuthenticated && xpData && (
          <div className="mt-6 w-full max-w-sm bg-white/40 backdrop-blur-lg rounded-full overflow-hidden border border-white/30 shadow relative h-5">
            <div
              className="h-5 rounded-full relative transition-all duration-1500 ease-in-out shadow-[0_0_10px_#6366f1]"
              style={{
                width: `${claimedPercent}%`,
                background:
                  "linear-gradient(270deg, #6366f1, #818cf8, #6366f1)",
                backgroundSize: "600% 600%",
                animation: "gradientShift 8s ease infinite",
              }}
            >
              {/* Shimmer highlight */}
              <div className="absolute top-0 left-0 h-full w-20 bg-white/30 rounded-full animate-shimmer" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs text-black/50 font-semibold select-none">
              {userClaimedXp} / {totalXp} XP Collected ({claimedPercent}%)
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {project.twitter_url && (
            <a
              href={project.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 transition text-sm font-medium"
            >
              Twitter
            </a>
          )}
          {project.telegram_url && (
            <a
              href={project.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 transition text-sm font-medium"
            >
              Telegram
            </a>
          )}
          {project.discord_url && (
            <a
              href={project.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 transition text-sm font-medium"
            >
              Discord
            </a>
          )}
        </div>
      </div>

      {/* Quests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => navigate(`/quests/${quest.id}`)}
            className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
          >
            <p className="text-xl font-semibold text-gray-800 leading-snug">
              {quest.description}
            </p>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-2">
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
        {/* Leaderboard */}
      {leaderboardData.length > 0 && (
        <div className="mt-12">
          <Leaderboard type="project" data={leaderboardData} />
        </div>
      )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* Make quests grid one column on mobile */
          .grid-cols-3 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}