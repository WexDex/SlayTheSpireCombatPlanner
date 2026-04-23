import { Card, LOCATION } from "./types";

export type GameState = {
  turn: number;
  [LOCATION.HAND]: Card[];
  [LOCATION.DRAW]: Card[];
  [LOCATION.DISCARD]: Card[];
  [LOCATION.EXHAUST]: Card[];
};

// 🔥 helper to clone state safely
function cloneState(state: GameState): GameState {
  return {
    turn: state.turn,
    [LOCATION.HAND]: [...state[LOCATION.HAND]],
    [LOCATION.DRAW]: [...state[LOCATION.DRAW]],
    [LOCATION.DISCARD]: [...state[LOCATION.DISCARD]],
    [LOCATION.EXHAUST]: [...state[LOCATION.EXHAUST]],
  };
}

// 🔥 wound template
const woundCard: Card = {
  name: "Wound",
  type: "Status",
  description: "Unplayable.",
  id: 0,
  cost: {
    base: 0,
    upgraded: 0,
  },
  isChanged: true,
};

// ------------------------
// ACTIONS
// ------------------------

export function moveCard(
  state: GameState,
  from: LOCATION,
  index: number,
  to: LOCATION,
  top = false
): GameState {
  const next = cloneState(state);

  const card = next[from][index];
  if (!card) return state;

  next[from].splice(index, 1);

  if (to === LOCATION.DRAW && top) {
    next[to].unshift(card);
  } else {
    next[to].push(card);
  }

  return next;
}

export function upgradeCard(
  state: GameState,
  loc: LOCATION,
  index: number
): GameState {
  const next = cloneState(state);

  const card = next[loc][index];
  if (!card) return state;

  next[loc][index] = {
    ...card,
    isUpgraded: true,
    isChanged: true,
  };

  return next;
}

export function downgradeCard(
  state: GameState,
  loc: LOCATION,
  index: number
): GameState {
  const next = cloneState(state);

  const card = next[loc][index];
  if (!card) return state;

  next[loc][index] = {
    ...card,
    isUpgraded: false,
    isChanged: true,
  };

  return next;
}

export function duplicateCard(
  state: GameState,
  loc: LOCATION,
  index: number
): GameState {
  const next = cloneState(state);

  const card = next[loc][index];
  if (!card) return state;

  next[loc].splice(index, 0, { ...card, isChanged: true });

  return next;
}

export function deleteCard(
  state: GameState,
  loc: LOCATION,
  index: number
): GameState {
  const next = cloneState(state);

  next[loc].splice(index, 1);

  return next;
}

export function addWound(
  state: GameState,
  loc: LOCATION,
  amount: number
): GameState {
  const next = cloneState(state);

  for (let i = 0; i < amount; i++) {
    next[loc].push({ ...woundCard });
  }

  return next;
}