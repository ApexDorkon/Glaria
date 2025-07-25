import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CreateProjectModal from "../../components/CreateProjectModal";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectXpData, setProjectXpData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchProjectsAndXp = async () => {
      try {
        // Fetch all projects first
        const res = await fetch("https://glaria-api.onrender.com/projects/");
        const data = await res.json();

        // Store projects initially without XP data
        setProjects(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            logo: p.image_url || "/fallback.png",
          }))
        );

        // Get token for authorization
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.warn("No access token found for XP data fetch");
          setLoading(false);
          return;
        }

        // Fetch XP data for all projects in parallel
        const xpResponses = await Promise.all(
          data.map((project) =>
            fetch(`https://glaria-api.onrender.com/projects/xp-by-project/${project.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => res.json())
              .catch(() => ({
                project_id: project.id,
                total_project_xp: 0,
                user_claimed_xp: 0,
              }))
          )
        );

        // Map project_id => xp info
        const xpDataMap = {};
        xpResponses.forEach(({ project_id, total_project_xp, user_claimed_xp }) => {
          xpDataMap[project_id] = { total_project_xp, user_claimed_xp };
        });

        setProjectXpData(xpDataMap);
      } catch (err) {
        console.error("Failed to fetch projects or XP data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsAndXp();
  }, []);

  return (
    <div className="w-full px-10 py-10">
      {/* Project Cards Grid Container */}
      <div className="bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg p-8 mb-12 projects-glass-container">
        <h2 className="text-2xl font-bold mb-8">Explore Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-6 bg-white/50 border border-white/30 shadow-xl backdrop-blur-xl animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                  </div>
                  <div className="h-3 bg-gray-300 rounded w-full" />
                  <div className="h-3 bg-gray-300 rounded w-5/6" />
                  <div className="h-3 bg-gray-300 rounded w-2/3" />
                  <div className="w-full h-3 rounded-full bg-gray-300" />
                  <div className="h-3 w-1/3 bg-gray-300 rounded ml-auto" />
                </div>
              ))
            : projects.map((project) => {
                const xpInfo = projectXpData[project.id] || {
                  total_project_xp: 0,
                  user_claimed_xp: 0,
                };
                const claimedPercent = xpInfo.total_project_xp
                  ? Math.min(
                      100,
                      Math.round(
                        (xpInfo.user_claimed_xp / xpInfo.total_project_xp) * 100
                      )
                    )
                  : 0;
                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="cursor-pointer rounded-3xl p-6 bg-white/50 border border-white/30 shadow-xl transition-transform hover:scale-[1.02] backdrop-blur-xl flex flex-col justify-between project-card"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={project.logo}
                        alt={project.name}
                        className="w-12 h-12 rounded-full border border-white shadow object-cover"
                      />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-4 w-full max-w-sm bg-white/40 backdrop-blur-lg rounded-full overflow-hidden border border-white/30 shadow relative h-3">
                      <div
                        className="h-3 rounded-full relative transition-all duration-1500 ease-in-out shadow-[0_0_10px_#6366f1]"
                        style={{
                          width: `${claimedPercent}%`,
                          background:
                            "linear-gradient(270deg, #4f46e5, #818cf8, #4f46e5)",
                          backgroundSize: "600% 600%",
                          animation: "gradientShift 8s ease infinite",
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 h-full w-20 bg-white/20 rounded-full animate-shimmer" />
                      </div>
                    </div>
                    <p className="mt-2 text-right text-xs font-medium text-gray-600">
                      {xpInfo.user_claimed_xp} / {xpInfo.total_project_xp} XP earned ({claimedPercent}%)
                    </p>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Call to Action Section - Separate */}
      <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl p-8 text-center shadow-md max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Are you a Project Founder?
        </h3>
        <p className="text-gray-700 mb-4">
          Launch your project, create quests, and connect with engaged users on
          the Sophon ecosystem.
        </p>
        <button
  onClick={() => window.open("https://t.me/glariaxyz", "_blank")}
  className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
>
  + Create Your Project
</button>
      </div>

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}

      <style>{`
        @media (max-width: 768px) {
          /* On mobile, keep project cards one column */
          .grid-cols-3 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
          /* Expand glass background container fully */
          .projects-glass-container {
            padding-left: 2rem;
            padding-right: 2rem;
            margin-left: -2.5rem;
            margin-right: -2.5rem;
            border-radius: 2rem;
          }
          /* Make project cards bigger inside container */
          .project-card {
            max-width: none !important;
          }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
           @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-shimmer {
  animation: shimmer 3.5s ease-in-out infinite;
}
       
      `}</style>
    </div>
  );
}