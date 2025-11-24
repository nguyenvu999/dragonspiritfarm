export default function MenuGrid({ openQuest, openBuff, openShop, openRank }: any) {
  const items = [
    { label: "🎯 Nhiệm Vụ", onClick: openQuest },
    { label: "✨ Buff", onClick: openBuff },
    { label: "🏪 Cửa Hàng", onClick: openShop },
    { label: "🏆 Xếp Hạng", onClick: openRank },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {items.map((i) => (
        <button
          key={i.label}
          onClick={i.onClick}
          className="py-3 rounded-xl text-xs text-cyan-300 bg-[#111827]
                     border border-cyan-500/30
                     shadow-[0_0_8px_rgba(0,255,255,0.2)]"
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
