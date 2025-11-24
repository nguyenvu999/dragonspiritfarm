"use client";

import { useEffect, useState } from "react";

interface TgUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<TgUser | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    let tg = (window as any)?.Telegram?.WebApp;

    // ============================
    // 1. Đang chạy trong Telegram Mini App
    // ============================
    if (tg?.initDataUnsafe?.user) {
      console.log("🔵 Đang chạy trong Telegram — dùng initData thật");

      setIsTelegram(true);
      setUser(tg.initDataUnsafe.user);
      setInitData(tg.initData || tg.initDataUnsafe);

      // Telegram yêu cầu expand
      tg.expand?.();

      return;
    }

    // ============================
    // 2. Không có Telegram → chạy web / PC
    // ============================
    console.warn("⚠ Không có Telegram: đang dùng FAKE MODE để test UI");

    const fakeUser = {
      id: 999999,
      username: "test_user",
      first_name: "Tester",
      last_name: "Dev",
      language_code: "vi",
    };

    setUser(fakeUser);
    setInitData("FAKE_INIT_DATA_FOR_LOCAL_TESTING");
    setIsTelegram(false);
  }, []);

  return { user, initData, isTelegram };
}
