import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

const SHOP_ITEMS = [
  {
    id: 'niffler',
    price: 9,
    image: '/public/niffler.png',
    tag: 'RARE',
    tagColor: '#00ffcc',
  },
  {
    id: 'pieapple',
    price: 12,
    image: '/public/pieapple.png',
    tag: 'RARE',
    tagColor: '#00ffcc',
  },
  {
    id: 'duck',
    price: 9,
    image: '/public/duck.png',
    tag: 'RARE',
    tagColor: '#00ffcc',
  },
];

const PLACEHOLDER_COUNT = 3;

const ShopScreen = ({ onBack }) => {
  const { coins = 0 } = useGameStore();
  const [purchased, setPurchased] = useState([]);
  const [notification, setNotification] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleBuy = (item) => {
    if (purchased.includes(item.id)) {
      showNotif('ALREADY OWNED', 'error');
      return;
    }
    if (coins < item.price) {
      showNotif(`⚠ NOT ENOUGH COINS — NEED ${item.price - coins} MORE`, 'error');
      return;
    }
    useGameStore.setState((state) => ({ coins: state.coins - item.price }));
    setPurchased(prev => [...prev, item.id]);
    showNotif(`✓ ${item.name} PURCHASED!`, 'success');
  };

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
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#2a5050', letterSpacing: '3px', marginBottom: '4px' }}>
            CITY EXCHANGE
          </div>
          <h1 style={{ margin: 0, color: '#00ffcc', fontFamily: 'monospace', fontSize: '20px', letterSpacing: '4px', fontWeight: 'normal' }}>
            MR. POOLE'S ITEMS
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* 코인 잔액 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,170,0,0.06)',
            border: '2px solid rgba(255,170,0,0.35)',
            padding: '10px 20px',
          }}>
            <span style={{ fontSize: '20px' }}>🪙</span>
            <div>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#6a5020', letterSpacing: '2px' }}>COINS</div>
              <div style={{ fontSize: '22px', fontFamily: 'monospace', color: '#ffaa00', fontWeight: 'bold', lineHeight: 1 }}>
                {coins}
              </div>
            </div>
          </div>

          <button className="back-button" onClick={onBack} style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>
            ← BACK
          </button>
        </div>
      </div>

      {/* 아이템 그리드 */}
      <div style={{
        padding: '36px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        position: 'relative', zIndex: 1,
        flex: 1,
      }}>
        {SHOP_ITEMS.map((item) => {
          const isOwned = purchased.includes(item.id);
          const canAfford = coins >= item.price;
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isOwned ? 'rgba(255,170,0,0.04)' : 'rgba(0,255,204,0.02)',
                border: `2px solid ${isOwned ? 'rgba(255,170,0,0.5)' : isHovered ? 'rgba(0,255,204,0.6)' : 'rgba(0,255,204,0.2)'}`,
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s',
                transform: isHovered && !isOwned ? 'translateY(-3px)' : 'translateY(0)',
              }}
            >
              {/* 이미지 영역 */}
              <div style={{
                background: '#000',
                height: '220px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    maxHeight: '200px', maxWidth: '100%',
                    objectFit: 'contain',
                    filter: isOwned ? 'brightness(0.6) saturate(0.5)' : 'none',
                    transition: 'filter 0.3s',
                  }}
                />
                {/* 태그 */}
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px',
                  color: '#000', background: item.tagColor,
                  padding: '3px 8px', fontWeight: 'bold',
                }}>
                  {item.tag}
                </div>
                {/* 구매 완료 오버레이 */}
                {isOwned && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)',
                  }}>
                    <div style={{
                      color: '#ffaa00', fontFamily: 'monospace', fontSize: '16px',
                      letterSpacing: '3px', fontWeight: 'bold',
                      border: '2px solid #ffaa00', padding: '8px 20px',
                      background: 'rgba(0,0,0,0.6)',
                    }}>
                      ✓ OWNED
                    </div>
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, color: isOwned ? '#ffaa00' : '#cceee8', fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>
                    {item.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0, marginLeft: '10px' }}>
                    <span style={{ fontSize: '14px' }}>🪙</span>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
                      color: isOwned ? '#6a5020' : canAfford ? '#ffaa00' : '#ff6666',
                    }}>
                      {item.price}
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#5a8080', lineHeight: '1.6', flex: 1 }}>
                  {item.description}
                </p>

                {/* 버튼 */}
                <button
                  onClick={() => handleBuy(item)}
                  disabled={isOwned || !canAfford}
                  style={{
                    width: '100%', padding: '13px',
                    fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', fontWeight: 'bold',
                    border: `2px solid ${isOwned ? '#3a3010' : canAfford ? '#ffaa00' : '#2a3a2a'}`,
                    color: isOwned ? '#5a4010' : canAfford ? '#000' : '#3a5a3a',
                    background: isOwned ? 'transparent' : canAfford ? '#ffaa00' : 'transparent',
                    cursor: isOwned || !canAfford ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isOwned && canAfford) e.currentTarget.style.background = '#ffcc44'; }}
                  onMouseLeave={e => { if (!isOwned && canAfford) e.currentTarget.style.background = '#ffaa00'; }}
                >
                  {isOwned ? 'ALREADY OWNED' : canAfford ? `BUY  🪙${item.price}` : `NEED ${item.price - coins} MORE COINS`}
                </button>
              </div>
            </div>
          );
        })}

        {/* 빈 슬롯 */}
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            border: '2px dashed rgba(0,255,204,0.08)',
            minHeight: '380px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}>
            <div style={{ fontSize: '28px', opacity: 0.15 }}>◇</div>
            <div style={{ color: 'rgba(0,255,204,0.12)', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '2px' }}>
              SLOT {String(SHOP_ITEMS.length + i + 1).padStart(2, '0')}
            </div>
            <div style={{ color: 'rgba(0,255,204,0.08)', fontFamily: 'monospace', fontSize: '10px' }}>
              — COMING SOON —
            </div>
          </div>
        ))}
      </div>

      {/* 푸터 */}
      <div style={{
        borderTop: '2px solid rgba(0,255,204,0.15)',
        padding: '12px 40px',
        display: 'flex', justifyContent: 'space-between',
        position: 'relative', zIndex: 1,
      }}>
        <span style={{ color: '#1a4040', fontFamily: 'monospace', fontSize: '11px' }}>MR. POOLE'S ITEMS — COIN MARKET</span>
        <span style={{ color: '#1a4040', fontFamily: 'monospace', fontSize: '11px' }}>
          {SHOP_ITEMS.length} ITEMS · {purchased.length} OWNED
        </span>
      </div>
    </div>
  );
};

export default ShopScreen;