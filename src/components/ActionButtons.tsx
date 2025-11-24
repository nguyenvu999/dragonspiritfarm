interface Props {
  onStart: () => void;
  onUpgrade: () => void;
  level: number;
  gems: number;
}

export default function ActionButtons({ onStart, onUpgrade, level }: Props) {
  const cost = Math.round(100 * Math.pow(1.45, level - 1));

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onStart}
        className="py-3 rounded-xl bg-cyan-500 font-semibold text-black shadow-lg hover:brightness-110"
      >
        Bắt đầu
      </button>

      <button
        onClick={onUpgrade}
        className="py-3 rounded-xl bg-purple-500 font-semibold text-white shadow-lg hover:brightness-110"
      >
        Nâng cấp ({cost})
      </button>
    </div>
  );
}
