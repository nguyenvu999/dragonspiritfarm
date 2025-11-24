interface Props {
  gems: number;
  rate: number;
  level: number;
}

export default function StatsBar({ gems, rate, level }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="glass rounded-xl p-3 text-center">
        <div className="text-2xl font-bold neon-text">{gems}</div>
        <div className="text-xs opacity-70">Linh thạch</div>
      </div>

      <div className="glass rounded-xl p-3 text-center">
        <div className="text-xl font-bold text-cyan-300">{rate}/s</div>
        <div className="text-xs opacity-70">Tốc độ</div>
      </div>

      <div className="glass rounded-xl p-3 text-center">
        <div className="text-xl font-bold text-purple-300">Lv {level}</div>
        <div className="text-xs opacity-70">Cấp độ</div>
      </div>
    </div>
  );
}
