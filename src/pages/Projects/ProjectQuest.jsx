import { useParams, useNavigate } from "react-router-dom";
import React from "react";

export default function ProjectQuest() {
  const { questId } = useParams();
  const navigate = useNavigate();

  // Dummy quest data (to be replaced by fetched API)
  const dummyQuest = {
    id: questId,
    title: "Follow & Like on Twitter",
    description:
      "To complete this quest, follow our Twitter page and like the latest post to show your support. Once both actions are verified, you can collect your XP reward!",
    steps: [
      { id: 1, label: "Follow Twitter", done: false },
      { id: 2, label: "Like Post", done: false },
    ],
    xp: 20,
    project: {
      name: "Sophon Protocol",
      logo: "/logo.png",
      description:
        "Sophon is a decentralized data layer enabling seamless AI interactions across chains. Backed by cutting-edge cryptographic proofs.",
    },
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 flex flex-col gap-10 px-4">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="self-start px-5 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/50 shadow text-sm font-medium text-gray-800 hover:bg-white/50 transition"
      >
        ← Back to Quests
      </button>

      {/* Top section */}
      <div className="flex gap-10 items-start">
        {/* Left: Quest description */}
        <div className="flex-1 bg-white/30 backdrop-blur-lg p-8 rounded-3xl border border-white/40 shadow-md">
          <h2 className="text-3xl font-bold mb-4">{dummyQuest.title}</h2>
          <p className="text-lg leading-relaxed text-black/80">
            {dummyQuest.description}
          </p>
        </div>

        {/* Right: Action buttons */}
        <div className="w-[300px] flex flex-col gap-4 bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md">
          {dummyQuest.steps.map((step) => (
            <button
              key={step.id}
              className="bg-white/70 hover:bg-white text-sm py-2 px-4 rounded-full shadow"
            >
              {step.label}
            </button>
          ))}

          <button className="bg-indigo-500 text-white text-sm py-2 px-4 rounded-full shadow font-semibold hover:bg-indigo-600">
            🎉 Collect {dummyQuest.xp} XP
          </button>
        </div>
      </div>

      {/* Bottom: Project details */}
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-3xl border border-white/40 shadow-md flex items-center gap-6">
        <img
          src={dummyQuest.project.logo}
          alt={dummyQuest.project.name}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {dummyQuest.project.name}
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {dummyQuest.project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
