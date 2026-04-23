"use client";

import { LOCATION, type Card as CardType } from "../lib/types";
import STSCard from "./Card";

type Props = {
  cards?: CardType[];
  weakMultiplier?: number;
  vulnerableMultiplier?: number;
  // 🔥 actions (required now)
  moveCard: any;
  upgradeCard: any;
  downgradeCard: any;
  duplicateCard: any;
  deleteCard: any;
  addWound: any;
  onCardSelect: (card: CardType, location: LOCATION, index: number) => void;
  selectedCard: {card: CardType, location: LOCATION, index: number} | null;
};

export default function DrawPileBlock({
  cards,
  weakMultiplier = 0.75,
  vulnerableMultiplier = 1.75,
  moveCard,
  upgradeCard,
  downgradeCard,
  duplicateCard,
  deleteCard,
  addWound,
  onCardSelect,
  selectedCard,
}: Props) {
  const drawPileCards = cards ?? [];

  const actions = {
    moveCard,
    upgradeCard,
    downgradeCard,
    duplicateCard,
    deleteCard,
    addWound,
  };

  function getEffectiveValue(field?: { base?: number; upgraded?: number }, isUpgraded?: boolean): number {
    if (!field) return 0;
    return isUpgraded && field.upgraded !== undefined ? field.upgraded : field.base || 0;
  }

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm z-1">
      <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
        Draw Pile ({drawPileCards.length})
      </h2>

      <div className="flex flex-wrap gap-6 overflow-x-auto pb-2 p-4">
        {drawPileCards.length === 0 ? (
          <div className="text-gray-400 text-sm italic">
            No cards in draw pile
          </div>
        ) : (
          drawPileCards.map((card, index) => (
            <STSCard
              key={index}
              card={card}
              index={index}
              location={LOCATION.DRAW}
              onCardSelect={onCardSelect}
              isSelected={selectedCard?.location === LOCATION.DRAW && selectedCard?.index === index}
              {...actions}
            />
          ))
        )}
      </div>

      {drawPileCards.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 mb-2">Draw Pile Info</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Cards:</span>
              <span className="ml-2 text-yellow-300 font-semibold">
                {drawPileCards.length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Total Damage:</span>
              <span className="ml-2 text-red-300 font-semibold">
                {drawPileCards.reduce(
                  (sum, card) => sum + getEffectiveValue(card.damage, card.isUpgraded),
                  0,
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500\">Total Block:</span>
              <span className="ml-2 text-cyan-300 font-semibold">
                {drawPileCards.reduce(
                  (sum, card) => sum + getEffectiveValue(card.block, card.isUpgraded),
                  0,
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
