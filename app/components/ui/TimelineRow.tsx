import { ICONS, getEffectDisplay } from "../lib/icons";
import type { Turn } from "../lib/types";

type Props = {
  turn: Turn;
  currentTurn: number;
  onSelectTurn?: (turn: number) => void;
};

export default function TimelineRow({ turn, currentTurn, onSelectTurn }: Props) {
  const totalDmg = turn.actions.reduce((sum, action) => sum + action.damage, 0);
    const selectTurn = (turnNum: number) => () => {
        onSelectTurn?.(turnNum);
    };
  return (
    <tr onClick={selectTurn(turn.turn)} className={`cursor-pointer border-b border-gray-800 transition-colors hover:bg-gray-800/30 ${turn.turn === currentTurn ? "bg-blue-900/20" : ""}`}>
      <td className="p-2 font-bold text-cyan-300">{turn.turn}</td>
      {turn.actions.map((action, index) => (
        <td key={index} className="p-2 text-center">
          <div className="space-y-1">
            {action.damage > 0 && (
              <div className="text-red-400 font-bold">
                {ICONS.damage} {action.damage} <span className="text-[9px] text-red-300/70">({Math.floor(action.damage*1.5)})</span>
              </div>
            )}
            <div className="flex gap-1 justify-center flex-wrap text-xs">
              {action.effects.map((effect, effIndex) => {
                const { label, color } = getEffectDisplay(effect.type, effect.value);
                return (
                  <span key={effIndex} className={color}>
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </td>
      ))}
      <td className="p-2 text-center font-bold text-yellow-300">{totalDmg} <span className="text-red-500 text-xs">({Math.floor(totalDmg*1.5)})</span></td>
    </tr>
  );
}