import combatData from "../../../beta/data.json";
import type { Card, Enemy } from "./types";

export type CombatDataInput = typeof combatData;

export function getPlayerData() {
  return combatData.player;
}

export function getDeckCards(): Card[] {
  return combatData.deck.map(card => ({
    ...card,
    cost: card.cost || { base: 0 },
    isChanged: (card as any).isChanged ?? false,
  })) as Card[];
}

export function getEnemiesAndTurns() {
  const enemies = combatData.enemies.map((enemy) => ({
    name: enemy.name,
    hp: enemy.hp,
  })) as Enemy[];

  // Find max turn count
  const maxTurns = Math.max(
    ...combatData.enemies.map((enemy) => enemy.intents.length)
  );

  // Build turn data by combining actions from all enemies
  const turns = Array.from({ length: maxTurns }, (_, turnIndex) => {
    const actions = combatData.enemies.map((enemy) => {
      const intent = enemy.intents[turnIndex];

      if (!intent) {
        return { damage: 0, effects: [] };
      }

      // Extract damage and effects from the intent's actions
      let totalDamage = 0;
      const effects: Array<{ type: string; value?: number }> = [];

      intent.actions.forEach((action: Record<string, unknown>) => {
        if (action.type === "attack" && typeof action.value === "number") {
          totalDamage += action.value || 0;
        } else if (action.type === "debuff") {
          const effectType = (action.effect as string)?.toLowerCase() || "debuff";
          effects.push({
            type: effectType,
            value: action.value as number | undefined,
          });
        } else if (action.type === "buff") {
          const effectType = (action.effect as string)?.toLowerCase() || "buff";
          effects.push({
            type: effectType,
            value: action.value as number | undefined,
          });
        } else if (action.type === "status") {
          const effectType = (action.effect as string)?.toLowerCase().replace(/\s+/g, "") || "status";
          effects.push({
            type: effectType,
            value: action.value as number | undefined,
          });
        }
      });

      return { damage: totalDamage, effects };
    });

    return {
      turn: turnIndex + 1,
      actions,
    };
  });

  return { enemies, turns };
}
