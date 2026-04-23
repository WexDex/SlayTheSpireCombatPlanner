"use client";

type Props = {
  HP?: number;
  MaxHP?: number;
  Energy?: number;
  DrawPT?: number;
  onChangeHP?: (value: number) => void;
  onChangeMaxHP?: (value: number) => void;
  onChangeEnergy?: (value: number) => void;
  onChangeDrawPT?: (value: number) => void;
};

export default function PlayerStatsBlock({ HP = 5, MaxHP = 10, Energy = 3, DrawPT = 5, onChangeHP, onChangeMaxHP, onChangeEnergy, onChangeDrawPT }: Props) {
  const hpRatio = MaxHP > 0 ? HP / MaxHP : 0;

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-5 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-2">Health</div>
          <div className="relative h-8 bg-gray-800/50 rounded-lg overflow-hidden border border-red-900/30">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
              style={{ width: `${hpRatio * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
              {HP} / {MaxHP}
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col text-xs text-gray-400">
              Current HP
              <input
                type="number"
                min={0}
                value={HP}
                onChange={(e) => onChangeHP?.(Number(e.target.value))}
                className="mt-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="flex flex-col text-xs text-gray-400">
              Max HP
              <input
                type="number"
                min={1}
                value={MaxHP}
                onChange={(e) => onChangeMaxHP?.(Number(e.target.value))}
                className="mt-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>
        </div>
        <div className="flex-1 bg-blue-900/30 px-4 py-3 rounded-lg border border-blue-700/30">
          <div className="text-xs text-gray-400 mb-2">Energy</div>
          <input
            type="number"
            min={0}
            value={Energy}
            onChange={(e) => onChangeEnergy?.(Number(e.target.value))}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="flex-1 bg-purple-900/30 px-4 py-3 rounded-lg border border-purple-700/30">
          <div className="text-xs text-gray-400 mb-2">Draw Per Turn</div>
          <input
            type="number"
            min={0}
            value={DrawPT}
            onChange={(e) => onChangeDrawPT?.(Number(e.target.value))}
            className="w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-500 mb-2">Relic Effects</div>
        <div className="flex gap-2 flex-wrap">
          <div className="text-xs bg-amber-900/20 text-amber-300 px-2 py-1 rounded border border-amber-700/30">
            Turn 3 gain 18 Block
          </div>
          <div className="text-xs bg-amber-900/20 text-amber-300 px-2 py-1 rounded border border-amber-700/30">
            Turn 5 gain 1 Intangible
          </div>
          <div className="text-xs bg-amber-900/20 text-amber-300 px-2 py-1 rounded border border-amber-700/30">
            Vulnerable Enemies take 75% more damage instead of 50%
          </div>
          <div className="text-xs bg-amber-900/20 text-amber-300 px-2 py-1 rounded border border-amber-700/30">
            +1 Energy on first turn of each combat
          </div>
        </div>
      </div>
    </div>
  );
}
