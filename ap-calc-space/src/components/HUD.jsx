import React from 'react';
import { useGameStore } from '../store/gameStore';

const HUD = () => {
  const { cityBudget, coins } = useGameStore();

  return (
    <div className="hud">
      <div className="hud-title">JEJU SMART CITY CONTROL</div>
      <div style={{ display: 'flex', gap: '40px', fontSize: '18px', fontWeight: 'bold' }}>
        <div>
          <span style={{ color: '#888' }}>BUDGET: </span>
          <span style={{ color: '#00ffcc' }}>${cityBudget.toLocaleString()}</span>
        </div>
        <div>
          <span style={{ color: '#888' }}>🪙 COINS: </span>
          <span style={{ color: '#ffaa00' }}>{coins} AMULETS</span>
        </div>
        <div>STATUS: <span className="hud-status">ONLINE</span></div>
      </div>
    </div>
  );
};

export default HUD;