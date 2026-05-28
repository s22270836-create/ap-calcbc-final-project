import React, { useEffect, useState } from 'react';
import HUD from '../components/HUD';
import { useGameStore } from '../store/gameStore';
import eventSystem from '../systems/eventSystem';
import unlockSystem from '../systems/unlockSystem';
import GameManualModal from '../components/GameManualModal';

const GAME_OVER_MSG = {
  traffic: { label: 'TRAFFIC COLLAPSE',   desc: 'City gridlock reached critical threshold. All transport systems failed.', color: '#ffaa00' },
  energy:  { label: 'GRID BLACKOUT',      desc: 'Power grid instability exceeded safe limits. The city went dark.',       color: '#00ffcc' },
  weather: { label: 'CATASTROPHIC STORM', desc: 'Weather risk overwhelmed all emergency systems. The city is lost.',      color: '#66aaff' },
};

const DashboardScreen = ({ onNavigateToMission, onOpenManual, onNavigateToMissionSelect, onNavigateToUnlock, onNavigateToShop, onLogout }) => {
  const {
    activeEvent, trafficLevel, energyLevel, weatherRisk, cityBudget,
    isGameOver, gameOverType,          // ← store에서 직접 구독
    unlockedRegions,                   // ← 해금된 지역 목록
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('regions');
  const [isManualOpen, setIsManualOpen] = useState(false);

  // unlockSystem 지역 목록 + store 해금 상태 병합
  const rawRegions = unlockSystem && typeof unlockSystem.getRegionStatusList === 'function'
    ? unlockSystem.getRegionStatusList()
    : [];

  // store의 unlockedRegions 기준으로 unlocked 상태 오버라이드
  const regionsList = rawRegions.map(r => ({
    ...r,
    unlocked: unlockedRegions.includes(r.name),
  }));

  const unlockedCount = regionsList.filter(r => r.unlocked).length;
  const totalCount = regionsList.length || 5;

  const systemUpgrades = unlockSystem && typeof unlockSystem.getAllUpgrades === 'function'
    ? unlockSystem.getAllUpgrades()
    : [];

  const allUpgrades = systemUpgrades.length > 0 ? systemUpgrades : [
    { id: "traffic_lights", name: "Adaptive Traffic Lights", category: "traffic", cost: 500, effect: "Reduces traffic congestion 15%." },
    { id: "energy_forecast", name: "AI Energy Forecast System", category: "energy", cost: 800, effect: "Reduces grid instability 15%." },
    { id: "flood_sensors",   name: "Flood Detection Sensors",  category: "weather", cost: 1200, effect: "Reduces weather risk 15%." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3 && eventSystem && typeof eventSystem.triggerDailyEvent === 'function') {
        eventSystem.triggerDailyEvent();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handlePurchase = (upgrade) => {
    if (cityBudget < upgrade.cost) {
      alert("⚠️ Not Enough Budget");
      return;
    }
    if (unlockSystem && typeof unlockSystem.executePurchaseUpgrade === 'function') {
      const result = unlockSystem.executePurchaseUpgrade(upgrade);
      alert(result?.message || "Your purchase has been completed.");
    }
  };

  const handleRetry = () => {
    const store = useGameStore.getState?.();
    if (store?.setMetrics) {
      store.setMetrics(() => ({
        trafficLevel: 50,
        energyLevel: 50,
        weatherRisk: 50,
        cityBudget: 1500,
      }));
    }
    // isGameOver 리셋
    useGameStore.setState({ isGameOver: false, gameOverType: null });
  };

  // 게임오버 결정: store 플래그 우선 사용
  const gameOverKey = isGameOver ? (gameOverType || 'traffic') : null;

  return (
    <div className="dashboard-screen">

      {/* ── 게임오버 오버레이 ── */}
      {gameOverKey && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.93)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.03) 3px, rgba(255,0,0,0.03) 6px)',
          }} />

          <div style={{ textAlign: 'center', maxWidth: '520px', position: 'relative', padding: '0 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', filter: 'drop-shadow(0 0 20px #ff3333)' }}>⚠</div>
            <div style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '6px', color: '#ff3333', marginBottom: '14px' }}>
              — SYSTEM CRITICAL —
            </div>
            <h1 style={{
              margin: '0 0 16px 0', fontSize: '42px', fontFamily: 'monospace',
              fontWeight: 'bold', letterSpacing: '6px',
              color: GAME_OVER_MSG[gameOverKey].color,
              textShadow: `0 0 30px ${GAME_OVER_MSG[gameOverKey].color}`,
            }}>
              GAME OVER
            </h1>
            <div style={{ fontSize: '17px', fontFamily: 'monospace', letterSpacing: '3px', color: '#fff', marginBottom: '16px' }}>
              {GAME_OVER_MSG[gameOverKey].label}
            </div>
            <p style={{ fontSize: '14px', color: '#5a7878', lineHeight: '1.8', marginBottom: '40px', fontFamily: 'monospace' }}>
              {GAME_OVER_MSG[gameOverKey].desc}
            </p>
            <div style={{ borderTop: '2px solid rgba(255,51,51,0.3)', marginBottom: '32px' }} />
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={handleRetry} style={{
                padding: '14px 36px', background: 'transparent',
                border: '2px solid #00ffcc', color: '#00ffcc',
                fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,204,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >↺ RETRY</button>
              <button onClick={onLogout} style={{
                padding: '14px 36px', background: 'transparent',
                border: '2px solid #444', color: '#666',
                fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6666'; e.currentTarget.style.color = '#ff6666'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#666'; }}
              >✕ QUIT</button>
            </div>
          </div>
        </div>
      )}

      <HUD />

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 180px', gap: '20px', padding: '20px', alignItems: 'start' }}>

        {/* 좌측 패널 */}
        <div className="left-panel">
          <div className="data-card">
            <h2>Traffic Congestion</h2>
            <div className="data-value" style={{ color: trafficLevel > 75 ? '#ff3333' : '#00ffcc' }}>{trafficLevel}%</div>
          </div>
          <div className="data-card">
            <h2>Grid Instability</h2>
            <div className="data-value" style={{ color: energyLevel > 75 ? '#ff3333' : '#00ffcc' }}>{energyLevel}%</div>
          </div>
          <div className="data-card">
            <h2>Weather risk</h2>
            <div className="data-value" style={{ color: weatherRisk > 75 ? '#ff3333' : '#00ffcc' }}>{weatherRisk}%</div>
          </div>
        </div>

        {/* 중앙 패널 */}
        <div className="center-panel" style={{ borderLeft: '3px solid rgba(0,255,204,0.6)', paddingLeft: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button className="menu-button" onClick={() => setActiveTab('regions')} style={{ padding: '12px 24px', background: activeTab === 'regions' ? '#00ffcc' : 'transparent', color: activeTab === 'regions' ? 'black' : '#00ffcc' }}>
              Zone ({unlockedCount}/{totalCount})
            </button>
            <button className="menu-button" onClick={() => setActiveTab('upgrades')} style={{ padding: '12px 24px', background: activeTab === 'upgrades' ? '#00ffcc' : 'transparent', color: activeTab === 'upgrades' ? 'black' : '#00ffcc' }}>
              Items
            </button>
          </div>

          {activeTab === 'regions' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {regionsList.map((region) => {
                if (!region) return null;
                return (
                  <div
                    key={region.id}
                    className="data-card"
                    style={{
                      marginBottom: 0,
                      opacity: region.unlocked ? 1 : 0.4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '15px 20px',
                      borderColor: region.unlocked ? '#00ffcc' : '#333',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, color: region.unlocked ? '#00ffcc' : '#888', fontSize: '16px' }}>
                        {region.name}
                      </h3>
                      {!region.unlocked && (
                        <span style={{ fontSize: '9px', color: '#ff4444', border: '1px solid #ff4444', padding: '1px 4px', borderRadius: '2px' }}>
                          LOCKED
                        </span>
                      )}
                      {region.unlocked && (
                        <span style={{ fontSize: '9px', color: '#00ffcc', border: '1px solid #00ffcc33', padding: '1px 4px', borderRadius: '2px' }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: region.unlocked ? '#555' : '#555' }}>
                      {region.rewardText || '+1 Coin'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allUpgrades.map((upgrade) => {
                if (!upgrade) return null;
                const isPurchased = upgrade.purchased === true;
                return (
                  <div key={upgrade.id} className="data-card" style={{
                    marginBottom: 0, display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', borderColor: '#00ffcc', opacity: isPurchased ? 0.5 : 1,
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h3 style={{ margin: 0, color: '#00ffcc', fontSize: '18px', fontWeight: 'bold' }}>{upgrade.name}</h3>
                        {upgrade.category && (
                          <span style={{ fontSize: '10px', border: '1px solid #00ffcc', padding: '1px 6px', color: '#00ffcc' }}>
                            {upgrade.category.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: '#ccc', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                        {upgrade.effect || upgrade.description}
                      </p>
                    </div>
                    {isPurchased ? (
                      <button style={{ padding: '10px 18px', background: 'transparent', color: '#555', border: '1px solid #333', cursor: 'not-allowed', fontSize: '13px', fontWeight: 'bold' }} disabled>Finish</button>
                    ) : (
                      <button className="menu-button" onClick={() => handlePurchase(upgrade)} style={{ padding: '10px 18px', borderColor: '#00ffcc', color: '#00ffcc', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                        Buy (-${upgrade.cost})
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 우측 패널 */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          paddingTop: '4px', borderLeft: '3px solid rgba(0,255,204,0.6)', paddingLeft: '20px',
        }}>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2a5050', letterSpacing: '2px', marginBottom: '6px' }}>CONTROL</div>
          {[
            { label: 'MANUAL',      color: '#00ffcc', onClick: () => setIsManualOpen(true) },
            { label: 'MISSIONS',    color: '#00ffcc', onClick: onNavigateToMissionSelect },
            { label: 'UNLOCK ZONE', color: '#00ffcc', onClick: onNavigateToUnlock },
            { label: 'SHOP',        color: '#ffaa00', onClick: onNavigateToShop },
          ].map(({ label, color, onClick }) => (
            <button key={label} className="menu-button" onClick={onClick} style={{
              padding: '12px 10px', fontSize: '12px', fontFamily: 'monospace',
              letterSpacing: '1.5px', borderColor: color, color,
              background: 'transparent', width: '100%', textAlign: 'center', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${color}18`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{label}</button>
          ))}
          <div style={{ borderTop: '2px solid rgba(0,255,204,0.25)', margin: '6px 0' }} />
          <button className="menu-button" onClick={onLogout} style={{
            padding: '10px', fontSize: '12px', fontFamily: 'monospace',
            letterSpacing: '1.5px', borderColor: '#444', color: '#666',
            background: 'transparent', width: '100%', textAlign: 'center', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff6666'; e.currentTarget.style.borderColor = '#ff6666'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#444'; }}
          >LOGOUT</button>
        </div>
      </div>

      <GameManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
    </div>
  );
};

export default DashboardScreen;