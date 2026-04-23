"use client";

import STSCard from "./Card";
import { Card, LOCATION } from "../lib/types";

type Props = {
  title: string;
  cards: Card[];
  location: LOCATION;
  moveCard: any;
  upgradeCard: any;
  downgradeCard: any;
  duplicateCard: any;
  deleteCard: any;
  addWound: any;
  onCardSelect: (card: Card, location: LOCATION, index: number) => void;
  selectedCard: { card: Card; location: LOCATION; index: number } | null;
};

export default function PileBlock({
  title,
  cards,
  location,
  moveCard,
  upgradeCard,
  downgradeCard,
  duplicateCard,
  deleteCard,
  addWound,
  onCardSelect,
  selectedCard,
}: Props) {
  const actions = {
    moveCard,
    upgradeCard,
    downgradeCard,
    duplicateCard,
    deleteCard,
    addWound,
  };

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm">
      <h2 className="text-lg font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">
        {title} ({cards.length})
      </h2>

      {cards.length === 0 ? (
        <div className="text-gray-400 text-sm italic">No cards in {title.toLowerCase()}</div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {cards.map((card, index) => (
            <STSCard
              key={index}
              card={card}
              index={index}
              location={location}
              size="small"
              onCardSelect={onCardSelect}
              isSelected={selectedCard?.location === location && selectedCard?.index === index}
              {...actions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
