"use client";

import React from "react";

export interface ActionEntry {
  id: string;
  timestamp: number;
  action: string;
  details?: string;
  type: "card" | "stat" | "enemy" | "combat";
}

interface ActionLogProps {
  actions: ActionEntry[];
  onClearHistory: () => void;
}

export default function ActionLog({ actions, onClearHistory }: ActionLogProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const getActionColor = (type: string) => {
    switch (type) {
      case "card":
        return "text-cyan-300";
      case "stat":
        return "text-blue-300";
      case "enemy":
        return "text-red-300";
      case "combat":
        return "text-purple-300";
      default:
        return "text-gray-300";
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "card":
        return "🃏";
      case "stat":
        return "⚡";
      case "enemy":
        return "⚔️";
      case "combat":
        return "🎯";
      default:
        return "➤";
    }
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col max-h-96">
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 sticky top-0 bg-gray-900/80">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
        >
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            Action History
          </span>
          <span className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        <button
          onClick={onClearHistory}
          className="px-3 py-1 text-xs rounded bg-red-900/20 text-red-300 hover:bg-red-900/40 transition-all"
        >
          Clear
        </button>
      </div>

      {isExpanded && (
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {actions.length === 0 ? (
            <div className="text-gray-500 text-xs italic text-center py-4">
              No actions yet. Make changes to see history.
            </div>
          ) : (
            <div className="space-y-2">
              {[...actions].reverse().map((entry, idx) => (
                <div
                  key={entry.id}
                  className="text-xs p-2 rounded bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors animate-fade-in-slide"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getActionIcon(entry.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${getActionColor(entry.type)} truncate`}>
                        {entry.action}
                      </div>
                      {entry.details && (
                        <div className="text-gray-400 mt-1 text-xs">
                          {entry.details}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
