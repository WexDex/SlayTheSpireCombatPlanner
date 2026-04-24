"use client";

import PlayerStatsBlock from "./components/ui/PlayerStatsBlock";
import TimelineBlock from "./components/ui/TimelineBlock";
import PlayerHandBlock from "./components/ui/PlayerHandBlock";
import DrawPileBlock from "./components/ui/DrawPileBlock";
import CardMenu from "./components/ui/CardMenu";
import ActionLog, { ActionEntry } from "./components/ui/ActionLog";
import ActionShortcuts from "./components/ui/ActionShortcuts";
import RelicsDisplay from "./components/ui/RelicsDisplay";
import EnemyDetailsBlock from "./components/ui/EnemyDetailsBlock";
import {
  getPlayerData,
  getDeckCards,
  getEnemiesAndTurns,
  getPotions,
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
  [LOCATION.HAND]: deckCards.slice(0, 5),
  [LOCATION.DRAW]: deckCards.slice(5),
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
    energy: playerData.energy.base + (playerData.energy.turn1Bonus || 0),
    drawPerTurn: playerData.drawPerTurn,
    block: 0,
  });
  const [enemyStats, setEnemyStats] = useState(
    enemies.map((enemy) => ({ name: enemy.name, hp: enemy.hp, maxHp: enemy.maxHp || enemy.hp })),
  );
  const [enemyDebuffs, setEnemyDebuffs] = useState<
    Record<number, Record<number, string[]>>
  >({});
  const [enemyHistory, setEnemyHistory] = useState<Record<
    number,
    {
      stats: { name: string; hp: number; maxHp: number }[];
      debuffs: Record<number, string[]>;
    }
  >>({});
  const [playerEffects, setPlayerEffects] = useState<
    Record<number, { buffs: string[]; debuffs: string[] }>
  >({});
  const [lastUpdatedEnemyIndex, setLastUpdatedEnemyIndex] = useState<number | null>(null);
  const [actionHistory, setActionHistory] = useState<ActionEntry[]>([]);
  const [potions] = useState(() => getPotions());

  const addActionLog = (
    action: string,
    type: ActionEntry["type"],
    details?: string,
    beforeValue?: string | number,
    afterValue?: string | number,
    relatedInfo?: string[],
  ) => {
    const entry: ActionEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      action,
      type,
      details,
      beforeValue,
      afterValue,
      relatedInfo,
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
    const damage = (gameState[loc]?.[index]?.damage?.upgraded || gameState[loc]?.[index]?.damage?.base || 0);
    const block = (gameState[loc]?.[index]?.block?.upgraded || gameState[loc]?.[index]?.block?.base || 0);
    const stats = [damage > 0 ? `+${damage} DMG` : "", block > 0 ? `+${block} Block` : ""].filter(Boolean).join(", ");
    addActionLog(`Upgraded ${cardName}`, "card", `${stats || "Stats enhanced"} - Cost effect reduced`);
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

  const saveEnemyTurnSnapshot = (turnNumber: number) => {
    setEnemyHistory((prev) => ({
      ...prev,
      [turnNumber]: {
        stats: enemyStats.map((enemy) => ({ ...enemy })),
        debuffs: { ...(enemyDebuffs[turnNumber] ?? {}) },
      },
    }));
  };

  const handleDrawCards = (count: number) => {
    setGameState((prev) => {
      const next = { ...prev } as GameState;
      const drawCards: Card[] = [];
      let remaining = count;

      const shuffleDiscardToDraw = () => {
        if (next[LOCATION.DISCARD].length === 0) return;
        const shuffled = [...next[LOCATION.DISCARD]].sort(() => Math.random() - 0.5);
        next[LOCATION.DRAW] = [...next[LOCATION.DRAW], ...shuffled];
        next[LOCATION.DISCARD] = [];
        addActionLog(
          "Shuffled discard into draw pile",
          "combat",
          `Refilled draw pile before drawing ${remaining} card${remaining !== 1 ? "s" : ""}`,
        );
      };

      while (remaining > 0) {
        if (next[LOCATION.DRAW].length === 0) {
          shuffleDiscardToDraw();
          if (next[LOCATION.DRAW].length === 0) break;
        }

        const take = Math.min(remaining, next[LOCATION.DRAW].length);
        drawCards.push(...next[LOCATION.DRAW].slice(0, take));
        next[LOCATION.DRAW] = next[LOCATION.DRAW].slice(take);
        remaining -= take;
      }

      next[LOCATION.HAND] = [...next[LOCATION.HAND], ...drawCards];
      addActionLog(
        `Drew ${drawCards.length} card${drawCards.length !== 1 ? "s" : ""}`,
        "combat",
        drawCards.length < count
          ? `Only ${drawCards.length} drawn because draw pile and discard were empty`
          : `From draw pile`,
      );
      return next;
    });
  };

  const handleAddPotion = (potionIndex: number) => {
    const potion = potions[potionIndex];
    if (!potion) return;

    addActionLog(
      `Added potion ${potion.name} to hand`,
      "card",
      `Cost 0 potion added from pool`,
      undefined,
      undefined,
      [`Potion: ${potion.name}`],
    );
    setGameState((prev) => ({
      ...prev,
      [LOCATION.HAND]: [...prev[LOCATION.HAND], { ...potion, cost: { base: 0 } }],
    }));
  };

  const handleResetSimulation = () => {
    addActionLog(
      "Reset Simulation",
      "combat",
      "All changes reverted to initial state",
    );
    setGameState(initialGameState);
    setPlayerStats({
      hp: playerData.hp,
      maxHp: playerData.maxHp,
      energy: playerData.energy.base + (playerData.energy.turn1Bonus || 0),
      drawPerTurn: playerData.drawPerTurn,
      block: 0,
    });
    setEnemyStats(
      enemies.map((enemy) => ({ name: enemy.name, hp: enemy.hp, maxHp: enemy.maxHp || enemy.hp }))
    );
    setEnemyDebuffs({});
    setEnemyHistory({});
    setPlayerEffects({});
    setSelectedCard(null);
  };

  const handleSelectTurn = (turnNumber: number) => {
    saveEnemyTurnSnapshot(gameState.turn);
    addActionLog(
      `Selected Turn ${turnNumber}`,
      "combat",
      `Viewing turn ${turnNumber}`,
    );
    setGameState((prev) => ({ ...prev, turn: turnNumber }));

    const history = enemyHistory[turnNumber];
    if (history) {
      setEnemyStats(history.stats.map((enemy) => ({ ...enemy })));
      setEnemyDebuffs((prev) => ({ ...prev, [turnNumber]: { ...history.debuffs } }));
    }

    if (turnNumber === 1 && playerData.energy.turn1Bonus) {
      setPlayerStats((prev) => ({
        ...prev,
        energy: playerData.energy.base + playerData.energy.turn1Bonus,
      }));
      addActionLog(
        "Lantern triggered",
        "stat",
        `Turn 1 energy bonus applied`,
        `${playerData.energy.base} Energy`,
        `${playerData.energy.base + playerData.energy.turn1Bonus} Energy`,
        ["Lantern"],
      );
    }

    const relicBlockEffect = playerData.relicEffects?.find((effect: any) => effect.turn === turnNumber && effect.effect.toLowerCase().includes("block"));
    if (relicBlockEffect) {
      const blockValueMatch = relicBlockEffect.effect.match(/(\d+)/);
      const blockValue = blockValueMatch ? Number(blockValueMatch[1]) : 0;
      if (blockValue > 0) {
        setPlayerStats((prev) => ({ ...prev, block: prev.block + blockValue }));
        addActionLog(
          "Captain's Wheel triggered",
          "stat",
          `Gain ${blockValue} Block on turn ${turnNumber}`,
          `${playerStats.block} Block`,
          `${playerStats.block + blockValue} Block`,
          ["Captain's Wheel"],
        );
      }
    }
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
      block: "Block",
    };
    const previousValue = playerStats[field];
    addActionLog(
      `Player ${statNames[field]} changed`,
      "stat",
      `Turn ${gameState.turn}`,
      `${previousValue}`,
      `${value}`,
      [`Field: ${statNames[field]}`],
    );
    setPlayerStats((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeEnemyHp = (index: number, hp: number) => {
    const enemyName = enemyStats[index]?.name || `Enemy ${index + 1}`;
    const previousHp = enemyStats[index]?.hp || 0;
    const maxHp = enemyStats[index]?.maxHp || previousHp;
    const previousPercent = Math.round((previousHp / maxHp) * 100);
    const newPercent = Math.round((hp / maxHp) * 100);

    addActionLog(
      `${enemyName} HP changed`,
      "enemy",
      `Turn ${gameState.turn}`,
      `${previousHp} HP (${previousPercent}%)`,
      `${hp} HP (${newPercent}%)`,
      [`Max HP: ${maxHp}`, `Delta: ${hp - previousHp}`],
    );
    setLastUpdatedEnemyIndex(index);
    setEnemyStats((prev) =>
      prev.map((enemy, idx) => (idx === index ? { ...enemy, hp } : enemy)),
    );
    setEnemyHistory((prev) => ({
      ...prev,
      [gameState.turn]: {
        stats: (prev[gameState.turn]?.stats ?? enemyStats).map((enemy, idx) =>
          idx === index ? { ...enemy, hp } : enemy,
        ),
        debuffs: prev[gameState.turn]?.debuffs ?? enemyDebuffs[gameState.turn] ?? {},
      },
    }));
  };

  const handleApplyPlayerBuff = (buff: string) => {
    addActionLog(
      `Applied ${buff} to Player`,
      "stat",
      `Turn ${gameState.turn}`,
      undefined,
      undefined,
      [`Buff: ${buff}`, `Turn ${gameState.turn}`],
    );
    setPlayerEffects((prev) => {
      const currentTurnEffects = prev[gameState.turn] ?? { buffs: [], debuffs: [] };
      return {
        ...prev,
        [gameState.turn]: {
          ...currentTurnEffects,
          buffs: [...currentTurnEffects.buffs, buff],
        },
      };
    });
  };

  const handleApplyPlayerDebuff = (debuff: string) => {
    addActionLog(
      `Applied ${debuff} to Player`,
      "stat",
      `Turn ${gameState.turn}`,
      undefined,
      undefined,
      [`Debuff: ${debuff}`, `Turn ${gameState.turn}`],
    );
    setPlayerEffects((prev) => {
      const currentTurnEffects = prev[gameState.turn] ?? { buffs: [], debuffs: [] };
      return {
        ...prev,
        [gameState.turn]: {
          ...currentTurnEffects,
          debuffs: [...currentTurnEffects.debuffs, debuff],
        },
      };
    });
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
      undefined,
      undefined,
      [`Debuff: ${debuff}`, `Target: ${enemyName}`, `Turn ${turnNumber}`],
    );
    setEnemyDebuffs((prev) => {
      const existing = prev[turnNumber] ?? {};
      const enemyList = existing[enemyIndex] ?? [];
      const updated = {
        ...prev,
        [turnNumber]: {
          ...existing,
          [enemyIndex]: [...enemyList, debuff],
        },
      };
      setEnemyHistory((history) => ({
        ...history,
        [turnNumber]: {
          stats: history[turnNumber]?.stats ?? enemyStats,
          debuffs: updated[turnNumber],
        },
      }));
      return updated;
    });
  };

  const handleEnergyChange = (value: number) => {
    addActionLog(
      `Energy adjusted`,
      "stat",
      `Turn ${gameState.turn}`,
      `${playerStats.energy} Energy`,
      `${value} Energy`,
      [`Energy modified by ${value - playerStats.energy}`],
    );
    setPlayerStats((prev) => ({ ...prev, energy: value }));
  };

  const handleShortcutDamage = (enemyIndex: number, damage: number) => {
    const enemyName = enemyStats[enemyIndex]?.name || `Enemy ${enemyIndex + 1}`;
    const currentHp = enemyStats[enemyIndex].hp;
    const newHp = Math.max(0, currentHp - damage);
    const hpPercent = Math.round((newHp / (enemyStats[enemyIndex].maxHp || currentHp)) * 100);
    
    addActionLog(
      `Dealt ${damage} damage to ${enemyName}`,
      "combat",
      `Turn ${gameState.turn}`,
      `${currentHp} HP`,
      `${newHp} HP (${hpPercent}%)`,
      [`Damage Applied: ${damage}`, `Max HP: ${enemyStats[enemyIndex].maxHp || currentHp}`],
    );
    setLastUpdatedEnemyIndex(enemyIndex);
    setEnemyStats((prev) =>
      prev.map((enemy, idx) =>
        idx === enemyIndex
          ? { ...enemy, hp: newHp }
          : enemy,
      ),
    );
    setEnemyHistory((prev) => ({
      ...prev,
      [gameState.turn]: {
        stats: (prev[gameState.turn]?.stats ?? enemyStats).map((enemy, idx) =>
          idx === enemyIndex ? { ...enemy, hp: newHp } : enemy,
        ),
        debuffs: prev[gameState.turn]?.debuffs ?? enemyDebuffs[gameState.turn] ?? {},
      },
    }));
  };

  const handleShortcutDebuff = (enemyIndex: number, debuff: string) => {
    const enemyName = enemyStats[enemyIndex]?.name || `Enemy ${enemyIndex + 1}`;
    addActionLog(
      `Applied ${debuff} to ${enemyName}`,
      "enemy",
      `Turn ${gameState.turn}`,
      undefined,
      undefined,
      [`Debuff: ${debuff}`, `Target: ${enemyName}`],
    );
    setEnemyDebuffs((prev) => {
      const existing = prev[gameState.turn] ?? {};
      const enemyList = existing[enemyIndex] ?? [];
      const updated = {
        ...prev,
        [gameState.turn]: {
          ...existing,
          [enemyIndex]: [...enemyList, debuff],
        },
      };
      setEnemyHistory((history) => ({
        ...history,
        [gameState.turn]: {
          stats: history[gameState.turn]?.stats ?? enemyStats,
          debuffs: updated[gameState.turn],
        },
      }));
      return updated;
    });
  };

  const handleShortcutHeal = (amount: number) => {
    const currentHp = playerStats.hp;
    const newHp = Math.min(playerStats.maxHp, currentHp + amount);
    const hpPercent = Math.round((newHp / playerStats.maxHp) * 100);
    
    addActionLog(
      `Healed ${amount} HP`,
      "stat",
      `Turn ${gameState.turn}`,
      `${currentHp} HP (${Math.round((currentHp / playerStats.maxHp) * 100)}%)`,
      `${newHp} HP (${hpPercent}%)`,
      [`Healing: ${amount}`, `Max HP: ${playerStats.maxHp}`],
    );
    setPlayerStats((prev) => ({
      ...prev,
      hp: newHp,
    }));
  };

  const handleShortcutDamagePlayer = (amount: number) => {
    const currentHp = playerStats.hp;
    const newHp = Math.max(0, currentHp - amount);
    const hpPercent = Math.round((newHp / playerStats.maxHp) * 100);
    
    addActionLog(
      `Took ${amount} damage`,
      "stat",
      `Turn ${gameState.turn}`,
      `${currentHp} HP (${Math.round((currentHp / playerStats.maxHp) * 100)}%)`,
      `${newHp} HP (${hpPercent}%)`,
      [`Damage Taken: ${amount}`, `Max HP: ${playerStats.maxHp}`],
    );
    setPlayerStats((prev) => ({
      ...prev,
      hp: newHp,
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
        {/* RELICS DISPLAY */}
        <RelicsDisplay relics={playerData.relics} />

        {/* SECOND BLOCK : ENEMY TIMELINE */}
        <TimelineBlock
          enemies={enemyStats}
          turns={turns}
          currentTurn={gameState.turn}
          onSelectTurn={handleSelectTurn}
          enemyDebuffs={enemyDebuffs}
          onAddEnemyDebuff={handleAddEnemyDebuff}
          onChangeEnemyHp={handleChangeEnemyHp}
          highlightEnemyIndex={lastUpdatedEnemyIndex}
          energy={playerStats.energy}
        />

        {/* ENEMY DETAILS BLOCK */}
        <EnemyDetailsBlock
          enemies={enemyStats}
          debuffs={enemyDebuffs[gameState.turn] ?? {}}
          highlightIndex={lastUpdatedEnemyIndex}
          turn={turns[gameState.turn - 1]}
          onEnemyHpChange={handleChangeEnemyHp}
          currentTurn={gameState.turn}
          onSelectTurn={handleSelectTurn}
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="space-y-5">
            {/* FIRST BLOCK : PLAYER STATS */}
            <PlayerStatsBlock
              HP={playerStats.hp}
              MaxHP={playerStats.maxHp}
              Block={playerStats.block}
              Energy={playerStats.energy}
              DrawPT={playerStats.drawPerTurn}
              buffs={playerEffects[gameState.turn]?.buffs ?? []}
              debuffs={playerEffects[gameState.turn]?.debuffs ?? []}
              onChangeHP={(value) => handleChangePlayerStat("hp", value)}
              onChangeMaxHP={(value) => handleChangePlayerStat("maxHp", value)}
              onChangeBlock={(value) => handleChangePlayerStat("block", value)}
              onChangeEnergy={handleEnergyChange}
              onChangeDrawPT={(value) =>
                handleChangePlayerStat("drawPerTurn", value)
              }
            />

            {/* THIRD BLOCK : Player Hand */}
            <PlayerHandBlock
              cards={gameState[LOCATION.HAND]}
              weakMultiplier={playerData.modifiers.weakMultiplier ?? 0.75}
              vulnerableMultiplier={playerData.modifiers.vulnerableMultiplier ?? 1.5}
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
              weakMultiplier={playerData.modifiers.weakMultiplier ?? 0.75}
              vulnerableMultiplier={playerData.modifiers.vulnerableMultiplier ?? 1.5}
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
              potions={potions}
              onAddPotion={handleAddPotion}
              onDamageEnemy={handleShortcutDamage}
              onApplyDebuff={handleShortcutDebuff}
              onHealPlayer={handleShortcutHeal}
              onDamagePlayer={handleShortcutDamagePlayer}
              onApplyPlayerBuff={handleApplyPlayerBuff}
              onApplyPlayerDebuff={handleApplyPlayerDebuff}
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
              weakMultiplier={playerData.modifiers.weakMultiplier ?? 0.75}
              vulnerableMultiplier={playerData.modifiers.vulnerableMultiplier ?? 1.5}
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
              weakMultiplier={playerData.modifiers.weakMultiplier ?? 0.75}
              vulnerableMultiplier={playerData.modifiers.vulnerableMultiplier ?? 1.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
