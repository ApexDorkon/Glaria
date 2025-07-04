import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProjectQuest() {
  const { questId } = useParams();
  const navigate = useNavigate();

  const [quest, setQuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const res = await fetch(`https://glaria-api.onrender.com/api/quests/${questId}`);
        if (!res.ok) throw new Error(`Failed to fetch quest: ${res.statusText}`);

        const data = await res.json();

        // Fetch project details
        const projectData = await fetchProjectDetails(data.project_id);

        setQuest({
          ...data,
          project: projectData,
        });
      } catch (err) {
        setError(err.message || "Failed to load quest");
      } finally {
        setLoading(false);
      }
    };

    const fetchProjectDetails = async (projectId) => {
      try {
        const res = await fetch(`https://glaria-api.onrender.com/projects/${projectId}`);
        if (!res.ok) throw new Error("Failed to fetch project");
        return await res.json();
      } catch {
        return {
          name: "Unknown Project",
          logo: "/fallback.png",
          description: "",
        };
      }
    };

    fetchQuest();
  }, [questId]);

  if (loading) {
  return (
    <div className="max-w-5xl mx-auto mt-12 flex flex-col gap-10 px-4 animate-pulse">
      {/* Back button skeleton */}
      <div className="self-start w-24 h-8 rounded-full bg-gray-300 mb-6" />

      {/* Top section skeleton */}
      <div className="flex gap-10 flex-col md:flex-row">
        {/* Left: Quest description skeleton */}
        <div className="flex-1 bg-white/20 backdrop-blur-lg p-8 rounded-3xl border border-white/40 shadow-md">
          <div className="h-10 w-3/4 rounded bg-gray-300 mb-4" />
          <div className="space-y-3">
            <div className="h-4 rounded bg-gray-300 w-full" />
            <div className="h-4 rounded bg-gray-300 w-full" />
            <div className="h-4 rounded bg-gray-300 w-5/6" />
          </div>
        </div>

        {/* Right: Action buttons skeleton */}
        <div className="w-full md:w-[320px] bg-white/20 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-full bg-gray-300 w-full"
            />
          ))}
          <div className="h-10 rounded-full bg-gray-400 w-full mt-4" />
        </div>
      </div>

      {/* Bottom: Project details skeleton */}
      <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-gray-300" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-6 w-1/3 rounded bg-gray-300" />
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-4 w-5/6 rounded bg-gray-300" />
        </div>
      </div>
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
    <div className="max-w-5xl mx-auto mt-12 flex flex-col gap-10 px-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="self-start px-5 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow text-sm font-medium text-gray-800 hover:bg-white/50 transition"
      >
        ← Back to Quests
      </button>

      {/* Top section */}
      <div className="flex gap-10 items-start flex-col md:flex-row">
        {/* Left: Quest description */}
        <div className="flex-1 bg-white/30 backdrop-blur-lg p-8 rounded-3xl border border-white/40 shadow-md">
          <h2 className="text-3xl font-bold mb-4">{quest.title}</h2>
          <p className="text-lg leading-relaxed text-black/80">{quest.description}</p>
        </div>

        {/* Right: Action buttons */}
        <div className="w-full md:w-[320px] flex flex-col gap-4 bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md">
          {quest.actions.map((action) => (
            <a
              key={action.id}
              href={action.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/70 hover:bg-white text-sm py-2 px-4 rounded-full shadow text-center"
            >
              {action.button_type}
            </a>
          ))}

          <button
            disabled
            className="bg-indigo-500 text-white text-sm py-2 px-4 rounded-full shadow font-semibold hover:bg-indigo-600 mt-4 cursor-not-allowed"
            title="XP collection not implemented yet"
          >
            🎉 Collect {quest.points} XP
          </button>
        </div>
      </div>

      {/* Bottom: Project details */}
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
    </div>
  );
}