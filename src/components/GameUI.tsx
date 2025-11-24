// components/GameUI.tsx
import { useState } from "react";

export default function GameUI() {
  const [level, setLevel] = useState(10);
  const [cost, setCost] = useState(5000);
  const [gems, setGems] = useState(1230);
  const [speed, setSpeed] = useState(8.8);
  const [timeRemaining, setTimeRemaining] = useState("11:03:53");

  const handleUpgrade = () => {
    if (gems >= cost) {
      setGems(gems - cost);
      setLevel(level + 1);
      setCost(cost * 1.5); // Tăng chi phí nâng cấp
      setSpeed(speed * 1.2); // Tăng tốc độ sau khi nâng cấp
    } else {
      alert("Không đủ gem!");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-gradient-to-br from-[#00b4d8] to-[#1e3c72] text-white rounded-lg shadow-lg p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full mr-3"
            src="https://via.placeholder.com/40"
            alt="Avatar"
          />
          <span className="font-bold text-lg">VuVu</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{gems} 🪙</span>
          <span>{254526} 💎</span>
        </div>
      </div>

      {/* Level Info */}
      <div className="bg-gray-800 p-4 rounded-lg mb-5">
        <h3 className="text-center text-2xl mb-2">Cấp độ thợ đào</h3>
        <div className="text-center mb-2">
          <span className="font-semibold">Lv. {level}</span>
        </div>
        <div className="text-center mb-3">
          <span className="font-medium">Chi phí nâng cấp tiếp theo</span>
          <p>{cost} 💎</p>
        </div>
        <p className="text-center text-sm">(Nâng cấp để tăng tốc độ đào vàng)</p>
      </div>

      {/* Speed & Timer */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p>Tốc độ đào: <span className="font-semibold">{speed} vàng/giây</span></p>
        </div>
        <div>
          <p>{timeRemaining}</p>
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="flex justify-center">
        <button
          onClick={handleUpgrade}
          className="bg-[#ffcc33] text-black py-2 px-4 rounded-full text-lg font-semibold"
        >
          Nâng cấp ({cost} 💎)
        </button>
      </div>

      {/* Menu Buttons */}
      <div className="flex justify-between mt-5">
        <button className="bg-[#ff5e5b] py-2 px-3 rounded-full">Khai Thác</button>
        <button className="bg-[#00b4d8] py-2 px-3 rounded-full">Nhiệm Vụ</button>
        <button className="bg-[#38b000] py-2 px-3 rounded-full">Mời Bạn Bè</button>
      </div>
    </div>
  );
}
