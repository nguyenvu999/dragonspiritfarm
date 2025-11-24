import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const DragonApp: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // Lưu thông tin người chơi
  const [isLoading, setIsLoading] = useState(true); // Cờ để hiển thị trạng thái loading

  const [level, setLevel] = useState(1);
  const [gems, setGems] = useState(0);
  const [rate, setRate] = useState(1);
  const [cost, setCost] = useState(100);
  const [farming, setFarming] = useState(false);
  const [farmEndTime, setFarmEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState('00:00:00');
  const [isFarmStarted, setIsFarmStarted] = useState(false);

  // Lấy dữ liệu initData từ Telegram WebApp
  useEffect(() => {
    const fetchUserData = async () => {
      const initData = window.Telegram?.WebApp?.initData;
      if (initData) {
        try {
          const response = await axios.post('/fetchUserData', { initData });
          if (response.data.success) {
            setUserData(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setIsLoading(false); // Khi tải xong, thay đổi trạng thái loading
    };

    fetchUserData();
  }, []);

  const startFarming = async () => {
    if (isFarmStarted) return;

    const ok = await showAdFlow(6 + Math.floor(level / 2)); 
    if (!ok) return;

    const duration = 30 + level * 10;
    setFarmEndTime(Date.now() + duration * 1000);
    setFarming(true);
    setIsFarmStarted(true);

    showToast('Rồng bắt đầu tạo linh thạch!');
  };

  const showAdFlow = (durationSeconds: number) => {
    return new Promise<boolean>((resolve) => {
      const modalRoot = document.getElementById('modalRoot')!;
      modalRoot.style.display = 'block';
      modalRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal">
            <div style="font-weight: 700; font-size: 16px">Quảng cáo thưởng</div>
            <div style="margin-top: 8px; font-size: 13px">
              Xem quảng cáo để bắt đầu phiên nuôi rồng tự động (${durationSeconds}s)
            </div>
            <div class="adbar"><i id="adBar" style="width: 0%"></i></div>
            <div style="display: flex; gap: 10px; margin-top: 12px">
              <button id="skipAd" class="btn secondary" style="flex: 1">Bỏ qua</button>
              <button id="closeAd" class="btn" style="flex: 1">Ẩn</button>
            </div>
          </div>
        </div>`;

      const adBar = document.getElementById('adBar')!;
      const skipBtn = document.getElementById('skipAd')!;
      const closeBtn = document.getElementById('closeAd')!;

      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed++;
        const pct = Math.round((elapsed / durationSeconds) * 100);
        adBar.style.width = pct + '%';
        if (elapsed >= durationSeconds) {
          clearInterval(interval);
          modalRoot.style.display = 'none';
          resolve(true);
        }
      }, 1000);

      skipBtn.onclick = () => {
        clearInterval(interval);
        modalRoot.style.display = 'none';
        resolve(false);
        showToast('Bạn đã bỏ qua quảng cáo.');
      };

      closeBtn.onclick = () => {
        clearInterval(interval);
        modalRoot.style.display = 'none';
        resolve(true);
      };
    });
  };

  useEffect(() => {
    if (farming && farmEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diff = farmEndTime - now;
        if (diff <= 0) {
          clearInterval(interval);
          setFarming(false);
          setIsFarmStarted(false);
          showToast('Phiên nuôi rồng hoàn thành!');
        } else {
          const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
          const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
          setTimeLeft(`${h}:${m}:${s}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [farming, farmEndTime]);

  useEffect(() => {
    if (farming && farmEndTime) {
      const interval = setInterval(() => {
        setGems((prevGems) => prevGems + rate);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [farming, farmEndTime, rate]);

  const showToast = (text: string, ttl = 2000) => {
    const toastRoot = document.getElementById('toastRoot')!;
    toastRoot.style.display = 'block';
    toastRoot.innerHTML = `<div class="toast">${text}</div>`;
    setTimeout(() => {
      toastRoot.style.display = 'none';
    }, ttl);
  };

  const upgradeDragon = () => {
    if (gems >= cost) {
      setGems(gems - cost);
      setLevel(level + 1);
      setRate(rate * 1.22); 
      setCost(cost * 1.45); 
      showToast('Nâng cấp thành công!');
    } else {
      showToast('Không đủ linh thạch');
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="avatar">R</div>
        <div>
          <h1>Rồng Linh Thạch</h1>
          <div className="sub">Nuôi rồng • Tạo linh thạch • Đồng bộ với server</div>
        </div>
      </div>

      <div className="stage">
        <div className="dragon-wrap">
          <div className="dragon-card">
            <img src="dragon_image_url" alt="Dragon" className="dragon-image" />
            <div className="info">
              <div className="level">Lv. {level}</div>
              <div className="cost">Chi phí nâng cấp tiếp theo: {cost} linh thạch</div>
            </div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="v">{gems}</div>
            <div className="sub">Linh thạch</div>
          </div>
          <div className="stat">
            <div className="v">{rate} /s</div>
            <div className="sub">Tốc độ</div>
          </div>
          <div className="stat">
            <div className="v">{timeLeft}</div>
            <div className="sub">Thời gian còn lại</div>
          </div>
        </div>

        <div className="controls">
          <button
            className="btn"
            onClick={startFarming}
            disabled={isFarmStarted}
          >
            Bắt đầu nuôi rồng 
          </button>
          <button className="btn secondary" onClick={upgradeDragon}>
            Nâng cấp ({cost})
          </button>
        </div>
      </div>

      {/* Hiển thị thông tin người chơi khi đã fetch */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {userData ? (
            <div>
              <h2>Welcome {userData.first_name}</h2>
              <p>Your Username: {userData.username}</p>
            </div>
          ) : (
            <p>Error: Unable to fetch user data</p>
          )}
        </div>
      )}

      <div id="modalRoot" style={{ display: 'none' }}></div>
      <div id="toastRoot" style={{ display: 'none' }}></div>
    </div>
  );
};

export default DragonApp;
