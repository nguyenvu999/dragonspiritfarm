"use client";

import { useState, useEffect } from "react";
import { sync, collect } from "@/lib/api";
import DragonDisplay from "./DragonDisplay";
import StatsBar from "./StatsBar";
import ActionButtons from "./ActionButtons";
import FarmingProgress from "./FarmingProgress";
import BottomMenu from "./BottomMenu";
import Toast from "./Toast";

interface Props {
  user: any;
  initData: string;
}

export default function Game({ user, initData }: Props) {
  const [gems, setGems] = useState(0);
  const [rate, setRate] = useState(1);
  const [level, setLevel] = useState(1);

  const [farming, setFarming] = useState(false);
  const [farmEnd, setFarmEnd] = useState(0);

  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      const res = await sync(initData);
      if (res?.player) {
        setGems(res.player.gems);
        setLevel(res.player.level);
      }
    })();
  }, [initData]);

  // Tick sản xuất gems
  useEffect(() => {
    const loop = setInterval(() => {
      if (farming && farmEnd > Date.now()) {
        setGems((g) => g + rate);
      }
      if (farming && farmEnd <= Date.now()) {
        setFarming(false);
        setToast("Phiên nuôi rồng đã hoàn tất!");
      }
    }, 1000);

    return () => clearInterval(loop);
  }, [farming, farmEnd, rate]);

  // Gửi gems lên server nhẹ nhàng
  useEffect(() => {
    const t = setTimeout(async () => {
      await collect(initData, gems);
    }, 1500);

    return () => clearTimeout(t);
  }, [gems]);

  function startFarm() {
    const duration = 30 + level * 10;
    setFarmEnd(Date.now() + duration * 1000);
    setFarming(true);
    setToast("Bắt đầu nuôi rồng!");
  }

  function upgrade() {
    const cost = Math.round(100 * Math.pow(1.45, level - 1));
    if (gems < cost) {
      setToast("Không đủ linh thạch!");
      return;
    }
    setGems((g) => g - cost);
    setLevel((l) => l + 1);
    setRate((r) => Math.round((r * 1.22 + 0.01) * 100) / 100);
    setToast("Nâng cấp thành công!");
  }

  return (
    <div className="space-y-4">
      <DragonDisplay />

      <StatsBar gems={gems} rate={rate} level={level} />

      <ActionButtons onStart={startFarm} onUpgrade={upgrade} level={level} gems={gems} />

      {farming && (
        <FarmingProgress farmEnd={farmEnd} />
      )}

      <BottomMenu />

      <Toast text={toast} onClose={() => setToast("")} />
    </div>
  );
}
