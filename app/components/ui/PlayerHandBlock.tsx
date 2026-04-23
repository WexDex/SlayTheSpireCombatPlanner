import STSCard from "./Card";
import { Card as CardType, LOCATION } from "../lib/types";

interface PlayerHandBlockProps {
  cards?: CardType[];
  weakMultiplier?: number;
  vulnerableMultiplier?: number;
  moveCard: any;
  upgradeCard: any;
  downgradeCard: any;
  duplicateCard: any;
  deleteCard: any;
  addWound: any;
  onCardSelect: (card: CardType, location: LOCATION, index: number) => void;
  selectedCard: {card: CardType, location: LOCATION, index: number} | null;
  onDiscardHand: () => void;
  onDrawCards: (count: number) => void;
  onResetSimulation: () => void;
}

function getEffectiveValue(field?: { base?: number; upgraded?: number }, isUpgraded?: boolean): number {
  if (!field) return 0;
  return isUpgraded && field.upgraded !== undefined ? field.upgraded : field.base || 0;
}

export default function PlayerHandBlock({
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
  onDiscardHand,
  onDrawCards,
  onResetSimulation,
}: PlayerHandBlockProps) {
  const handCards = cards ?? [];

  const actions = {
    moveCard: moveCard,
    upgradeCard: upgradeCard,
    downgradeCard: downgradeCard,
    duplicateCard: duplicateCard,
    deleteCard: deleteCard,
    addWound: addWound,
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm z-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Hand ({handCards.length})
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => onDrawCards(5)}
            className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-500/20 text-sm font-semibold"
          >
            Draw 5
          </button>
          <button
            type="button"
            onClick={() => onDrawCards(1)}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm font-semibold"
          >
            Draw 1
          </button>
          <button
            type="button"
            onClick={onDiscardHand}
            className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 transition-all duration-200 shadow-lg shadow-yellow-500/20 text-sm font-semibold"
          >
            Discard Hand
          </button>
          <button
            type="button"
            onClick={onResetSimulation}
            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-500/20 text-sm font-semibold"
          >
            Reset Simulation
          </button>
        </div>
      </div>

      <div className="flex gap-6 pb-2 justify-center">
        {handCards.length === 0 ? (
          <div className="text-gray-400 text-sm italic">No cards in hand</div>
        ) : (
          handCards.map((card, index) => (
            <STSCard
              key={index}
              card={card}
              index={index}
              location={LOCATION.HAND}
              onCardSelect={onCardSelect}
              isSelected={selectedCard?.location === LOCATION.HAND && selectedCard?.index === index}
              {...actions}
            />
          ))
        )}
      </div>

      {handCards.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-400 mb-2">Hand Info</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Cards:</span>
              <span className="ml-2 text-cyan-300 font-semibold">
                {handCards.length}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Damage:</span>
              <span className="ml-2 text-red-300 font-semibold">
                {handCards.reduce(
                  (sum, card) => sum + getEffectiveValue(card.damage, card.isUpgraded),
                  0,
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Block:</span>
              <span className="ml-2 text-cyan-300 font-semibold">
                {handCards.reduce(
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
