export const ICONS = {
  damage: "⚔",
  strength: "💪",
  vulnerable: "💔",
  weak: "🟣",
  wound: "🩸",
  entangle: "⚠️",
  energy: "⚡",
  block: "🛡️",
  draw: "🃏",
};

type EffectType = "weak" | "vulnerable" | "wound" | "strength" | "entangle" | string;

export function getEffectDisplay(type: EffectType, value?: number) {
  switch (type) {
    case "weak":
      return { label: `${ICONS.weak}W${value ?? ""}`, color: "text-purple-400" , fullLabel: "Weak", icon: ICONS.weak};
    case "vulnerable":
      return { label: `${ICONS.vulnerable}V${value ?? ""}`, color: "text-red-500" , fullLabel: "Vulnerable", icon: ICONS.vulnerable};
    case "frail":
      return { label: `${ICONS.block}F${value ?? ""}`, color: "text-gray-400" , fullLabel: "Frail", icon: ICONS.block};
    case "damage":
      return { label: `${ICONS.damage}D${value ?? ""}`, color: "text-red-400" , fullLabel: "Damage", icon: ICONS.damage};
    case "block":
      return { label: `${ICONS.block}B${value ?? ""}`, color: "text-blue-400" , fullLabel: "Block", icon: ICONS.block};
    case "wound":
      return { label: `${ICONS.wound}W${value ?? ""}`, color: "text-red-600" , fullLabel: "Wound", icon: ICONS.wound  };
    case "strength":
      return { label: `${ICONS.strength}${value ?? ""}`, color: "text-green-400" , fullLabel: "Strength", icon: ICONS.strength};
    case "entangle":
      return { label: `${ICONS.entangle}Entangle`, color: "text-yellow-400" , fullLabel: "Entangle", icon: ICONS.entangle};
    case "takedamage":
      return { label: `${ICONS.wound} Take ${value ?? ""} DMG`, color: "text-red-500" , fullLabel: `Take ${value ?? ""} Damage`, icon: ICONS.wound};
    case "energygain":
      return { label: `${ICONS.energy} Gain ${value ?? ""} Energy`, color: "text-yellow-400" , fullLabel: `Gain ${value ?? ""} Energy`, icon: ICONS.energy};
    case "draw":
      return { label: `${ICONS.draw} Draw ${value ?? ""} Card${value === 1 ? "" : "s"}`, color: "text-indigo-500" , fullLabel: `Draw ${value ?? ""} Card${value === 1 ? "" : "s"}`, icon: ICONS.draw};
    default:
      return { label: `?${value ?? ""}`, color: "text-gray-400" , fullLabel: "Unknown", icon: "?"};
  }
}