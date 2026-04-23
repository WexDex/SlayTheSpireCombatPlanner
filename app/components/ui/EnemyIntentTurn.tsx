"use client";

import { getEffectDisplay, ICONS } from "../lib/icons";
import type { Turn } from "../lib/types";

type Props = {
    id: number;
    name: String;
    turn?: Turn;
}

export default function EnemyIntentTurn({ id, name, turn }: Props) {
    const action = turn?.actions?.[id];

    if (!action) {
        return (
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                <div className="font-semibold mb-2 text-gray-300">{name}</div>
                <div className="text-sm text-gray-400">No action available</div>
            </div>
        );
    }

    return (
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
            <div className="font-semibold mb-2 text-gray-300 text-lg">{name}</div>
            <div className="space-y-2">
                {action.damage > 0 && (
                    <div className="text-red-400 font-bold text-sm">{ICONS.damage} {action.damage} Damage</div>
                )}
                {action.effects.map((effect, index) => (
                    <div key={index} className={getEffectDisplay(effect.type, effect.value).color + " font-bold text-sm"}>
                        {getEffectDisplay(effect.type, effect.value).icon} {effect.value} {getEffectDisplay(effect.type, effect.value).fullLabel}
                    </div>
                ))}
            </div>
        </div>
    );
}