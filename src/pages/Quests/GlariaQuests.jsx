import { useEffect, useState } from "react";

function GlariaQuests() {
  const [glariaQuests, setGlariaQuests] = useState([]);
  // Track quest states: 'initial', 'clicked', 'verified'
  const [questStates, setQuestStates] = useState({}); 
  // Track cooldown timers for each quest by id
  const [cooldowns, setCooldowns] = useState({}); 

  useEffect(() => {
    const fetchGlariaQuests = async () => {
      try {
        const res = await fetch("https://glaria-api.onrender.com/api/glaria-quests/");
        const data = await res.json();
        setGlariaQuests(data);

        // Initialize all quests to 'initial' state
        const initialStates = {};
        data.forEach((quest) => (initialStates[quest.id] = 'initial'));
        setQuestStates(initialStates);
      } catch (err) {
        console.error("Failed to load GLARIA quests:", err);
      }
    };

    fetchGlariaQuests();
  }, []);

  // Handles button click: 
  //  - On initial: open link and switch to 'clicked' state + start cooldown
  //  - On clicked: switch to 'verified' state (simulate verification)
  const handleButtonClick = (quest) => {
    const state = questStates[quest.id];
    if (state === 'initial') {
      window.open(quest.target_url.trim(), "_blank");

      setQuestStates((prev) => ({ ...prev, [quest.id]: 'clicked' }));

      // Start cooldown (e.g., 10 sec)
      setCooldowns((prev) => ({ ...prev, [quest.id]: 10 }));

    } else if (state === 'clicked') {
      setQuestStates((prev) => ({ ...prev, [quest.id]: 'verified' }));
      setCooldowns((prev) => ({ ...prev, [quest.id]: 0 }));
    }
  };

  // Handle cooldown timer countdown every second
  useEffect(() => {
    const timers = Object.entries(cooldowns).filter(([_, cd]) => cd > 0);
    if (timers.length === 0) return;

    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const newCooldowns = { ...prev };
        timers.forEach(([id, cd]) => {
          if (cd > 0) newCooldowns[id] = cd - 1;
        });
        return newCooldowns;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldowns]);

  if (!glariaQuests.length) return null;

  return (
    <div className="w-full mb-10">
      <h3 className="text-lg font-semibold mb-4">Main GLARIA Quests</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {glariaQuests.map((quest) => {
          const state = questStates[quest.id] || 'initial';
          const cooldown = cooldowns[quest.id] || 0;

          return (
            <div
              key={quest.id}
              className={`
                relative
                bg-white/30 backdrop-blur-lg border border-white/40 shadow-lg rounded-2xl p-5 flex flex-col justify-between transition-transform duration-200
                ${state === 'verified' ? 'bg-gradient-to-t from-black/80 to-transparent' : ''}
              `}
            >
              {/* Verified check icon top-right */}
              {state === 'verified' && (
                <div className="absolute top-3 right-3 text-3xl text-yellow-400 drop-shadow-lg select-none">
                  ✓⃝
                </div>
              )}

              <div>
                <h4 className="text-base font-semibold text-gray-900">{quest.title}</h4>
                <p className="text-sm text-gray-700 mt-1 mb-4">{quest.description}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium text-gray-800 bg-white/50 px-2 py-1 rounded-full shadow">
                  +{quest.points} XP
                </span>

                <button
                  disabled={state === 'verified' || cooldown > 0}
                  onClick={() => handleButtonClick(quest)}
                  className={`
                    text-xs font-semibold px-4 py-1.5 rounded-full transition
                    ${
                      state === 'initial'
                        ? 'bg-black text-white hover:opacity-90'
                        : state === 'clicked'
                        ? 'bg-yellow-400 text-black cursor-pointer'
                        : 'bg-green-500 text-white cursor-default'
                    }
                    ${cooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {state === 'initial' && quest.button_type}
                  {state === 'clicked' && (cooldown > 0 ? `Wait ${cooldown}s` : 'Verify')}
                  {state === 'verified' && 'claimed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GlariaQuests;