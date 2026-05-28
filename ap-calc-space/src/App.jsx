import { useState } from "react";
import { useGameStore } from "./store/gameStore";
import MenuScreen from "./scenes/MenuScreen";
import DashboardScreen from "./scenes/DashboardScreen";
import MissionScreen from "./scenes/MissionScreen";
import MissionSelectScreen from "./scenes/MissionSelectScreen";
import UnlockScreen from "./scenes/UnlockScreen";
import CalculusOverviewScreen from "./scenes/CalculusOverviewScreen";
import ShopScreen from "./scenes/ShopScreen";

import "./index.css";

const GAME_OVER_MSG = {
  traffic: { label: 'TRAFFIC COLLAPSE',   desc: 'City gridlock reached critical threshold. All transport systems failed.', color: '#ffaa00' },
  energy:  { label: 'GRID BLACKOUT',      desc: 'Power grid instability exceeded safe limits. The city went dark.',       color: '#00ffcc' },
  weather: { label: 'CATASTROPHIC STORM', desc: 'Weather risk overwhelmed all emergency systems. The city is lost.',      color: '#66aaff' },
};

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [selectedMission, setSelectedMission] = useState(null);
  const { isGameOver, gameOverType, trafficLevel, energyLevel, weatherRisk } = useGameStore();

  const startSimulation = () => setScreen("dashboard");

  const handleRetry = () => {
    useGameStore.getState().setMetrics(() => ({
      trafficLevel: 50,
      energyLevel: 50,
      weatherRisk: 50,
      cityBudget: 1500,
    }));
    useGameStore.setState({ isGameOver: false, gameOverType: null });
    setScreen("dashboard");
  };

  const handleQuit = () => {
    useGameStore.setState({ isGameOver: false, gameOverType: null });
    setScreen("menu");
  };

  const gameOverKey = isGameOver ? (gameOverType || 'traffic') : null;

  return (
    <div className="app-container">

      {/* 전역 게임오버 오버레이 — 어느 화면에서든 즉시 표시 */}
      {gameOverKey && screen !== "menu" && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.93)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <p style={{ fontSize: '14px', color: '#5a7878', lineHeight: '1.8', marginBottom: '16px', fontFamily: 'monospace' }}>
              {GAME_OVER_MSG[gameOverKey].desc}
            </p>

            {/* 최종 수치 */}
            <div style={{
              background: 'rgba(255,0,0,0.05)', border: '1px solid rgba(255,0,0,0.2)',
              padding: '14px 20px', marginBottom: '28px', textAlign: 'left',
            }}>
              {[
                { label: 'Traffic', value: trafficLevel, warn: trafficLevel >= 100 },
                { label: 'Energy',  value: energyLevel,  warn: energyLevel  >= 100 },
                { label: 'Weather', value: weatherRisk,  warn: weatherRisk  >= 100 },
              ].map(({ label, value, warn }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontFamily: 'monospace', fontSize: '13px' }}>
                  <span style={{ color: '#5a7878' }}>{label}</span>
                  <span style={{ color: warn ? '#ff3333' : '#5a7878', fontWeight: warn ? 'bold' : 'normal' }}>
                    {value}%{warn ? '  ◀ CRITICAL' : ''}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid rgba(255,51,51,0.3)', marginBottom: '28px' }} />

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={handleRetry}
                style={{ padding: '14px 36px', background: 'transparent', border: '2px solid #00ffcc', color: '#00ffcc', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,204,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >↺ RETRY</button>
              <button
                onClick={handleQuit}
                style={{ padding: '14px 36px', background: 'transparent', border: '2px solid #444', color: '#666', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6666'; e.currentTarget.style.color = '#ff6666'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#666'; }}
              >✕ QUIT</button>
            </div>
          </div>
        </div>
      )}

      {/* 화면 라우팅 */}
      {screen === "menu" && (
        <MenuScreen onStart={startSimulation} onOverview={() => setScreen("overview")} />
      )}
      {screen === "dashboard" && (
        <DashboardScreen
          onNavigateToMission={() => setScreen("mission")}
          onOpenManual={() => {}}
          onNavigateToMissionSelect={() => setScreen("missionSelect")}
          onNavigateToUnlock={() => setScreen("unlock")}
          onNavigateToShop={() => setScreen("shop")}
          onLogout={() => setScreen("menu")}
        />
      )}
      {screen === "mission" && (
        <MissionScreen
          mission={selectedMission}
          onBack={() => { setSelectedMission(null); setScreen("missionSelect"); }}
        />
      )}
      {screen === "missionSelect" && (
        <MissionSelectScreen
          onSelectMission={(mission) => { setSelectedMission(mission); setScreen("mission"); }}
          onBack={() => setScreen("dashboard")}
        />
      )}
      {screen === "unlock" && (
        <UnlockScreen onBack={() => setScreen("dashboard")} />
      )}
      {screen === "shop" && (
        <ShopScreen onBack={() => setScreen("dashboard")} />
      )}
      {screen === "overview" && (
        <CalculusOverviewScreen onBack={() => setScreen("menu")} />
      )}
    </div>
  );
}