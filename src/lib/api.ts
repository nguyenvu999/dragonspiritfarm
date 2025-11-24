export const API_BASE = "https://dragon-spirit-app.onrender.com";

export async function sync(initData: string) {
  const res = await fetch(`${API_BASE}/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData }),
  });

  return res.json();
}

export async function collect(initData: string, gems: number) {
  const res = await fetch(`${API_BASE}/collect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData, gems }),
  });

  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${API_BASE}/leaderboard`);
  return res.json();
}
