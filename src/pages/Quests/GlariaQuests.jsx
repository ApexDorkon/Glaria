import { useEffect, useState } from "react";

function GlariaQuests() {
  const [glariaQuests, setGlariaQuests] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchGlariaQuests = async () => {
      try {
        const res = await fetch("https://glaria-api.onrender.com/api/glaria-quests/");
        const data = await res.json();
        setGlariaQuests(data);
      } catch (err) {
        console.error("Failed to load GLARIA quests:", err);
      }
    };

    fetchGlariaQuests();
  }, []);

  if (!glariaQuests.length) return null;

  return (
    <div className="w-full mb-10">
      <h3 className="text-lg font-semibold mb-4">Main GLARIA Quests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {glariaQuests.map((quest) => (
          <div
            key={quest.id}
            onMouseEnter={() => setHoveredId(quest.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-transform duration-200 ${
              hoveredId === quest.id ? "scale-105 shadow-2xl" : ""
            }`}
          >
            <div>
              <h4 className="text-base font-semibold text-gray-900">{quest.title}</h4>
              <p className="text-sm text-gray-700 mt-1 mb-4">{quest.description}</p>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium text-gray-800 bg-white/50 px-2 py-1 rounded-full shadow">
                +{quest.points} XP
              </span>
              <a
                href={quest.target_url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition"
              >
                {quest.button_type}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GlariaQuests;