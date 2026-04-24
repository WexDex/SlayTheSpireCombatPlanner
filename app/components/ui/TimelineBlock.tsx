"use client";

import React from "react";
import TimelineRow from "./TimelineRow";
import { ICONS } from "../lib/icons";
import EnemyIntentTurn from "./EnemyIntentTurn";
import type { Enemy, Turn } from "../lib/types";


type TimelineData = {
  enemies: Enemy[];
  turns: Turn[];
};

type Props = {
  enemies?: Enemy[];
  turns?: Turn[];
  currentTurn?: number;
  onSelectTurn?: (turn: number) => void;
  enemyDebuffs?: Record<number, Record<number, string[]>>;
  onAddEnemyDebuff?: (turn: number, enemyIndex: number, debuff: string) => void;
  onChangeEnemyHp?: (enemyIndex: number, hp: number) => void;
  highlightEnemyIndex?: number | null;
  energy?: number;
};

export default function TimelineBlock({ enemies = [], turns = [], currentTurn = 1, onSelectTurn, enemyDebuffs = {}, onAddEnemyDebuff, onChangeEnemyHp, highlightEnemyIndex = null, energy = 0 }: Props) {
  const timelineData: TimelineData = { enemies, turns };
  const sampleData = timelineData.enemies.length > 0 ? timelineData : null;
  const [debuffInputs, setDebuffInputs] = React.useState<Record<number, string>>({});

  function nextTurn() {
    if (sampleData) {
      const next = Math.min(currentTurn + 1, sampleData.turns.length);
      onSelectTurn?.(next);
    }
  }

  function prevTurn() {
    if (sampleData) {
      const prev = Math.max(currentTurn - 1, 1);
      onSelectTurn?.(prev);
    }
  }

  function handleDebuffChange(enemyIndex: number, value: string) {
    setDebuffInputs((prev) => ({ ...prev, [enemyIndex]: value }));
  }

  function handleAddDebuff(enemyIndex: number) {
    const text = debuffInputs[enemyIndex]?.trim();
    if (!text) return;
    onAddEnemyDebuff?.(currentTurn, enemyIndex, text);
    setDebuffInputs((prev) => ({ ...prev, [enemyIndex]: "" }));
  }

  if (!sampleData) {
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-400">No combat data loaded</h2>
      </div>
    );
  }
  return (
    <div className="flex flex-row justify-center gap-4">
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Fight Timeline
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left text-gray-400">Turn</th>
              {sampleData.enemies.map((enemy, index) => (
                <th
                  key={index}
                  className={`p-2 text-center text-gray-400 transition-all ${highlightEnemyIndex === index ? "bg-red-900/20 ring-1 ring-red-500/30" : ""}`}
                >
                  <div>{enemy.name}</div>
                  <div className="text-xs text-red-400">HP: {enemy.hp}</div>
                </th>
              ))}
              <th className="p-2 text-center text-yellow-400">Total DMG <span className="text-red-500 text-xs">(Vulnerable)</span></th>
            </tr>
          </thead>
          <tbody>
            {sampleData.turns.map((turn) => (
              <TimelineRow key={turn.turn} turn={turn} currentTurn={currentTurn} onSelectTurn={onSelectTurn} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm w-full">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Turn View
          </h2>
          <div className="flex flex-row gap-3 items-center justify-center">
            <button
              type="button"
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 shadow-sm"
              onClick={prevTurn}
            >
              ←
            </button>
            <button
              type="button"
              className="font-bold text-lg text-cyan-300 underline decoration-cyan-500 underline-offset-4 transition-all duration-200 hover:text-white"
              onClick={() => onSelectTurn?.(currentTurn === 1 ? 1 : currentTurn - 1)}
            >
              Turn {currentTurn}
            </button>
            <button
              type="button"
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 shadow-sm"
              onClick={nextTurn}
            >
              →
            </button>
          </div>
        </div>

        <div className="border border-blue-700/30 bg-blue-900/20 mb-4 p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm text-gray-400">Available Energy</div>
              <div className="text-3xl font-bold text-blue-300">{ICONS.energy} {energy}</div>
            </div>
          </div>
        </div>

        <h1 className="text-sm text-gray-400 mb-4 font-medium">Enemy Intents</h1>
        <div className="grid gap-3">
          {sampleData.enemies.map((enemy, index) => (
            <div key={index} className="p-4 bg-gray-800/60 rounded-xl border border-gray-700/40 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-200">{enemy.name}</div>
                  <div className="text-xs text-gray-500">Turn {currentTurn}</div>
                </div>
                <input
                  type="number"
                  min={0}
                  value={enemy.hp}
                  onChange={(e) => onChangeEnemyHp?.(index, Number(e.target.value))}
                  className="w-20 rounded-lg bg-gray-900 border border-gray-700 px-2 py-1 text-sm text-white"
                />
              </div>
              <EnemyIntentTurn key={index} id={index} name={enemy.name} turn={sampleData.turns[currentTurn - 1]} />
              <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-400">Add debuff for this turn</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={debuffInputs[index] ?? ""}
                    onChange={(e) => handleDebuffChange(index, e.target.value)}
                    placeholder="Weak, Frail..."
                    className="flex-1 rounded-lg bg-gray-900 border border-gray-700 px-2 py-2 text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDebuff(index)}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-500 transition-all"
                  >
                    Add
                  </button>
                </div>
                {enemyDebuffs[currentTurn]?.[index]?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {enemyDebuffs[currentTurn][index].map((debuff, id) => (
                      <span key={id} className="text-xs bg-red-600/20 text-red-200 px-2 py-1 rounded-full">
                        {debuff}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
