"use client";

import PlayerStatsBlock from "./components/ui/PlayerStatsBlock";
import TimelineBlock from "./components/ui/TimelineBlock";
import PlayerHandBlock from "./components/ui/PlayerHandBlock";
import DrawPileBlock from "./components/ui/DrawPileBlock";
import CardMenu from "./components/ui/CardMenu";
import ActionLog, { ActionEntry } from "./components/ui/ActionLog";
import ActionShortcuts from "./components/ui/ActionShortcuts";
import {
  getPlayerData,
  getDeckCards,
  getEnemiesAndTurns,
} from "./components/lib/combatDataLoader";
import {
  addWound,
  deleteCard,
  downgradeCard,
  duplicateCard,
  moveCard,
  type GameState,
  upgradeCard,
} from "./components/lib/GameActions";
import { useState } from "react";
import { Card, LOCATION } from "./components/lib/types";
import PileBlock from "./components/ui/PileBlock";

const playerData = getPlayerData();
const deckCards = getDeckCards();
const { enemies, turns } = getEnemiesAndTurns();

const initialGameState: GameState = {
  turn: 1,
  [LOCATION.HAND]: deckCards.slice(0, 10),
  [LOCATION.DRAW]: deckCards.slice(10),
  [LOCATION.DISCARD]: [],
  [LOCATION.EXHAUST]: [],
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedCard, setSelectedCard] = useState<{
    card: Card;
    location: LOCATION;
    index: number;
  } | null>(null);
  const [playerStats, setPlayerStats] = useState({
    hp: playerData.hp,
    maxHp: playerData.maxHp,
    energy: playerData.energy.base,
    drawPerTurn: playerData.drawPerTurn,
  });
  const [enemyStats, setEnemyStats] = useState(
    enemies.map((enemy) => ({ name: enemy.name, hp: enemy.hp })),
  );
  const [enemyDebuffs, setEnemyDebuffs] = useState<
    Record<number, Record<number, string[]>>
  >({});
  const [actionHistory, setActionHistory] = useState<ActionEntry[]>([]);

  const addActionLog = (
    action: string,
    type: ActionEntry["type"],
    details?: string,
  ) => {
    const entry: ActionEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      action,
      type,
      details,
    };
    setActionHistory((prev) => [...prev, entry]);
  };

  const handleCardSelect = (card: Card, location: LOCATION, index: number) => {
    setSelectedCard({ card, location, index });
  };

  const handleMenuClose = () => {
    setSelectedCard(null);
  };

  const handleMoveCard = (
    from: LOCATION,
    index: number,
    to: LOCATION,
    top = false,
  ) => {
    const cardName = gameState[from]?.[index]?.name || "Unknown Card";
    const locationMap = {
      hand: "Hand",
      draw: "Draw",
      discard: "Discard",
      exhaust: "Exhaust",
    };
    addActionLog(
      `Moved ${cardName} to ${locationMap[to]}`,
      "card",
      `From ${locationMap[from]}${top ? " (Top of pile)" : ""}`,
    );
    setGameState((prev) => moveCard(prev, from, index, to, top));
  };

  const handleUpgradeCard = (loc: LOCATION, index: number) => {
    const cardName = gameState[loc]?.[index]?.name || "Unknown Card";
    addActionLog(`Upgraded ${cardName}`, "card", "Card is now enhanced");
    setGameState((prev) => upgradeCard(prev, loc, index));
  };

  const handleDowngradeCard = (loc: LOCATION, index: number) => {
    const cardName = gameState[loc]?.[index]?.name || "Unknown Card";
    addActionLog(`Downgraded ${cardName}`, "card", "Card is back to normal");
    setGameState((prev) => downgradeCard(prev, loc, index));
  };

  const handleDuplicateCard = (loc: LOCATION, index: number) => {
    const cardName = gameState[loc]?.[index]?.name || "Unknown Card";
    addActionLog(`Duplicated ${cardName}`, "card", "An extra copy was created");
    setGameState((prev) => duplicateCard(prev, loc, index));
  };

  const handleDeleteCard = (loc: LOCATION, index: number) => {
    const cardName = gameState[loc]?.[index]?.name || "Unknown Card";
    addActionLog(`Deleted ${cardName}`, "card", "Card was removed from deck");
    setGameState((prev) => deleteCard(prev, loc, index));
  };

  const handleAddWound = (loc: LOCATION, amount: number) => {
    addActionLog(
      `Added ${amount} Wound${amount > 1 ? "s" : ""}`,
      "card",
      `Added to ${loc}`,
    );
    setGameState((prev) => addWound(prev, loc, amount));
  };

  const handleDiscardHand = () => {
    const cardCount = gameState[LOCATION.HAND].length;
    addActionLog(
      `Discarded ${cardCount} card${cardCount !== 1 ? "s" : ""}`,
      "combat",
      "Entire hand moved to discard",
    );
    setGameState((prev) => {
      const next = { ...prev } as GameState;
      next[LOCATION.DISCARD] = [
        ...next[LOCATION.DISCARD],
        ...next[LOCATION.HAND],
      ];
      next[LOCATION.HAND] = [];
      return next;
    });
    setSelectedCard(null);
  };

  const handleDrawCards = (count: number) => {
    addActionLog(
      `Drew ${count} card${count !== 1 ? "s" : ""}`,
      "combat",
      `From draw pile`,
    );
    setGameState((prev) => {
      const next = { ...prev } as GameState;
      const drawCards = next[LOCATION.DRAW].slice(0, count);
      next[LOCATION.HAND] = [...next[LOCATION.HAND], ...drawCards];
      next[LOCATION.DRAW] = next[LOCATION.DRAW].slice(count);
      return next;
    });
  };

  const handleResetSimulation = () => {
    addActionLog(
      "Reset Simulation",
      "combat",
      "All changes reverted to initial state",
    );
    setGameState(initialGameState);
    setSelectedCard(null);
  };

  const handleSelectTurn = (turnNumber: number) => {
    addActionLog(
      `Selected Turn ${turnNumber}`,
      "combat",
      `Viewing turn ${turnNumber}`,
    );
    setGameState((prev) => ({ ...prev, turn: turnNumber }));
  };

  const handleChangePlayerStat = (
    field: keyof typeof playerStats,
    value: number,
  ) => {
    const statNames = {
      hp: "HP",
      maxHp: "Max HP",
      energy: "Energy",
      drawPerTurn: "Draw Per Turn",
    };
    addActionLog(
      `Player ${statNames[field]} changed`,
      "stat",
      `New value: ${value}`,
    );
    setPlayerStats((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeEnemyHp = (index: number, hp: number) => {
    const enemyName = enemyStats[index]?.name || `Enemy ${index + 1}`;
    addActionLog(`${enemyName} HP changed`, "enemy", `New HP: ${hp}`);
    setEnemyStats((prev) =>
      prev.map((enemy, idx) => (idx === index ? { ...enemy, hp } : enemy)),
    );
  };

  const handleAddEnemyDebuff = (
    turnNumber: number,
    enemyIndex: number,
    debuff: string,
  ) => {
    const enemyName = enemyStats[enemyIndex]?.name || `Enemy ${enemyIndex + 1}`;
    addActionLog(
      `Applied ${debuff} to ${enemyName}`,
      "enemy",
      `Turn ${turnNumber}`,
    );
    setEnemyDebuffs((prev) => {
      const existing = prev[turnNumber] ?? {};
      const enemyList = existing[enemyIndex] ?? [];
      return {
        ...prev,
        [turnNumber]: {
          ...existing,
          [enemyIndex]: [...enemyList, debuff],
        },
      };
    });
  };

  const handleEnergyChange = (value: number) => {
    addActionLog(`Energy adjusted`, "stat", `New energy: ${value}`);
    setPlayerStats((prev) => ({ ...prev, energy: value }));
  };

  const handleShortcutDamage = (enemyIndex: number, damage: number) => {
    const enemyName = enemyStats[enemyIndex]?.name || `Enemy ${enemyIndex + 1}`;
    addActionLog(
      `Dealt ${damage} damage to ${enemyName}`,
      "combat",
      `Turn ${gameState.turn} : new Health : ${Math.max(0, enemyStats[enemyIndex].hp - damage)}`,
    );
    setEnemyStats((prev) =>
      prev.map((enemy, idx) =>
        idx === enemyIndex
          ? { ...enemy, hp: Math.max(0, enemy.hp - damage) }
          : enemy,
      ),
    );
  };

  const handleShortcutDebuff = (enemyIndex: number, debuff: string) => {
    const enemyName = enemyStats[enemyIndex]?.name || `Enemy ${enemyIndex + 1}`;
    addActionLog(
      `Applied ${debuff} to ${enemyName}`,
      "enemy",
      `Turn ${gameState.turn}`,
    );
    setEnemyDebuffs((prev) => {
      const existing = prev[gameState.turn] ?? {};
      const enemyList = existing[enemyIndex] ?? [];
      return {
        ...prev,
        [gameState.turn]: {
          ...existing,
          [enemyIndex]: [...enemyList, debuff],
        },
      };
    });
  };

  const handleShortcutHeal = (amount: number) => {
    addActionLog(
      `Healed ${amount} HP`,
      "stat",
      `Player now has ${Math.min(playerStats.maxHp, playerStats.hp + amount)} HP`,
    );
    setPlayerStats((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + amount),
    }));
  };

  const handleShortcutDamagePlayer = (amount: number) => {
    addActionLog(
      `Took ${amount} damage`,
      "stat",
      `Player now has ${Math.max(0, playerStats.hp - amount)} HP`,
    );
    setPlayerStats((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - amount),
    }));
  };

  const handleClearHistory = () => {
    setActionHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-6">
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          Slay the Spire Combat Planner
        </h1>
        <p className="text-sm text-gray-500">COMBAT_TYPE : ENEMY_NAME</p>
      </div>

      {/* Card Menu at Top */}
      {selectedCard && (
        <CardMenu
          isOpen={true}
          card={selectedCard.card}
          location={selectedCard.location}
          index={selectedCard.index}
          moveCard={handleMoveCard}
          upgradeCard={handleUpgradeCard}
          downgradeCard={handleDowngradeCard}
          duplicateCard={handleDuplicateCard}
          deleteCard={handleDeleteCard}
          addWound={handleAddWound}
          onClose={handleMenuClose}
        />
      )}

      <div className="gap-5 flex flex-col">
        {/* FIRST BLOCK : PLAYER STATS */}
        <PlayerStatsBlock
          HP={playerStats.hp}
          MaxHP={playerStats.maxHp}
          Energy={playerStats.energy}
          DrawPT={playerStats.drawPerTurn}
          onChangeHP={(value) => handleChangePlayerStat("hp", value)}
          onChangeMaxHP={(value) => handleChangePlayerStat("maxHp", value)}
          onChangeEnergy={handleEnergyChange}
          onChangeDrawPT={(value) =>
            handleChangePlayerStat("drawPerTurn", value)
          }
        />

        {/* SECOND BLOCK : ENEMY TIMELINE */}
        <TimelineBlock
          enemies={enemyStats}
          turns={turns}
          currentTurn={gameState.turn}
          onSelectTurn={handleSelectTurn}
          enemyDebuffs={enemyDebuffs}
          onAddEnemyDebuff={handleAddEnemyDebuff}
          onChangeEnemyHp={handleChangeEnemyHp}
          energy={playerStats.energy}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="space-y-5">
            {/* THIRD BLOCK : Player Hand */}
            <PlayerHandBlock
              cards={gameState[LOCATION.HAND]}
              moveCard={handleMoveCard}
              upgradeCard={handleUpgradeCard}
              downgradeCard={handleDowngradeCard}
              duplicateCard={handleDuplicateCard}
              deleteCard={handleDeleteCard}
              addWound={handleAddWound}
              onCardSelect={handleCardSelect}
              selectedCard={selectedCard}
              onDiscardHand={handleDiscardHand}
              onDrawCards={handleDrawCards}
              onResetSimulation={handleResetSimulation}
            />

            {/* FOURTH BLOCK : Draw Pile */}
            <DrawPileBlock
              cards={gameState[LOCATION.DRAW]}
              moveCard={handleMoveCard}
              upgradeCard={handleUpgradeCard}
              downgradeCard={handleDowngradeCard}
              duplicateCard={handleDuplicateCard}
              deleteCard={handleDeleteCard}
              addWound={handleAddWound}
              onCardSelect={handleCardSelect}
              selectedCard={selectedCard}
            />

            {/* ACTION LOG */}
            <ActionLog
              actions={actionHistory}
              onClearHistory={handleClearHistory}
            />
          </div>

          <div className="space-y-5">
            {/* ACTION SHORTCUTS */}
            <ActionShortcuts
              enemyCount={enemyStats.length}
              enemyNames={enemyStats.map((e) => e.name)}
              currentTurn={gameState.turn}
              onDamageEnemy={handleShortcutDamage}
              onApplyDebuff={handleShortcutDebuff}
              onHealPlayer={handleShortcutHeal}
              onDamagePlayer={handleShortcutDamagePlayer}
            />
            <PileBlock
              title="Discard"
              cards={gameState[LOCATION.DISCARD]}
              location={LOCATION.DISCARD}
              moveCard={handleMoveCard}
              upgradeCard={handleUpgradeCard}
              downgradeCard={handleDowngradeCard}
              duplicateCard={handleDuplicateCard}
              deleteCard={handleDeleteCard}
              addWound={handleAddWound}
              onCardSelect={handleCardSelect}
              selectedCard={selectedCard}
            />
            <PileBlock
              title="Exhaust"
              cards={gameState[LOCATION.EXHAUST]}
              location={LOCATION.EXHAUST}
              moveCard={handleMoveCard}
              upgradeCard={handleUpgradeCard}
              downgradeCard={handleDowngradeCard}
              duplicateCard={handleDuplicateCard}
              deleteCard={handleDeleteCard}
              addWound={handleAddWound}
              onCardSelect={handleCardSelect}
              selectedCard={selectedCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
