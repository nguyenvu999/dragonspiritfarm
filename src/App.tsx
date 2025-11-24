import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// import './App.css'; // Giữ lại nếu bạn có file CSS

// LƯU Ý QUAN TRỌNG: Thay thế URL này bằng URL triển khai thực tế của bạn
const BACKEND_URL = 'https://dragon-spirit-app.onrender.com';

// Khai báo kiểu dữ liệu cho trạng thái game
interface GameState {
  level: number;
  gems: number;
  rate: number;
  cost: number;
  isFarming: boolean;
  farmEndTime: number;
}

const DragonApp: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isAuthReady, setIsAuthReady] = useState(false); // Cờ kiểm tra auth đã sẵn sàng

  // Khởi tạo state game với giá trị mặc định/ban đầu (sẽ được ghi đè từ DB)
  const [level, setLevel] = useState(1);
  const [gems, setGems] = useState(0);
  const [rate, setRate] = useState(1);
  const [cost, setCost] = useState(100);
  const [farming, setFarming] = useState(false);
  const [farmEndTime, setFarmEndTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  // Hàm hiển thị Toast
  const showToast = (text: string, ttl = 2000) => {
    const toastRoot = document.getElementById('toastRoot');
    if (toastRoot) {
      toastRoot.style.display = 'block';
      toastRoot.innerHTML = `<div class="toast">${text}</div>`;
      setTimeout(() => {
        toastRoot.style.display = 'none';
      }, ttl);
    }
  };

  // Hàm đồng bộ trạng thái với backend
  const syncGameState = useCallback(async (updates: Partial<GameState>) => {
    const initData = window.Telegram?.WebApp?.initData;
    
    // Nếu không có initData, chỉ cập nhật state cục bộ cho mục đích test
    if (!initData) {
        console.warn('Syncing in Mock Mode. Local state updated, but no data sent to secure backend.');
        if (updates.level !== undefined) setLevel(updates.level);
        if (updates.gems !== undefined) setGems(updates.gems);
        if (updates.rate !== undefined) setRate(updates.rate);
        if (updates.cost !== undefined) setCost(updates.cost);
        if (updates.isFarming !== undefined) setFarming(updates.isFarming);
        if (updates.farmEndTime !== undefined) setFarmEndTime(updates.farmEndTime);
        return true;
    }

    try {
        const response = await axios.post(`${BACKEND_URL}/updateGameState`, { 
            initData, 
            updates 
        });

        if (response.data.success) {
            const updatedState = response.data.gameState;
            setLevel(updatedState.level);
            setGems(updatedState.gems);
            setRate(updatedState.rate);
            setCost(updatedState.cost);
            setFarming(updatedState.isFarming);
            setFarmEndTime(updatedState.farmEndTime);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error syncing game state:', error);
        showToast('Lỗi đồng bộ hóa trạng thái game.');
        return false;
    }
  }, []);

  // Effect 1: Fetch và Khởi tạo dữ liệu người chơi/game
  useEffect(() => {
    const fetchAndInitialize = async () => {
      const initData = window.Telegram?.WebApp?.initData;
      
      if (!initData) {
        // FALLBACK CHO CANVAS PREVIEW/LOCAL DEVELOPMENT
        console.warn('[MOCK MODE] Telegram WebApp initData not available. Using dummy data for testing.');
        
        // Mô phỏng thông tin người dùng
        setUserData({ 
            first_name: 'Tester', 
            username: 'dev_user',
            id: 'mock_123'
        });
        
        // Thiết lập trạng thái game mô phỏng
        setLevel(1);
        setGems(1000); // Cho một ít gems để dễ test
        setRate(1);
        setCost(100);
        setFarming(false);
        setFarmEndTime(0);
        
        setIsAuthReady(true);
        setIsLoading(false);
        return;
      }

      // LOGIC FETCH THỰC TẾ (KHI CHẠY TRONG TELEGRAM)
      try {
        const response = await axios.post(`${BACKEND_URL}/fetchUserData`, { initData });
        
        if (response.data.success) {
          const { user, gameState } = response.data;
          setUserData(user);
          
          // Khởi tạo tất cả state game từ DB
          setLevel(gameState.level);
          setGems(gameState.gems);
          setRate(gameState.rate);
          setCost(gameState.cost);
          setFarming(gameState.isFarming);
          setFarmEndTime(gameState.farmEndTime);
          
          setIsAuthReady(true);
        } else {
            console.error('Backend failed to authenticate or fetch user data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndInitialize();
  }, []);

  // Hàm giả lập quảng cáo
  const showAdFlow = (durationSeconds: number): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const modalRoot = document.getElementById('modalRoot');
      if (!modalRoot) return resolve(false);

      modalRoot.style.display = 'block';
      modalRoot.innerHTML = `
        <div class="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div class="modal bg-gray-800 text-white p-6 rounded-xl shadow-2xl w-full max-w-sm">
            <div style="font-weight: 700; font-size: 1.125rem; color: #4ade80">Quảng cáo thưởng</div>
            <div style="margin-top: 8px; font-size: 0.875rem">
              Xem quảng cáo để bắt đầu phiên nuôi rồng tự động (${durationSeconds}s)
            </div>
            <div class="adbar h-3 bg-gray-700 rounded-full mt-4 overflow-hidden">
              <div id="adBar" class="h-full bg-red-500 transition-all duration-1000" style="width: 0%"></div>
            </div>
            <div class="flex gap-3 mt-4">
              <button id="skipAd" class="btn secondary flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Bỏ qua</button>
              <button id="closeAd" class="btn flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">Ẩn</button>
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

      const hideModalAndResolve = (result: boolean) => {
        clearInterval(interval);
        modalRoot.style.display = 'none';
        resolve(result);
      }

      skipBtn.onclick = () => {
        hideModalAndResolve(false);
        showToast('Bạn đã bỏ qua quảng cáo.');
      };

      closeBtn.onclick = () => {
        hideModalAndResolve(true); // Quyết định đóng/ẩn vẫn cho phép farm
      };
    });
  };

  const startFarming = async () => {
    // Không cho phép bắt đầu nếu đang load hoặc đã farm
    if (!isAuthReady || farming) return;

    // Tính thời gian quảng cáo dựa trên level
    const adDuration = 6 + Math.floor(level / 2);
    const ok = await showAdFlow(adDuration); 
    if (!ok) return;

    // Tính thời gian farm
    const durationSeconds = 30 + level * 10;
    const newFarmEndTime = Date.now() + durationSeconds * 1000;
    
    const success = await syncGameState({
        isFarming: true,
        farmEndTime: newFarmEndTime,
    });

    if (success) {
      setFarming(true);
      setFarmEndTime(newFarmEndTime);
      showToast('Rồng bắt đầu tạo linh thạch!');
    }
  };

  // Effect 2: Timer đếm ngược
  useEffect(() => {
    if (farming && farmEndTime > 0) {
      const interval = setInterval(async () => {
        const now = Date.now();
        const diff = farmEndTime - now;

        if (diff <= 0) {
          clearInterval(interval);
          setFarming(false);
          setTimeLeft('00:00:00');

          // Dừng farm và đồng bộ hóa lần cuối (đặt isFarming = false)
          await syncGameState({ isFarming: false, farmEndTime: 0 });
          showToast('Phiên nuôi rồng hoàn thành!');
          
        } else {
          // Tính và cập nhật thời gian còn lại
          const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
          const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
          setTimeLeft(`${h}:${m}:${s}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (!farming && isAuthReady) {
        setTimeLeft('00:00:00');
    }
  }, [farming, farmEndTime, isAuthReady, syncGameState]);

  // Effect 3: Tự động cộng gems (chỉ khi đang farming)
  useEffect(() => {
    if (farming) {
      const interval = setInterval(() => {
        setGems((prevGems) => prevGems + rate);
      }, 1000);

      // Cứ 5 giây đồng bộ gems lên server (để đảm bảo tiến trình được lưu)
      const syncInterval = setInterval(() => {
        // Trong chế độ mô phỏng, gems có thể không chính xác vì không có data ban đầu
        if (!window.Telegram?.WebApp?.initData) return; 

        // Nếu có initData, đồng bộ hóa
        syncGameState({ gems: gems + rate * 5 }); // Giả định gems sau 5s
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(syncInterval);
      };
    }
  }, [farming, rate, gems, syncGameState]);


  const upgradeDragon = async () => {
    if (!isAuthReady) return;

    if (gems >= cost) {
      const newGems = gems - cost;
      const newLevel = level + 1;
      const newRate = rate * 1.22; 
      const newCost = Math.floor(cost * 1.45); 

      // Đồng bộ hóa trạng thái mới lên server
      const success = await syncGameState({
          gems: newGems,
          level: newLevel,
          rate: newRate,
          cost: newCost,
      });

      if (success) {
          setGems(newGems);
          setLevel(newLevel);
          setRate(newRate);
          setCost(newCost);
          showToast('Nâng cấp thành công!');
      }
      
    } else {
      showToast('Không đủ linh thạch');
    }
  };

  // Cải thiện UI với Tailwind CSS (giả định có sẵn)
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4">
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
            <div className="text-xl text-green-400">Đang tải dữ liệu người dùng...</div>
        </div>
      )}

      {!isLoading && !isAuthReady && (
        <div className="text-red-400 text-center mt-20">
            Lỗi xác thực. Vui lòng thử lại từ Telegram.
        </div>
      )}

      {/* Header */}
      {isAuthReady && userData && (
        <div className="w-full max-w-md flex items-center justify-between p-4 bg-gray-800 rounded-xl shadow-lg mb-6">
          <div className="flex items-center space-x-3">
            <div className="avatar w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-xl font-bold">
                {userData.first_name ? userData.first_name[0] : 'U'}
            </div>
            <div>
              <h1 className="text-lg font-bold text-green-400">Rồng Linh Thạch</h1>
              <div className="text-xs text-gray-400">Chào mừng, {userData.first_name || userData.username}</div>
            </div>
          </div>
          {/* Có thể thêm nút Setting/Mời bạn bè ở đây */}
        </div>
      )}

      {/* Main Game Stage */}
      {isAuthReady && (
        <div className="w-full max-w-md">
          {/* Dragon Card */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-6 flex flex-col items-center">
            <div className="dragon-wrap relative w-40 h-40 mb-4">
              <img 
                src="https://placehold.co/160x160/22c55e/ffffff?text=DRAGON" 
                alt="Dragon" 
                className={`dragon-image w-full h-full object-contain transition-transform duration-300 ${farming ? 'animate-pulse' : ''}`} 
              />
            </div>
            
            <div className="info text-center">
              <div className="level text-3xl font-extrabold text-yellow-400">Lv. {level}</div>
              <div className="cost text-sm text-gray-400 mt-1">
                Chi phí nâng cấp tiếp theo: <span className="font-semibold text-white">{Math.floor(cost)}</span> linh thạch
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats grid grid-cols-3 gap-4 mb-8">
            <div className="stat bg-gray-800 p-4 rounded-xl text-center shadow-md">
              <div className="v text-2xl font-bold text-teal-400">{Math.floor(gems)}</div>
              <div className="sub text-xs text-gray-400">Linh thạch</div>
            </div>
            <div className="stat bg-gray-800 p-4 rounded-xl text-center shadow-md">
              <div className="v text-2xl font-bold text-teal-400">{rate.toFixed(2)}/s</div>
              <div className="sub text-xs text-gray-400">Tốc độ</div>
            </div>
            <div className="stat bg-gray-800 p-4 rounded-xl text-center shadow-md">
              <div className="v text-2xl font-bold text-red-400">{timeLeft}</div>
              <div className="sub text-xs text-gray-400">Thời gian farm</div>
            </div>
          </div>

          {/* Controls */}
          <div className="controls flex flex-col space-y-3">
            <button
              className={`btn w-full font-bold py-3 px-4 rounded-xl transition duration-200 ${farming ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              onClick={startFarming}
              disabled={farming || !isAuthReady}
            >
              {farming ? `Đang Nuôi Rồng (${timeLeft})` : 'Bắt đầu Nuôi Rồng'}
            </button>
            <button 
              className={`btn w-full font-bold py-3 px-4 rounded-xl transition duration-200 ${gems < cost ? 'bg-red-800 text-red-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} 
              onClick={upgradeDragon}
              disabled={gems < cost || !isAuthReady}
            >
              Nâng cấp ( {Math.floor(cost)} Linh thạch )
            </button>
          </div>
        </div>
      )}

      {/* Modal and Toast roots */}
      <div id="modalRoot" className="hidden"></div>
      <div id="toastRoot" className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {/* CSS cho Toast: */}
        <style>{`
          .toast {
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            font-weight: 500;
            opacity: 0.9;
          }
        `}</style>
      </div>
    </div>
  );
};

export default DragonApp;
