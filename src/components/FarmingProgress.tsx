import { useEffect, useState } from "react";

export default function FarmingProgress({ farmEnd }: { farmEnd: number }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      const total = farmEnd - Date.now();
      const max = farmEnd - (farmEnd - 1000 * 60);
      const percent = Math.min(100, ((1000 * 60 - total) / (1000 * 60)) * 100);
      setPct(percent);
    }, 500);

    return () => clearInterval(tick);
  }, [farmEnd]);

  return (
    <div className="glass rounded-xl p-3">
      <div className="text-sm mb-1 text-cyan-200">Đang nuôi rồng...</div>
      <div className="w-full bg-slate-900/50 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
