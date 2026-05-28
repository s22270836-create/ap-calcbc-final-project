import React, { useState } from 'react';
import missionSystem from '../systems/missionSystem';

const DOMAIN_COLOR = {
  traffic: '#ffaa00',
  energy:  '#00ffcc',
  weather: '#66aaff',
};

const DOMAIN_LABEL = {
  traffic: 'TRAFFIC',
  energy:  'ENERGY',
  weather: 'WEATHER',
};

const MissionSelectScreen = ({ onSelectMission, onBack }) => {
  const [filter, setFilter] = useState('ALL');
  const allMissions = missionSystem.getAllMissions();

  const filtered = filter === 'ALL'
    ? allMissions
    : allMissions.filter((m) => m.domain.toUpperCase() === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#050e0e' }}>

      {/* 헤더 */}
      <div style={{
        borderBottom: '2px solid rgba(0,255,204,0.5)',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, background: '#050e0e', zIndex: 10,
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#00ffcc', fontFamily: 'monospace', fontSize: '20px', letterSpacing: '4px', fontWeight: 'normal' }}>
            MISSION SELECT
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#3a6060', fontSize: '12px', fontFamily: 'monospace' }}>
            {filtered.length} MISSIONS AVAILABLE
          </p>
        </div>
        <button className="back-button" onClick={onBack} style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>
          ← BACK
        </button>
      </div>

      {/* 필터 탭 */}
      <div style={{ padding: '16px 40px', display: 'flex', gap: '10px', borderBottom: '2px solid rgba(0,255,204,0.25)' }}>
        {['ALL', 'TRAFFIC', 'ENERGY', 'WEATHER'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 18px',
              background: filter === f ? (f === 'ALL' ? '#00ffcc' : DOMAIN_COLOR[f.toLowerCase()] || '#00ffcc') : 'transparent',
              color: filter === f ? '#000' : '#4a7070',
              border: `1px solid ${filter === f ? 'transparent' : 'rgba(0,255,204,0.2)'}`,
              cursor: 'pointer', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1.5px',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 미션 그리드 */}
      <div style={{
        padding: '28px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {filtered.map((mission) => {
          const domainColor = DOMAIN_COLOR[mission.domain] || '#00ffcc';
          return (
            <div
              key={mission.id}
              style={{
                background: 'rgba(0,255,204,0.02)',
                border: '2px solid rgba(0,255,204,0.2)',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.7)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,255,204,0.2)'}
            >
              {/* 문제 이미지 썸네일 */}
              <div style={{
                background: '#fff',
                height: '180px',
                overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={mission.image}
                  alt={`Q${mission.id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* 카드 하단 */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px',
                    color: domainColor, border: `2px solid ${domainColor}88`, padding: '2px 8px',
                  }}>
                    {DOMAIN_LABEL[mission.domain]}
                  </span>
                  <span style={{ fontSize: '10px', color: '#3a6060', fontFamily: 'monospace' }}>
                    #{String(mission.id).padStart(2, '0')}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#3a6060', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {mission.unit}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '2px solid rgba(0,255,204,0.12)' }}>
                  <span style={{ fontSize: '13px', color: '#ffaa00', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    +${mission.reward}
                  </span>
                  <button
                    className="menu-button"
                    onClick={() => onSelectMission(mission)}
                    style={{ padding: '7px 18px', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px', borderColor: domainColor, color: domainColor }}
                  >
                    SOLVE →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionSelectScreen;