import React, { useState, useEffect } from 'react';

const GPS_LOCATIONS = [
  { name: "Jeju Airport",        lat: 33.5121,    lng: 126.4925    },
  { name: "SJA",                 lat: 33.3006,    lng: 126.2737    },
  { name: "Seongsan Ilchulbong", lat: 33.4585,    lng: 126.9420    },
  { name: "Sanbangsan",          lat: 33.24167,   lng: 126.31306   },
  { name: "Jeju Folk Village",   lat: 33.32,      lng: 126.83      },
  { name: "Hallasan",            lat: 33.36167,   lng: 126.52917   },
  { name: "Hyeopjae Beach",      lat: 33.393452,  lng: 126.2396345 },
  { name: "Woljeongri Beach",    lat: 33.5625,    lng: 126.7911    },
];

const GPS_ROUTES = [
  { id: 1,  from: "Jeju Airport",   to: "Hallasan",            distanceKm: 28, estimatedTimeMin: 45 },
  { id: 2,  from: "Jeju Airport",   to: "Hyeopjae Beach",      distanceKm: 35, estimatedTimeMin: 50 },
  { id: 4,  from: "Jeju Airport",   to: "Seongsan Ilchulbong", distanceKm: 42, estimatedTimeMin: 60 },
  { id: 5,  from: "Jeju Airport",   to: "Sanbangsan",          distanceKm: 38, estimatedTimeMin: 55 },
  { id: 6,  from: "Jeju Airport",   to: "Jeju Folk Village",   distanceKm: 41, estimatedTimeMin: 58 },
  { id: 7,  from: "SJA",            to: "Sanbangsan",          distanceKm: 10, estimatedTimeMin: 18 },
  { id: 8,  from: "SJA",            to: "Hallasan",            distanceKm: 30, estimatedTimeMin: 45 },
  { id: 9,  from: "Hallasan",       to: "Seongsan Ilchulbong", distanceKm: 47, estimatedTimeMin: 70 },
  { id: 10, from: "Sanbangsan",     to: "Hyeopjae Beach",      distanceKm: 22, estimatedTimeMin: 35 },
  { id: 13, from: "Hyeopjae Beach", to: "Hallasan",            distanceKm: 31, estimatedTimeMin: 50 },
  { id: 14, from: "Hallasan",       to: "Jeju Folk Village",   distanceKm: 29, estimatedTimeMin: 42 },
  { id: 16, from: "SJA",            to: "Jeju Airport",        distanceKm: 27, estimatedTimeMin: 40 },
  { id: 17, from: "Jeju Airport",   to: "SJA",                 distanceKm: 27, estimatedTimeMin: 38 },
];

const ENERGY_DATA = [
  { date: "05/17", capacity: 2162.81, supply: 1129.93, peak: 735.92, reserve: 394.01, reserveRate: 53.54 },
  { date: "05/16", capacity: 2162.81, supply: 1090.94, peak: 728.60, reserve: 362.34, reserveRate: 49.73 },
  { date: "05/15", capacity: 2162.81, supply: 1070.27, peak: 753.33, reserve: 316.94, reserveRate: 42.07 },
  { date: "05/14", capacity: 2162.81, supply: 1153.93, peak: 746.67, reserve: 407.26, reserveRate: 54.54 },
  { date: "05/13", capacity: 2162.81, supply: 1142.01, peak: 748.78, reserve: 393.23, reserveRate: 52.52 },
  { date: "05/12", capacity: 2162.81, supply: 1082.99, peak: 751.55, reserve: 331.44, reserveRate: 44.10 },
  { date: "05/11", capacity: 2162.81, supply: 1111.62, peak: 733.02, reserve: 378.60, reserveRate: 51.65 },
  { date: "05/10", capacity: 2162.81, supply: 1236.03, peak: 712.88, reserve: 523.16, reserveRate: 73.39 },
  { date: "05/09", capacity: 2162.81, supply: 1081.75, peak: 751.40, reserve: 330.35, reserveRate: 43.96 },
];

const WEATHER_DATA = [
  { date: "05/18", amTemp: 17, amCond: "☀ Clear",  amRain: 20, pmTemp: 27, pmCond: "☀ Clear",  pmRain: 20 },
  { date: "05/19", amTemp: 17, amCond: "☀ Clear",  amRain: 20, pmTemp: 25, pmCond: "☁ Cloudy", pmRain: 30 },
  { date: "05/20", amTemp: 19, amCond: "☁ Cloudy", amRain: 30, pmTemp: 23, pmCond: "🌧 Rain",  pmRain: 60 },
  { date: "05/21", amTemp: 20, amCond: "🌧 Rain",  amRain: 60, pmTemp: 22, pmCond: "🌧 Rain",  pmRain: 60 },
  { date: "05/22", amTemp: 16, amCond: "☀ Clear",  amRain: 20, pmTemp: 22, pmCond: "☀ Clear",  pmRain: 20 },
  { date: "05/23", amTemp: 18, amCond: "🌧 Rain",  amRain: 60, pmTemp: 23, pmCond: "🌧 Rain",  pmRain: 60 },
  { date: "05/24", amTemp: 17, amCond: "☀ Clear",  amRain: 10, pmTemp: 24, pmCond: "☀ Clear",  pmRain: 10 },
  { date: "05/25", amTemp: 17, amCond: "☀ Clear",  amRain: 20, pmTemp: 25, pmCond: "☀ Clear",  pmRain: 20 },
  { date: "05/26", amTemp: 18, amCond: "🌧 Rain",  amRain: 60, pmTemp: 25, pmCond: "🌧 Rain",  pmRain: 60 },
  { date: "05/27", amTemp: 17, amCond: "☀ Clear",  amRain: 20, pmTemp: 23, pmCond: "☀ Clear",  pmRain: 20 },
  { date: "05/28", amTemp: 17, amCond: "☀ Clear",  amRain: 20, pmTemp: 23, pmCond: "☀ Clear",  pmRain: 20 },
];

const TABS = [
  { id: 'gps',     label: '◈ GPS / ROUTES' },
  { id: 'energy',  label: '⚡ ENERGY'       },
  { id: 'weather', label: '🌤 WEATHER'      },
];

const TH = ({ children, style = {} }) => (
  <th style={{
    color: '#00ffcc', textAlign: 'left', padding: '8px 12px',
    borderBottom: '2px solid rgba(0,255,204,0.3)',
    fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px',
    ...style,
  }}>{children}</th>
);

const TD = ({ children, color = '#ffffff', style = {} }) => (
  <td style={{
    padding: '8px 12px', color, fontFamily: 'monospace',
    borderBottom: '1px solid rgba(0,255,204,0.06)', ...style,
  }}>{children}</td>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: '11px', fontFamily: 'monospace', color: '#2a5050',
    letterSpacing: '3px', marginBottom: '12px',
  }}>
    {children}
  </div>
);

// ── 탭 콘텐츠 ───────────────────────────────────────────

const GpsTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div>
      <SectionLabel>LANDMARK COORDINATES</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
        {GPS_LOCATIONS.map(loc => (
          <div key={loc.name} style={{
            background: 'rgba(0,255,204,0.03)',
            border: '2px solid rgba(0,255,204,0.15)',
            padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '13px' }}>{loc.name}</span>
            <span style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '11px' }}>
              {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionLabel>ROUTE INDEX</SectionLabel>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <TH>ID</TH>
            <TH>FROM</TH>
            <TH>TO</TH>
            <TH>DISTANCE</TH>
            <TH>EST. TIME</TH>
          </tr>
        </thead>
        <tbody>
          {GPS_ROUTES.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? 'rgba(0,255,204,0.02)' : 'transparent' }}>
              <TD color="#ffffff">#{r.id}</TD>
              <TD color="#ffffff">{r.from}</TD>
              <TD color="#ffffff">{r.to}</TD>
              <TD color="#ffffff">{r.distanceKm} km</TD>
              <TD color="#ffffff">{r.estimatedTimeMin} min</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EnergyTab = () => (
  <div>
    <SectionLabel>JEJU GRID — DAILY ENERGY LOG (MW)</SectionLabel>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          <TH>DATE</TH>
          <TH>CAPACITY</TH>
          <TH>SUPPLY</TH>
          <TH>PEAK LOAD</TH>
          <TH>RESERVE</TH>
          <TH>RESERVE %</TH>
        </tr>
      </thead>
      <tbody>
        {ENERGY_DATA.map((row, i) => (
          <tr key={row.date} style={{ background: i % 2 === 0 ? 'rgba(0,255,204,0.02)' : 'transparent' }}>
            <TD color="#ffffff">{row.date}</TD>
            <TD color="#ffffff">{row.capacity}</TD>
            <TD color="#ffffff">{row.supply}</TD>
            <TD color="#ffffff">{row.peak}</TD>
            <TD color="#ffffff">{row.reserve}</TD>
            <TD color="#ffffff" style={{ fontWeight: 'bold' }}>{row.reserveRate}%</TD>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const WeatherTab = () => (
  <div>
    <SectionLabel>JEJU WEATHER LOG — MAY 2026</SectionLabel>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr>
          <th rowSpan={2} style={{
            color: '#00ffcc', textAlign: 'left', padding: '8px 12px',
            borderBottom: '2px solid rgba(0,255,204,0.3)',
            fontFamily: 'monospace', fontSize: '11px', verticalAlign: 'bottom',
          }}>DATE</th>
          <th colSpan={3} style={{ color: '#ffaa00', textAlign: 'center', padding: '6px 12px', borderBottom: '1px solid rgba(255,170,0,0.2)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px' }}>MORNING</th>
          <th colSpan={3} style={{ color: '#66aaff', textAlign: 'center', padding: '6px 12px', borderBottom: '1px solid rgba(102,170,255,0.2)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px' }}>AFTERNOON</th>
        </tr>
        <tr>
          {['TEMP','COND','RAIN%','TEMP','COND','RAIN%'].map((h, i) => (
            <th key={i} style={{
              color: i < 3 ? '#ffaa0088' : '#66aaff88',
              textAlign: 'left', padding: '6px 12px',
              borderBottom: '2px solid rgba(0,255,204,0.3)',
              fontFamily: 'monospace', fontSize: '10px',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {WEATHER_DATA.map((row, i) => (
          <tr key={row.date} style={{ background: i % 2 === 0 ? 'rgba(0,255,204,0.02)' : 'transparent' }}>
            <TD style={{ fontWeight: 'bold', color: '#ffffff' }}>{row.date}</TD>
            <TD color="#ffffff">{row.amTemp}°</TD>
            <TD color="#ffffff" style={{ fontSize: '12px' }}>{row.amCond}</TD>
            <TD color="#ffffff" style={{ fontWeight: 'bold' }}>{row.amRain}%</TD>
            <TD color="#ffffff">{row.pmTemp}°</TD>
            <TD color="#ffffff" style={{ fontSize: '12px' }}>{row.pmCond}</TD>
            <TD color="#ffffff" style={{ fontWeight: 'bold' }}>{row.pmRain}%</TD>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── 메인 모달 ────────────────────────────────────────────
const LoadDataModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('gps');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setVisible(true), 10);
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '900px', maxWidth: '95vw',
          height: '620px', maxHeight: '90vh',
          background: '#050e0e',
          border: '2px solid rgba(0,255,204,0.4)',
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 0 60px rgba(0,255,204,0.08)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* 스캔라인 */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.012) 2px, rgba(0,255,204,0.012) 4px)',
        }} />

        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '2px solid rgba(0,255,204,0.3)',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#00ffcc', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '3px' }}>SYS</span>
            <div style={{ width: '1px', height: '16px', background: '#00ffcc44' }} />
            <h2 style={{ margin: 0, color: '#00ffcc', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '4px', fontWeight: 'normal' }}>
              JEJU CITY — RAW DATA ARCHIVE
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '2px solid #ff333344',
              color: '#ff6666', cursor: 'pointer', padding: '6px 14px',
              fontSize: '12px', fontFamily: 'monospace', letterSpacing: '1px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff333322'; e.currentTarget.style.borderColor = '#ff3333'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#ff333344'; }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* 탭 */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid rgba(0,255,204,0.2)',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 28px',
                background: activeTab === tab.id ? 'rgba(0,255,204,0.1)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #00ffcc' : '2px solid transparent',
                marginBottom: '-2px',
                color: activeTab === tab.id ? '#00ffcc' : '#3a6060',
                fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '24px',
          position: 'relative', zIndex: 1,
          scrollbarWidth: 'thin', scrollbarColor: '#00ffcc22 transparent',
        }}>
          {activeTab === 'gps'     && <GpsTab />}
          {activeTab === 'energy'  && <EnergyTab />}
          {activeTab === 'weather' && <WeatherTab />}
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '10px 24px',
          borderTop: '2px solid rgba(0,255,204,0.2)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', zIndex: 1, flexShrink: 0,
        }}>
          <span style={{ color: '#2a5050', fontSize: '11px', fontFamily: 'monospace' }}>
            SOURCE: JEJU SMART CITY DATASET · MAY 2026
          </span>
          <span style={{ color: '#2a5050', fontSize: '11px', fontFamily: 'monospace' }}>
            TRAFFIC DATA: RANDOMIZED (NO PUBLIC ACCESS)
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadDataModal;