"use client";

import React from "react";

interface ActionShortcutsProps {
  enemyCount: number;
  onDamageEnemy: (enemyIndex: number, damage: number) => void;
  onApplyDebuff: (enemyIndex: number, debuff: string) => void;
  onHealPlayer: (amount: number) => void;
  onDamagePlayer: (amount: number) => void;
  currentTurn: number;
  enemyNames?: string[];
}

export default function ActionShortcuts({
  enemyCount,
  onDamageEnemy,
  onApplyDebuff,
  onHealPlayer,
  onDamagePlayer,
  currentTurn,
  enemyNames = [],
}: ActionShortcutsProps) {
  const [selectedEnemy, setSelectedEnemy] = React.useState(0);
  const [damageInput, setDamageInput] = React.useState("10");
  const [debuffInput, setDebuffInput] = React.useState("");

  const handleDealDamage = (preset?: number) => {
    const damage = preset ?? Number(damageInput);
    if (damage > 0) {
      onDamageEnemy(selectedEnemy, damage);
      setDamageInput("10");
    }
  };

  const handleApplyDebuff = (preset?: string) => {
    const debuff = preset ?? debuffInput;
    if (debuff.trim()) {
      onApplyDebuff(selectedEnemy, debuff);
      setDebuffInput("");
    }
  };

  const presetDebuffs = ["Weak", "Frail", "Vulnerable", "Strength", "Dexterity", "Artifact"];

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm animate-slide-in-up w-fit">
      <div className="mb-4 px-8">
        <div className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-3">
          Quick Actions - Turn {currentTurn}
        </div>

        {/* Enemy Selection */}
        {enemyCount > 0 && (
          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-2">Target Enemy</label>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: enemyCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEnemy(idx)}
                  className={`px-3 py-2 text-xs rounded-lg font-semibold transition-all ${
                    selectedEnemy === idx
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/50"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {enemyNames[idx] || `Enemy ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Damage Section */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 block mb-2">Deal Damage</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min="1"
              value={damageInput}
              onChange={(e) => setDamageInput(e.target.value)}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              placeholder="Damage amount"
            />
            <button
              onClick={() => handleDealDamage()}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20"
            >
              Deal
            </button>
          </div>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((dmg) => (
              <button
                key={dmg}
                onClick={() => handleDealDamage(dmg)}
                className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
              >
                {dmg}
              </button>
            ))}
          </div>
        </div>

        {/* Debuff Section */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 block mb-2">Apply Debuff</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={debuffInput}
              onChange={(e) => setDebuffInput(e.target.value)}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              placeholder="Debuff name"
            />
            <button
              onClick={() => handleApplyDebuff()}
              className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-500/20"
            >
              Apply
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presetDebuffs.map((debuff) => (
              <button
                key={debuff}
                onClick={() => handleApplyDebuff(debuff)}
                className="px-2 py-1 text-xs rounded bg-purple-900/30 text-purple-200 hover:bg-purple-900/50 transition-all"
              >
                {debuff}
              </button>
            ))}
          </div>
        </div>

        {/* Player Health Section */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400 block mb-2">Heal</label>
            <div className="flex gap-1">
              <button
                onClick={() => onHealPlayer(5)}
                className="flex-1 px-2 py-2 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
              >
                +5
              </button>
              <button
                onClick={() => onHealPlayer(10)}
                className="flex-1 px-2 py-2 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
              >
                +10
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2">Take Damage</label>
            <div className="flex gap-1">
              <button
                onClick={() => onDamagePlayer(5)}
                className="flex-1 px-2 py-2 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
              >
                -5
              </button>
              <button
                onClick={() => onDamagePlayer(10)}
                className="flex-1 px-2 py-2 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
              >
                -10
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
