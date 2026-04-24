"use client";

import React from "react";
import type { Card } from "../lib/types";

interface ActionShortcutsProps {
  enemyCount: number;
  onDamageEnemy: (enemyIndex: number, damage: number) => void;
  onApplyDebuff: (enemyIndex: number, debuff: string) => void;
  onHealPlayer: (amount: number) => void;
  onDamagePlayer: (amount: number) => void;
  onAddPotion: (potionIndex: number) => void;
  onApplyPlayerBuff: (buff: string) => void;
  onApplyPlayerDebuff: (debuff: string) => void;
  potions?: Card[];
  currentTurn: number;
  enemyNames?: string[];
}

export default function ActionShortcuts({
  enemyCount,
  onDamageEnemy,
  onApplyDebuff,
  onHealPlayer,
  onDamagePlayer,
  onAddPotion,
  onApplyPlayerBuff,
  onApplyPlayerDebuff,
  potions = [],
  currentTurn,
  enemyNames = [],
}: ActionShortcutsProps) {
  const [selectedEnemy, setSelectedEnemy] = React.useState(0);
  const [damageInput, setDamageInput] = React.useState("10");
  const [debuffInput, setDebuffInput] = React.useState("");
  const [playerBuffInput, setPlayerBuffInput] = React.useState("");
  const [playerDebuffInput, setPlayerDebuffInput] = React.useState("");
  const [debuffCount, setDebuffCount] = React.useState(1);
  const [selectedPotion, setSelectedPotion] = React.useState(0);

  const handleDealDamage = (preset?: number) => {
    const damage = preset ?? Number(damageInput);
    if (damage > 0) {
      onDamageEnemy(selectedEnemy, damage);
      setDamageInput("10");
    }
  };

  const handleApplyDebuff = (preset?: string) => {
    const baseDebuff = preset ?? debuffInput;
    if (!baseDebuff.trim()) return;
    const debuff = debuffCount > 1 ? `${baseDebuff} x${debuffCount}` : baseDebuff;
    onApplyDebuff(selectedEnemy, debuff);
    setDebuffInput("");
    setDebuffCount(1);
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
          <div className="grid grid-cols-[1fr_auto] gap-2 mb-2">
            <input
              type="text"
              value={debuffInput}
              onChange={(e) => setDebuffInput(e.target.value)}
              className="rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              placeholder="Debuff name"
            />
            <input
              type="number"
              min={1}
              value={debuffCount}
              onChange={(e) => setDebuffCount(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              title="Stacks"
            />
          </div>
          <div className="flex gap-2 mb-2">
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

        {/* Player Buff Section */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 block mb-2">Apply Player Buff</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {["Strength", "Dexterity", "Focus", "Regeneration"].map((buff) => (
              <button
                key={buff}
                onClick={() => onApplyPlayerBuff(buff)}
                className="px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
              >
                {buff}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerBuffInput}
              onChange={(e) => setPlayerBuffInput(e.target.value)}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              placeholder="Custom buff"
            />
            <button
              onClick={() => {
                if (playerBuffInput.trim()) {
                  onApplyPlayerBuff(playerBuffInput.trim());
                  setPlayerBuffInput("");
                }
              }}
              className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-all shadow-lg shadow-green-500/20"
            >
              Add
            </button>
          </div>
        </div>

        {/* Player Debuff Section */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 block mb-2">Apply Player Debuff</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {["Weak", "Frail", "Vulnerable", "Poison"].map((debuff) => (
              <button
                key={debuff}
                onClick={() => onApplyPlayerDebuff(debuff)}
                className="px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
              >
                {debuff}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerDebuffInput}
              onChange={(e) => setPlayerDebuffInput(e.target.value)}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
              placeholder="Custom debuff"
            />
            <button
              onClick={() => {
                if (playerDebuffInput.trim()) {
                  onApplyPlayerDebuff(playerDebuffInput.trim());
                  setPlayerDebuffInput("");
                }
              }}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all shadow-lg shadow-red-500/20"
            >
              Add
            </button>
          </div>
        </div>

        {/* Potion Selection */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 block mb-2">Pick a Potion</label>
          <div className="flex gap-2 mb-2">
            <select
              value={selectedPotion}
              onChange={(e) => setSelectedPotion(Number(e.target.value))}
              className="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-2 py-2 text-xs text-white"
            >
              {potions.map((potion, idx) => (
                <option key={idx} value={idx}>
                  {potion.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => onAddPotion(selectedPotion)}
              className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shadow-lg shadow-amber-500/20"
            >
              Add
            </button>
          </div>
          {potions[selectedPotion] && (
            <div className="text-xs text-gray-400">
              {potions[selectedPotion].description}
            </div>
          )}
        </div>

        {/* Player Health Section */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-2">Damage Taken</label>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <button
                  onClick={() => onDamagePlayer(1)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
                >
                  1
                </button>
                <button
                  onClick={() => onDamagePlayer(3)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
                >
                  3
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onDamagePlayer(5)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
                >
                  5
                </button>
                <button
                  onClick={() => onDamagePlayer(10)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-red-900/30 text-red-200 hover:bg-red-900/50 transition-all"
                >
                  10
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-2">Heal</label>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <button
                  onClick={() => onHealPlayer(1)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
                >
                  1
                </button>
                <button
                  onClick={() => onHealPlayer(3)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
                >
                  3
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => onHealPlayer(5)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
                >
                  5
                </button>
                <button
                  onClick={() => onHealPlayer(10)}
                  className="flex-1 px-2 py-1 text-xs rounded bg-green-900/30 text-green-200 hover:bg-green-900/50 transition-all"
                >
                  10
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
