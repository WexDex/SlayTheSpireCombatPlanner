"use client";

type Props = {
  HP?: number;
  MaxHP?: number;
  Block?: number;
  Energy?: number;
  MaxEnergy?: number;
  DrawPT?: number;
  buffs?: string[];
  debuffs?: string[];
  onChangeHP?: (value: number) => void;
  onChangeMaxHP?: (value: number) => void;
  onChangeBlock?: (value: number) => void;
  onChangeEnergy?: (value: number) => void;
  onChangeDrawPT?: (value: number) => void;
};

export default function PlayerStatsBlock({ HP = 5, MaxHP = 10, Block = 0, Energy = 3, MaxEnergy = 3, DrawPT = 5, buffs = [], debuffs = [], onChangeHP, onChangeMaxHP, onChangeBlock, onChangeEnergy, onChangeDrawPT }: Props) {
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
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
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
            <label className="flex flex-col text-xs text-gray-400">
              Block
              <input
                type="number"
                min={0}
                value={Block}
                onChange={(e) => onChangeBlock?.(Number(e.target.value))}
                className="mt-1 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>
        </div>
        <div className="flex-1 bg-blue-900/30 px-4 py-3 rounded-lg border border-blue-700/30">
          <div className="text-xs text-gray-400 mb-2">Energy ({Energy}/{MaxEnergy})</div>
          <input
            type="number"
            min={0}
            max={MaxEnergy}
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="bg-gray-900/50 rounded-lg border border-green-700/30 p-3">
          <div className="text-xs text-gray-400 mb-2">Buffs</div>
          <div className="flex flex-wrap gap-2">
            {buffs.length > 0 ? buffs.map((buff, index) => (
              <span key={index} className="text-xs bg-emerald-700/20 text-emerald-200 px-2 py-1 rounded-full border border-emerald-600/30">
                {buff}
              </span>
            )) : (
              <span className="text-xs text-gray-500">No active buffs</span>
            )}
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-lg border border-rose-700/30 p-3">
          <div className="text-xs text-gray-400 mb-2">Debuffs</div>
          <div className="flex flex-wrap gap-2">
            {debuffs.length > 0 ? debuffs.map((debuff, index) => (
              <span key={index} className="text-xs bg-rose-700/20 text-rose-200 px-2 py-1 rounded-full border border-rose-600/30">
                {debuff}
              </span>
            )) : (
              <span className="text-xs text-gray-500">No active debuffs</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
