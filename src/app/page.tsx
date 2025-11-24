"use client";

import { useTelegram } from "@/hooks/useTelegram";
import Game from "@/components/Game";

export default function Home() {
  const { user, initData } = useTelegram();

  if (!user || !initData) {
    return <div className="text-center text-gray-300">Đang tải...</div>;
  }

  return <Game user={user} initData={initData} />;
}
