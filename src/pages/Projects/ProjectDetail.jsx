import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`https://glaria-api.onrender.com/projects/${projectId}`);
        const data = await res.json();

        setProject({
          ...data,
          logo: "/logo.png", // Replace with dynamic logo if your backend supports it
          totalXp: 70, // Set to real value when available
          socials: {
            twitter: data.twitter_url,
            telegram: data.telegram_url,
            discord: data.discord_url,
          }
        });

        // TODO: Fetch quests for the project (use real API if available)
        setQuests([
          {
            id: 1,
            description: "Complete the onboarding quest",
            xp: 20,
            projectName: data.name,
            projectLogo: "/logo.png",
          },
          {
            id: 2,
            description: "Join the Discord and say hi",
            xp: 10,
            projectName: data.name,
            projectLogo: "/logo.png",
          },
        ]);

      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    fetchProject();
  }, [projectId]);

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
          {project.socials.twitter && (
            <a
              href={project.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 transition text-sm font-medium"
            >
              Twitter
            </a>
          )}
          {project.socials.telegram && (
            <a
              href={project.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/50 transition text-sm font-medium"
            >
              Telegram
            </a>
          )}
          {project.socials.discord && (
            <a
              href={project.socials.discord}
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