import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://glaria-api.onrender.com/projects/");
        const data = await res.json();

        // Optional: simulate delay
        setTimeout(() => {
          setProjects(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              logo: "/logo.png", // Use a real logo field if available
              xp: Math.floor(Math.random() * 100), // Placeholder XP
            }))
          );
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="w-full px-10 py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
      <h2 className="text-2xl font-bold mb-8">Explore Projects</h2>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
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
          : projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="cursor-pointer rounded-3xl p-6 bg-white/50 border border-white/30 shadow-xl transition-transform hover:scale-[1.02] backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-12 h-12 rounded-full border border-white shadow"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {project.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="w-full h-3 rounded-full bg-white/40 overflow-hidden">
                  <div
                    className="h-3 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${project.xp}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs font-medium text-gray-600">
                  {project.xp}% XP earned
                </p>
              </div>
            ))}
      </div>

      {/* Call to Action */}
      <div className="mt-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-3xl p-8 text-center shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Are you a Project Founder?
        </h3>
        <p className="text-gray-700 mb-4">
          Launch your project, create quests, and connect with engaged users on the Sophon ecosystem.
        </p>
        <button
          onClick={() => navigate("/create-project")}
          className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition"
        >
          + Create Your Project
        </button>
      </div>
    </div>
  );
}