
type ValueRange = {
  base: number;
  upgraded?: number;
};


export enum LOCATION {
  HAND = "hand",
  DRAW = "draw",
  DISCARD = "discard",
  EXHAUST = "exhaust",
}

type Position = {
  x: number;
  y: number;
};

type CardType = "Attack" | "Skill" | "Power" | "Curse" | "Status";

type CardRarity = 'Common' | 'Uncommon' | 'Rare';


type EffectMap = {
  [key: string]: ValueRange;
};
type Card = {
  // Core identity
  id: number;
  name: string;
  type: CardType;
  rarity?: CardRarity;

  // State
  isUpgraded?: boolean;
  isChanged?: boolean;

  // Core cost
  cost: ValueRange;

  // Combat stats
  damage?: ValueRange;
  block?: ValueRange;
  takeDamage?: ValueRange;
  vulnerable?: ValueRange;

  // Utility stats
  draw?: ValueRange;
  energyGain?: ValueRange;
  blockOnExhaust?: ValueRange;

  // Effects system
  apply?: EffectMap;

  // Text
  description?: string; // renamed from desc for consistency
};

type Effect = {
  type: string;
  value?: number;
};

type Action = {
  damage: number;
  effects: Effect[];
};

type Turn = {
  turn: number;
  actions: Action[];
};

type Enemy = {
  name: string;
  hp: number;
};



export const cardTypeStyles = {
  Attack: {
    gradient: 'from-red-950 via-red-900/90 to-red-950',
    border: 'border-red-600/60',
    glow: 'shadow-red-900/50',
    accentBorder: 'border-red-500/80',
    costBg: 'bg-gradient-to-br from-red-600 to-red-800',
    costGlow: 'shadow-red-500/60',
    nameBg: 'bg-red-950/80',
    statColor: 'text-red-300',
    typeColor: 'text-red-400',
  },
  Skill: {
    gradient: 'from-emerald-950 via-emerald-900/90 to-emerald-950',
    border: 'border-emerald-600/60',
    glow: 'shadow-emerald-900/50',
    accentBorder: 'border-emerald-500/80',
    costBg: 'bg-gradient-to-br from-emerald-600 to-emerald-800',
    costGlow: 'shadow-emerald-500/60',
    nameBg: 'bg-emerald-950/80',
    statColor: 'text-emerald-300',
    typeColor: 'text-emerald-400',
  },
  Power: {
    gradient: 'from-violet-950 via-violet-900/90 to-violet-950',
    border: 'border-violet-600/60',
    glow: 'shadow-violet-900/50',
    accentBorder: 'border-violet-500/80',
    costBg: 'bg-gradient-to-br from-violet-600 to-violet-800',
    costGlow: 'shadow-violet-500/60',
    nameBg: 'bg-violet-950/80',
    statColor: 'text-violet-300',
    typeColor: 'text-violet-400',
  },
  Curse: {
    gradient: 'from-slate-950 via-purple-950/90 to-slate-950',
    border: 'border-purple-900/80',
    glow: 'shadow-purple-950/70',
    accentBorder: 'border-purple-700/70',
    costBg: 'bg-gradient-to-br from-purple-800 to-purple-950',
    costGlow: 'shadow-purple-700/60',
    nameBg: 'bg-purple-950/80',
    statColor: 'text-purple-300',
    typeColor: 'text-purple-400',
  },
  Status: {
    gradient: 'from-slate-900 via-slate-800/90 to-slate-900',
    border: 'border-slate-600/60',
    glow: 'shadow-slate-900/50',
    accentBorder: 'border-slate-500/70',
    costBg: 'bg-gradient-to-br from-slate-600 to-slate-800',
    costGlow: 'shadow-slate-500/60',
    nameBg: 'bg-slate-900/80',
    statColor: 'text-slate-300',
    typeColor: 'text-slate-400',
  },
};

export type { ValueRange, CardType, CardRarity, EffectMap, Card, Effect, Action, Turn, Enemy, Position };