import { useNavigate } from "react-router-dom";

export default function FeaturedQuests() {
  const navigate = useNavigate();

  const quests = [
    {
      id: 1,
      description: "Verify on X",
      projectName: "Project X",
      projectLogo: "/logo.png",
      xp: 30,
    },
    {
      id: 2,
      description: "Join Discord",
      projectName: "GammaDAO",
      projectLogo: "/logo.png",
      xp: 25,
    },
    {
      id: 3,
      description: "Mint Character",
      projectName: "ZetaChain",
      projectLogo: "/logo.png",
      xp: 50,
    },
    {
      id: 4,
      description: "Connect Wallet",
      projectName: "OmniFi",
      projectLogo: "/logo.png",
      xp: 15,
    },
    {
      id: 5,
      description: "Retweet Announcement",
      projectName: "NovaLaunch",
      projectLogo: "/logo.png",
      xp: 20,
    },
    {
      id: 6,
      description: "Vote in Snapshot",
      projectName: "MetaGov",
      projectLogo: "/logo.png",
      xp: 40,
    },
  ];
return (
  <div className="w-full px-4 sm:px-6 md:px-10 py-6 sm:py-10 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
    <h2 className="text-lg font-semibold mb-6">FEATURED QUESTS</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {quests.map((quest) => (
        <div
          key={quest.id}
          onClick={() => navigate(`/quests/${quest.id}`)}
          className="aspect-[4/3] rounded-xl bg-white/50 border border-white/30 shadow-inner p-4 sm:p-6 flex flex-col justify-between hover:scale-[1.02] transition duration-300 ease-in-out cursor-pointer"
        >
          <p className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
            {quest.description}
          </p>
          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center gap-2">
              <img
                src={quest.projectLogo}
                alt={quest.projectName}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {quest.projectName}
              </span>
            </div>
            <div className="bg-white/60 backdrop-blur-md px-2 py-1 rounded-full shadow text-xs font-semibold text-gray-900">
              +{quest.xp} XP
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
