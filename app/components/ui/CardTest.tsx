'use client';

import { Card, cardTypeStyles } from "../lib/types";


interface GameCardProps {
  card: Card;
  size?: 'small' | 'large';
}


export default function STSCard({ card, size = 'large' }: GameCardProps) {
  const styles = cardTypeStyles[card.type];
  const isSmall = size === 'small';

  const cardWidth = isSmall ? 'w-20' : 'w-36';
  const cardHeight = isSmall ? 'h-28' : 'h-52';
  const costSize = isSmall ? 'w-6 h-6' : 'w-10 h-10';
  const costText = isSmall ? 'text-xs' : 'text-lg';

  return (
    <div
      className={`${cardWidth} ${cardHeight} relative rounded-lg border-2 ${styles.border} ${styles.glow} shadow-xl overflow-hidden bg-gradient-to-b ${styles.gradient} backdrop-blur-sm`}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className={`absolute inset-1 rounded-md border ${styles.accentBorder} pointer-events-none opacity-40`} />

      <div className={`absolute -top-2 -left-2 ${costSize} ${styles.costBg} rounded-full border-2 border-slate-950 ${styles.costGlow} shadow-lg flex items-center justify-center z-10`}>
        <span className={`${costText} font-bold text-white drop-shadow-lg`}>
          {card.cost.base}
        </span>
      </div>

      <div className="relative h-full flex flex-col p-2">
        <div className={`${styles.nameBg} ${isSmall ? 'px-1.5 py-0.5 mt-3' : 'px-2 py-1 mt-6'} rounded border ${styles.accentBorder} backdrop-blur-sm`}>
          <div className={`${isSmall ? 'text-[10px]' : 'text-sm'} font-semibold text-white text-center leading-tight truncate`}>
            {card.name}
          </div>
        </div>

        {!isSmall && (
          <div className="flex-1 flex flex-col items-center justify-center gap-1 my-2">
            {card.damage !== undefined && (
              <div className="flex items-center gap-1">
                <span className={`text-lg font-bold ${styles.statColor}`}>{card.damage.base}</span>
              </div>
            )}
            {card.block !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-blue-300">{card.block.base}</span>
              </div>
            )}
          </div>
        )}

        {!isSmall && card.description && (
          <div className={`${styles.nameBg} px-2 py-1.5 rounded text-[10px] text-slate-300 text-center leading-tight border ${styles.accentBorder} backdrop-blur-sm`}>
            {card.description}
          </div>
        )}

        <div className={`mt-auto pt-1 ${isSmall ? 'text-[9px]' : 'text-xs'} ${styles.typeColor} text-center font-medium opacity-70`}>
          {card.type}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}