import React, { useState } from 'react';

const manualData = [
  {
    id: 'overview',
    icon: '⬡',
    title: 'OVERVIEW',
    content: [
      {
        type: 'text',
        body: 'You are a city manager in Jeju. Mission: Keep the city stable, expand districts, and manage infrastructure to prevent system collapse.'
      },
      {
        type: 'stats',
        items: [
          { label: 'City Budget', desc: 'Earned by completing missions. Used to unlock zones and buy upgrades.' },
          { label: 'Coins', desc: 'Awarded upon unlocking zones. Used in the Coin Shop for "Mr. Poole’s items".' },
          { label: 'City Status', desc: 'Monitor Traffic, Grid, and Weather. Exceeding 100% in any category triggers Game Over.' },
        ]
      }
    ]
  },
  {
    id: 'zones',
    icon: '◈',
    title: 'ZONES & COINS',
    content: [
      {
        type: 'text',
        body: 'Use your budget to unlock new districts and generate resources.'
      },
      {
        type: 'steps',
        items: [
          { num: '01', title: 'Unlock Zone', desc: 'Spend your budget to activate a new district.' },
          { num: '02', title: 'Earn Coins', desc: 'Unlocking a zone rewards you with valuable coins.' },
          { num: '03', title: 'Coin Shop', desc: 'Spend coins in the shop to acquire special "Mr. Poole’s items".' },
        ]
      }
    ]
  },
  {
    id: 'missions',
    icon: '●',
    title: 'MISSIONS (AP CALC BC)',
    content: [
      {
        type: 'text',
        body: 'Missions are critical for funding and stability. Each mission is a Calculus BC problem.'
      },
      {
        type: 'steps',
        items: [
          { num: 'Correct', title: 'Reward & Stabilize', desc: 'Correct answers grant budget and reduce the relevant risk category by 10%.' },
          { num: 'Incorrect', title: 'Risk Spike', desc: 'Incorrect answers increase the relevant risk category by 10%.' },
        ]
      },
    ]
  },
  {
    id: 'upgrades',
    icon: '◆',
    title: 'ITEMS',
    content: [
      {
        type: 'text',
        body: 'Purchase infrastructure upgrades to permanently lower risk levels and maintain city stability.'
      },
      {
        type: 'table',
        headers: ['Upgrade', 'Category', 'Effect'],
        rows: [
          ['Adaptive Traffic Lights', 'TRAFFIC', '−15% congestion'],
          ['AI Energy Forecast System', 'ENERGY', '−15% grid instability'],
          ['Flood Detection Sensors', 'WEATHER', '−15% weather risk'],
        ]
      }
    ]
  },
  {
    id: 'gameover',
    icon: '●',
    title: 'CRITICAL FAILURE',
    content: [
      {
        type: 'text',
        body: 'The city will face an irreversible collapse if any of the following metrics reach 100%:'
      },
      {
        type: 'stats',
        items: [
          { label: 'Traffic', desc: 'Traffic Congestion exceeds 100%.' },
          { label: 'Energy', desc: 'Grid Instability exceeds 100%.' },
          { label: 'Weather', desc: 'Weather Risk exceeds 100%.' },
        ]
      }
    ]
  }
];

export default function GameManualModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  const currentTab = manualData.find(t => t.id === activeTab);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.85)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        width: '800px', height: '600px', background: '#0a101a',
        border: '2px solid #00ffcc', display: 'flex', flexDirection: 'column',
        boxShadow: '0 0 40px rgba(0,255,204,0.2)'
      }}>
        <div style={{
          padding: '20px', borderBottom: '1px solid rgba(0,255,204,0.3)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#00ffcc', letterSpacing: '4px' }}>CITY_OPERATIONS_MANUAL</h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid #00ffcc', color: '#00ffcc',
            padding: '5px 15px', cursor: 'pointer'
          }}>CLOSE</button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: '220px', borderRight: '1px solid rgba(0,255,204,0.1)', padding: '20px' }}>
            {manualData.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', padding: '15px', textAlign: 'left', marginBottom: '10px',
                  background: activeTab === tab.id ? 'rgba(0,255,204,0.1)' : 'transparent',
                  border: activeTab === tab.id ? '1px solid #00ffcc' : '1px solid transparent',
                  color: activeTab === tab.id ? '#00ffcc' : '#5a7878',
                  cursor: 'pointer', transition: '0.2s', fontFamily: 'monospace'
                }}
              >
                <span style={{ marginRight: '10px' }}>{tab.icon}</span> {tab.title}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, padding: '40px', overflowY: 'auto', color: '#fff' }}>
            <h3 style={{ color: '#00ffcc', borderBottom: '2px solid #00ffcc', paddingBottom: '10px', marginBottom: '25px' }}>
              {currentTab.title}
            </h3>
            {currentTab.content.map((block, i) => (
              <div key={i} style={{ marginBottom: '25px' }}>
                {block.type === 'text' && <p style={{ lineHeight: '1.6', color: '#ccc' }}>{block.body}</p>}
                {block.type === 'stats' && block.items.map((item, j) => (
                  <div key={j} style={{ marginBottom: '15px' }}>
                    <div style={{ color: '#00ffcc', fontWeight: 'bold' }}>• {item.label}</div>
                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{item.desc}</div>
                  </div>
                ))}
                {block.type === 'steps' && block.items.map((step, j) => (
                  <div key={j} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ color: '#ffaa00', fontWeight: 'bold' }}>[{step.num}]</div>
                    <div>
                      <div style={{ color: '#fff', fontSize: '14px' }}>{step.title}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
                {block.type === 'tip' && (
                  <div style={{ padding: '15px', background: 'rgba(255,170,0,0.05)', border: '1px solid rgba(255,170,0,0.3)', color: '#ffaa00', fontSize: '13px' }}>
                    {block.body}
                  </div>
                )}
                {block.type === 'table' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr>{block.headers.map((h, j) => <th key={j} style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #333', color: '#5a7878' }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, j) => (
                        <tr key={j}>{row.map((cell, k) => <td key={k} style={{ padding: '10px', borderBottom: '1px solid #222' }}>{cell}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
