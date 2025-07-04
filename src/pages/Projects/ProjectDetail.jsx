import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndQuests = async () => {
      try {
        // Fetch project details
        const projectRes = await fetch(`https://glaria-api.onrender.com/projects/${projectId}`);
        const projectData = await projectRes.json();

        setProject({
          ...projectData,
          logo: projectData.image_url || "/fallback.png",
          totalXp: 70, // Temporary until real XP data is available
        });

        // Fetch quests by project id
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
      } catch (err) {
        console.error("Failed to fetch project or quests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndQuests();
  }, [projectId]);

  if (loading) {
  return (
    <div className="w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg max-w-5xl mx-auto mt-12 animate-pulse">
      {/* Project Header Skeleton */}
      <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg p-6 rounded-[2rem] shadow mb-8">
        <div className="w-20 h-20 rounded-full bg-gray-300 mb-4" />
        <div className="h-8 w-48 bg-gray-300 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-300 rounded mb-4" />
        <div className="mt-4 w-full max-w-sm bg-gray-300 rounded-full h-4" />
      </div>

      {/* Social Links Skeleton */}
      <div className="flex gap-4 mt-6 justify-center">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="w-20 h-8 rounded-full bg-gray-300" />
        ))}
      </div>

      {/* Quests Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-xl bg-gray-300 p-6 flex flex-col justify-between"
          >
            <div className="h-6 rounded bg-gray-400 w-3/4 mb-6" />
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-400" />
                <div className="h-4 w-20 rounded bg-gray-400" />
              </div>
              <div className="h-5 w-10 rounded bg-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  if (!project) return null;

  return (
    <div className="w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      {/* Project Header */}
      <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-lg p-6 rounded-[2rem] shadow mb-8">
        <img src={project.logo} alt={project.name} className="w-20 h-20 rounded-full mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm text-gray-700 mt-2">{project.description}</p>

        {/* XP Display */}
        <div className="mt-4 w-full max-w-sm bg-white/40 backdrop-blur-lg rounded-full overflow-hidden border border-white/30 shadow">
          <div
            className="bg-indigo-500 text-xs text-white text-center py-1"
            style={{ width: `${project.totalXp}%` }}
          >
            {project.totalXp} XP Collected
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-4 mt-6">
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
      </div>
    </div>
  );
}