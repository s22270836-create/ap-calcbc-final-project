import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import unlockSystem from '../systems/unlockSystem';

const getCostFromReward = (rewardText) => {
  const match = rewardText?.match(/\+(\d+)/);
  const coins = match ? parseInt(match[1]) : 1;
  const PRICE_MAP = { 1: 200, 2: 350, 3: 500, 4: 700 };
  return PRICE_MAP[coins] || coins * 150;
};

const UnlockScreen = ({ onBack }) => {
  const { unlockedRegions, cityBudget, unlockRegionInStore, setMetrics } = useGameStore();
  const [notification, setNotification] = useState(null);
  const [justUnlocked, setJustUnlocked] = useState([]);

  const regionsList = unlockSystem && typeof unlockSystem.getRegionStatusList === 'function'
    ? unlockSystem.getRegionStatusList()
    : [];

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2800);
  };

  const triggerUnlock = (region) => {
    const cost = getCostFromReward(region.rewardText);
    if (cityBudget < cost) {
      showNotif(`⚠ NEED $${(cost - cityBudget).toLocaleString()} MORE`, 'error');
      return;
    }
    // 예산 차감
    setMetrics((state) => ({ cityBudget: state.cityBudget - cost }));
    // 코인은 rewardText 기반으로 자동 지급
    unlockRegionInStore(region.name, region.rewardText);
    setJustUnlocked(prev => [...prev, region.name]);

    const match = region.rewardText?.match(/\+(\d+)/);
    const coinGain = match ? parseInt(match[1]) : 1;
    showNotif(`✓ [${region.name}] UNLOCKED  +${coinGain} COIN`, 'success');
  };

  const isOwned = (region) => unlockedRegions.includes(region.name);
  const boughtNow = (region) => justUnlocked.includes(region.name);

  const unlockedCount = regionsList.filter(r => isOwned(r)).length;
  const totalCount = regionsList.length;

  return (
    <div style={{ minHeight: '100vh', background: '#050e0e', display: 'flex', flexDirection: 'column' }}>

      {/* 스캔라인 */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.01) 2px, rgba(0,255,204,0.01) 4px)',
      }} />

      {/* 토스트 */}
      {notification && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '12px 32px',
          background: notification.type === 'error' ? 'rgba(255,50,50,0.12)' : 'rgba(0,255,204,0.08)',
          border: `2px solid ${notification.type === 'error' ? '#ff3333' : '#00ffcc'}`,
          color: notification.type === 'error' ? '#ff6666' : '#00ffcc',
          fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px',
          backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
        }}>
          {notification.msg}
        </div>
      )}

      {/* 헤더 */}
      <div style={{
        borderBottom: '2px solid rgba(0,255,204,0.5)',
        padding: '18px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#050e0e', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2a5050', letterSpacing: '3px', marginBottom: '4px' }}>TERRITORIAL DATA-LINK</div>
          <h1 style={{ margin: 0, color: '#00ffcc', fontFamily: 'monospace', fontSize: '20px', letterSpacing: '4px', fontWeight: 'normal' }}>UNLOCK ZONE</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* 진행도 */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2a5050', letterSpacing: '2px', marginBottom: '6px' }}>ZONES ACTIVE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '120px', height: '4px', background: 'rgba(0,255,204,0.1)', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: '100%',
                  width: `${totalCount ? (unlockedCount / totalCount) * 100 : 0}%`,
                  background: '#00ffcc', transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '14px', fontWeight: 'bold' }}>{unlockedCount}/{totalCount}</span>
            </div>
          </div>

          {/* 예산 */}
          <div style={{ background: 'rgba(0,255,204,0.06)', border: '2px solid rgba(0,255,204,0.3)', padding: '8px 18px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#3a6060', letterSpacing: '2px' }}>BUDGET</div>
            <div style={{ fontSize: '18px', fontFamily: 'monospace', color: '#00ffcc', fontWeight: 'bold' }}>${cityBudget.toLocaleString()}</div>
          </div>

          <button className="back-button" onClick={onBack} style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>← BACK</button>
        </div>
      </div>

      {/* 가격 안내 */}
      <div style={{
        margin: '20px 40px 0', padding: '12px 20px',
        background: 'rgba(0,255,204,0.02)', border: '1px solid rgba(0,255,204,0.1)',
        display: 'flex', gap: '28px', alignItems: 'center',
        position: 'relative', zIndex: 1, flexWrap: 'wrap',
      }}>
        <span style={{ color: '#2a5050', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px' }}>PRICE GUIDE</span>
        {[
          { reward: '+1 Coin', price: '$200' },
          { reward: '+2 Coin', price: '$350' },
          { reward: '+3 Coin', price: '$500' },
          { reward: '+4 Coin', price: '$700' },
        ].map(({ reward, price }) => (
          <div key={reward} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#ffaa00', fontFamily: 'monospace', fontSize: '12px' }}>{reward}</span>
            <span style={{ color: '#2a5050', fontFamily: 'monospace', fontSize: '11px' }}>→</span>
            <span style={{ color: '#00ffcc', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>{price}</span>
          </div>
        ))}
      </div>

      {/* 지역 그리드 */}
      <div style={{
        padding: '24px 40px 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
        position: 'relative', zIndex: 1,
      }}>
        {regionsList.map((region) => {
          const owned = isOwned(region);
          const newlyBought = boughtNow(region);
          const cost = getCostFromReward(region.rewardText);
          const canAfford = cityBudget >= cost;

          return (
            <div key={region.id} style={{
              background: owned ? (newlyBought ? 'rgba(255,170,0,0.04)' : 'rgba(0,255,204,0.04)') : '#080f0f',
              border: `2px solid ${owned ? (newlyBought ? 'rgba(255,170,0,0.55)' : 'rgba(0,255,204,0.4)') : canAfford ? 'rgba(0,255,204,0.2)' : 'rgba(0,255,204,0.08)'}`,
              padding: '22px',
              display: 'flex', flexDirection: 'column', gap: '14px',
              position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s',
            }}>
              {/* 글로우 */}
              {owned && (
                <div style={{
                  position: 'absolute', top: 0, right: 0, width: '70px', height: '70px',
                  background: newlyBought
                    ? 'radial-gradient(circle at top right, rgba(255,170,0,0.2), transparent 70%)'
                    : 'radial-gradient(circle at top right, rgba(0,255,204,0.12), transparent 70%)',
                  pointerEvents: 'none',
                }} />
              )}

              {/* 상태 배지 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px', padding: '2px 8px',
                  color: owned ? (newlyBought ? '#ffaa00' : '#00ffcc') : '#3a6060',
                  border: `1px solid ${owned ? (newlyBought ? 'rgba(255,170,0,0.5)' : 'rgba(0,255,204,0.4)') : 'rgba(0,255,204,0.12)'}`,
                }}>
                  {owned ? (newlyBought ? 'PURCHASED' : 'ACTIVE') : 'LOCKED'}
                </span>
                <span style={{ fontSize: '10px', color: '#2a5050', fontFamily: 'monospace' }}>#{String(region.id).padStart(2, '0')}</span>
              </div>

              {/* 지역명 */}
              <h2 style={{
                margin: 0,
                color: owned ? (newlyBought ? '#ffe0aa' : '#cceee8') : '#6a8888',
                fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
              }}>
                {region.name}
              </h2>

              {/* 보상 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                background: owned ? 'rgba(255,170,0,0.08)' : 'rgba(255,170,0,0.03)',
                border: `1px solid ${owned ? 'rgba(255,170,0,0.3)' : 'rgba(255,170,0,0.08)'}`,
              }}>
                <span style={{ fontSize: '14px' }}>🪙</span>
                <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', color: owned ? '#ffaa00' : '#5a4a20' }}>
                  {region.rewardText || '+1 Coin'}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a3020', marginLeft: 'auto' }}>per cycle</span>
              </div>

              {/* 가격 표시 (미구매) */}
              {!owned && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3a6060', letterSpacing: '1px' }}>UNLOCK PRICE</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold', color: canAfford ? '#00ffcc' : '#ff6666' }}>
                    ${cost}
                  </span>
                </div>
              )}

              {/* 액션 */}
              <div style={{ marginTop: 'auto' }}>
                {owned ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '12px',
                    background: newlyBought ? 'rgba(255,170,0,0.08)' : 'rgba(0,255,204,0.04)',
                    border: `2px solid ${newlyBought ? 'rgba(255,170,0,0.4)' : 'rgba(0,255,204,0.2)'}`,
                    color: newlyBought ? '#ffaa00' : '#00ffcc',
                    fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', fontWeight: 'bold',
                  }}>
                    {newlyBought ? '✓ PURCHASED' : '● ALREADY OWNED'}
                  </div>
                ) : (
                  <button
                    onClick={() => triggerUnlock(region)}
                    disabled={!canAfford}
                    style={{
                      width: '100%', padding: '14px 0',
                      fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold',
                      border: `2px solid ${canAfford ? '#00ffcc' : '#2a3a2a'}`,
                      color: canAfford ? '#000' : '#3a5a3a',
                      background: canAfford ? '#00ffcc' : 'transparent',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (canAfford) { e.currentTarget.style.background = '#00ddaa'; e.currentTarget.style.borderColor = '#00ddaa'; }}}
                    onMouseLeave={e => { if (canAfford) { e.currentTarget.style.background = '#00ffcc'; e.currentTarget.style.borderColor = '#00ffcc'; }}}
                  >
                    {canAfford ? `BUY  –$${cost}` : `NEED $${(cost - cityBudget).toLocaleString()} MORE`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 푸터 */}
      <div style={{
        borderTop: '2px solid rgba(0,255,204,0.15)', padding: '12px 40px',
        display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1,
      }}>
        <span style={{ color: '#1a4040', fontFamily: 'monospace', fontSize: '11px' }}>JEJU TERRITORIAL GRID v2.4</span>
        <span style={{ color: '#1a4040', fontFamily: 'monospace', fontSize: '11px' }}>{totalCount - unlockedCount} ZONES REMAINING</span>
      </div>
    </div>
  );
};

export default UnlockScreen;