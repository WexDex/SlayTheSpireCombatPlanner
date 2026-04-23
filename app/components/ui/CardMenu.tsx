"use client";

import { useEffect, useRef } from "react";
import { Card, LOCATION } from "../lib/types";

type Props = {
  isOpen: boolean;
  card: Card | null;
  location: LOCATION | null;
  index: number | null;

  moveCard: any;
  upgradeCard: any;
  downgradeCard: any;
  duplicateCard: any;
  deleteCard: any;
  addWound: any;

  onClose: () => void;
};

export default function CardMenu({
  isOpen,
  card,
  location,
  index,
  moveCard,
  upgradeCard,
  downgradeCard,
  duplicateCard,
  deleteCard,
  addWound,
  onClose,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔥 CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener("mousedown", handleClick);
    }

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  if (!isOpen || !card || location === null || index === null) return null;

  const btn = (label: string, fn: () => void) => (
    <button
      onClick={() => {
        fn();
        onClose();
      }}
      className="
      px-3 py-1.5
      text-xs font-medium
      rounded-full
      bg-white/10
      text-gray-200
      hover:bg-white/20
      hover:text-white
      transition
      border border-white/10
      active:scale-95
    "
    >
      {label}
    </button>
  );

  const separator = <div className="border-t border-white/10 my-1" />;

  const woundRow = (label: string, loc: LOCATION) => (
    <div className="flex justify-between items-center px-2 text-xs">
      <span>{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => {
              addWound(loc, n);
              onClose();
            }}
            className="px-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            x{n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={menuRef}
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 border-b border-white/10 shadow-2xl backdrop-blur-lg"
    >
      {/* gradient fade */}
      <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none" />

      {/* HEADER */}
      <div className="relative flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-base font-bold">
            {card.name}
            {card.isUpgraded && <span className="text-green-400 ml-1">+</span>}
          </div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
            {card.type}
          </div>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="relative flex flex-wrap items-center gap-2 px-4 py-3">
        {/* MOVE GROUP */}
        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl">
          {btn("Hand", () => moveCard(location, index, LOCATION.HAND))}
          {btn("Discard", () => moveCard(location, index, LOCATION.DISCARD))}
          {btn("Draw", () => moveCard(location, index, LOCATION.DRAW))}
          {btn("Exhaust", () => moveCard(location, index, LOCATION.EXHAUST))}
          {btn("Top", () => moveCard(location, index, LOCATION.DRAW, true))}
        </div>

        {/* MODIFY GROUP */}
        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl">
          {btn("Upgrade", () => upgradeCard(location, index))}
          {btn("Downgrade", () => downgradeCard(location, index))}
          {btn("Duplicate", () => duplicateCard(location, index))}
          {btn("Delete", () => deleteCard(location, index))}
        </div>

        {/* WOUND GROUP */}
        <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl">
          <span className="text-xs text-gray-400 px-1">Wound</span>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => {
                addWound(LOCATION.DISCARD, n);
                onClose();
              }}
              className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
            >
              +{n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
