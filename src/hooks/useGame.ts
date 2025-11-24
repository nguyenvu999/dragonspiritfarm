"use client";

import { useEffect, useState, useRef } from "react";
import { sync, collect } from "@/lib/api";

export interface GameState {
  gems: number;
  level: number;
  rate: number;
  farming: boolean;
  farmEnd: number;
  offlineBonus: number;
  lastTick: number;
  activeBuff: {
    mul: number;
    end: number;
  };
}

const KEY = "dragon_spirit_state_v3";

export function useGame(initData: string) {
  const [state, setState] = useState<GameState>({
    gems: 0,
    level: 1,
    rate: 1,
    farming: false,
    farmEnd: 0,
    offlineBonus: 0,
    lastTick: Date.now(),
    activeBuff: { mul: 1, end: 0 },
  });

  const [toast, setToast] = useState("");
  const [particles, setParticles] = useState<any[]>([]);

  const timeoutRef = useRef<any>(null);

  // -----------------------------
  // LOAD SAVE
  // -----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setState((s) => ({ ...s, ...JSON.parse(raw) }));
      }
    } catch {}
  }, []);

  // -----------------------------
  // SAVE STATE
  // -----------------------------
  function save(newState: GameState) {
    localStorage.setItem(KEY, JSON.stringify(newState));
  }

  // -----------------------------
  // SYNC FROM SERVER (first load)
  // -----------------------------
  useEffect(() => {
    (async () => {
      const res = await sync(initData);

      if (res?.player) {
        setState((s) => {
          const newState = {
            ...s,
            gems: res.player.gems ?? s.gems,
            level: res.player.level ?? s.level,
          };
          save(newState);
          return newState;
        });
      }
    })();
  }, [initData]);

  // -----------------------------
  // AUTO-SYNC
  // -----------------------------
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await collect(initData, state.gems);
    }, 1200);

    return () => clearTimeout(timeoutRef.current);
  }, [state.gems]);

  // -----------------------------
  // GAME LOOP (tick)
  // -----------------------------
  useEffect(() => {
    const loop = setInterval(() => {
      setState((s) => {
        let newState = { ...s };

        const now = Date.now();
        const dt = Math.floor((now - s.lastTick) / 1000);
        if (dt <= 0) {
          newState.lastTick = now;
          return newState;
        }

        // FARM TICK
        if (s.farming && s.farmEnd > now) {
          const produce = s.rate * dt;
          newState.gems += produce;
          spawnParticles();
        }

        // FARM DONE
        if (s.farming && s.farmEnd <= now) {
          newState.farming = false;
          setToast("Phiên nuôi rồng hoàn thành!");
        }

        newState.lastTick = now;

        save(newState);
        return newState;
      });
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  // -----------------------------
  // OFFLINE REWARD
  // -----------------------------
  useEffect(() => {
    const onFocus = () => {
      setState((s) => {
        const now = Date.now();
        const down = Math.floor((now - s.lastTick) / 1000);

        if (down > 10 && !s.farming) {
          const offline = Math.min(3600, Math.floor(down / 2) * s.rate);
          if (offline > 0) {
            const newState = {
              ...s,
              gems: s.gems + offline,
              offlineBonus: s.offlineBonus + offline,
              lastTick: now,
            };
            setToast(`+${Math.round(offline)} linh thạch (offline reward)`);
            save(newState);
            return newState;
          }
        }

        return { ...s, lastTick: now };
      });
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // -----------------------------
  // PARTICLE EFFECT
  // -----------------------------
  function spawnParticles() {
    setParticles((p) => [
      ...p,
      {
        id: Math.random(),
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20,
      },
    ]);

    setTimeout(() => {
      setParticles((p) => p.slice(1));
    }, 600);
  }

  // -----------------------------
  // ACTION: START FARM
  // -----------------------------
  function startFarm() {
    setState((s) => {
      const duration = 30 + s.level * 10;
      const newState = {
        ...s,
        farming: true,
        farmEnd: Date.now() + duration * 1000,
      };
      setToast("Bắt đầu nuôi rồng!");
      save(newState);
      return newState;
    });
  }

  // -----------------------------
  // ACTION: UPGRADE
  // -----------------------------
  function upgrade() {
    setState((s) => {
      const cost = Math.round(100 * Math.pow(1.45, s.level - 1));
      if (s.gems < cost) {
        setToast("Không đủ linh thạch!");
        return s;
      }

      const newState = {
        ...s,
        gems: s.gems - cost,
        level: s.level + 1,
        rate: Math.round((s.rate * 1.22 + 0.01) * 100) / 100,
      };

      setToast("Nâng cấp thành công!");
      save(newState);
      return newState;
    });
  }

  // -----------------------------
  // ACTION: BUFF
  // -----------------------------
  function applyBuff(multiplier: number, sec: number) {
    setState((s) => {
      const newState = {
        ...s,
        rate: s.rate * multiplier,
        activeBuff: { mul: multiplier, end: Date.now() + sec * 1000 },
      };
      save(newState);

      // remove buff later
      setTimeout(() => {
        setState((x) => {
          const normal = {
            ...x,
            rate: Math.round((x.rate / multiplier) * 100) / 100,
            activeBuff: { mul: 1, end: 0 },
          };
          save(normal);
          return normal;
        });
        setToast("Buff kết thúc!");
      }, sec * 1000);

      setToast(`Buff x${multiplier} trong ${sec}s`);
      return newState;
    });
  }

  // -----------------------------
  // AD MOCK
  // -----------------------------
  function watchAd(sec = 6) {
    return new Promise<boolean>((resolve) => {
      setToast(`Xem quảng cáo ${sec}s...`);
      setTimeout(() => {
        setToast("Xem xong!");
        resolve(true);
      }, sec * 1000);
    });
  }

  return {
    state,
    setState,
    toast,
    setToast,
    particles,
    startFarm,
    upgrade,
    applyBuff,
    watchAd,
  };
}
