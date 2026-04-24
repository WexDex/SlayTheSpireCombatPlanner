"use client";

import React from "react";
import type { Turn } from "../lib/types";

interface EnemyDetailItem {
  name: string;
  hp: number;
  maxHp: number;
  debuffs?: string[];
}

interface EnemyDetailsBlockProps {
  enemies: EnemyDetailItem[];
  debuffs?: Record<number, string[]>;
  highlightIndex?: number | null;
  onEnemyHpChange?: (index: number, hp: number) => void;
  turn?: Turn;
  currentTurn?: number;
  onSelectTurn?: (turn: number) => void;
}

export default function EnemyDetailsBlock({
  enemies,
  debuffs = {},
  highlightIndex = null,
  onEnemyHpChange,
  turn,
  currentTurn = 1,
  onSelectTurn,
}: EnemyDetailsBlockProps) {
  if (enemies.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm animate-slide-in-up w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
          🎯 Enemy Status
        </h3>
        {onSelectTurn && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTurn(Math.max(1, currentTurn - 1))}
              className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-white transition-all"
              disabled={currentTurn <= 1}
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-300">Turn {currentTurn}</span>
            <button
              onClick={() => onSelectTurn(currentTurn + 1)}
              className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-white transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enemies.map((enemy, idx) => {
          const hpPercent = enemy.maxHp > 0 ? (enemy.hp / enemy.maxHp) * 100 : 0;
          const healthColor =
            hpPercent > 50 ? "from-green-600 to-green-500" : hpPercent > 25 ? "from-yellow-600 to-yellow-500" : "from-red-600 to-red-500";

          return (
            <div
              key={idx}
              className={`bg-gray-800/60 rounded-lg border border-gray-700/40 p-4 hover:border-gray-600/60 transition-all ${highlightIndex === idx ? "ring-2 ring-red-500/50 bg-red-900/10" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-100">{enemy.name}</h4>
                <span className="text-xs bg-gray-900 px-2 py-1 rounded text-gray-400">
                  Enemy {idx + 1}
                </span>
              </div>

              {/* HP Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Health</span>
                  <span className="text-sm font-bold text-red-300">
                    {enemy.hp} / {enemy.maxHp}
                  </span>
                </div>
                <div className="relative w-full h-6 bg-gray-900/80 rounded border border-gray-700/50 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${healthColor} transition-all duration-500`}
                    style={{ width: `${hpPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                      {Math.round(hpPercent)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick HP Adjustment */}
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => onEnemyHpChange?.(idx, Math.max(0, enemy.hp - 5))}
                  className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
                >
                  -5
                </button>
                <button
                  onClick={() => onEnemyHpChange?.(idx, Math.min(enemy.maxHp, enemy.hp + 5))}
                  className="flex-1 px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
                >
                  +5
                </button>
                <button
                  onClick={() => onEnemyHpChange?.(idx, enemy.maxHp)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-blue-900/30 text-blue-200 hover:bg-blue-900/50 transition-all"
                >
                  Max
                </button>
              </div>

              {/* Debuffs */}
              {((debuffs[idx] ?? enemy.debuffs) || []).length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-gray-400 mb-2">Active Effects</div>
                  <div className="flex flex-wrap gap-1">
                    {(debuffs[idx] ?? enemy.debuffs)?.map((debuff, didx) => (
                      <span
                        key={didx}
                        className="text-xs bg-red-900/30 text-red-200 px-2 py-0.5 rounded-full border border-red-700/50"
                      >
                        {debuff}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Indicator */}
              <div className="pt-2 border-t border-gray-700/30 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {enemy.hp <= 0 ? "💀 Defeated" : hpPercent > 75 ? "✓ Healthy" : hpPercent > 25 ? "⚠ Injured" : "🔴 Critical"}
                </span>
              </div>

              {/* Turn Intent */}
              {turn?.actions?.[idx] && (
                <div className="mt-4 p-3 rounded-lg bg-black/20 border border-gray-800">
                  <div className="text-xs text-gray-400 mb-2">Turn {turn.turn} Intent</div>
                  <div className="space-y-1 text-xs text-gray-200">
                    {turn.actions[idx].damage > 0 && (
                      <div className="text-red-300">Deals {turn.actions[idx].damage} damage</div>
                    )}
                    {turn.actions[idx].effects.map((effect, effIndex) => (
                      <div key={effIndex} className="text-blue-200">
                        {effect.value ? `${effect.type} ${effect.value}` : effect.type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
