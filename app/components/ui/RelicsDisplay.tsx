"use client";

interface Relic {
  name: string;
  description: string;
}

interface RelicsDisplayProps {
  relics?: Relic[];
}

export default function RelicsDisplay({ relics = [] }: RelicsDisplayProps) {
  if (relics.length === 0) {
    return null;
  }

  const relicIcons: Record<string, string> = {
    Lantern: "🏮",
    "Strike Dummy": "🎯",
    "Paper Phrog": "🐸",
    "Captains Wheel": "🛞",
    "Incense Burner": "🔥",
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
      <h3 className="text-sm font-bold text-amber-400 mb-3">✨ Relics</h3>
      <div className="grid gap-2">
        {relics.map((relic, idx) => (
          <div
            key={idx}
            className="p-3 bg-amber-900/15 rounded-lg border border-amber-700/30 hover:border-amber-600/50 transition-all"
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">
                {relicIcons[relic.name] || "💎"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-amber-300 text-sm">
                  {relic.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {relic.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
