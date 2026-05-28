import React, { useState, useEffect } from 'react';

const AnswersModal = ({ isOpen, onClose }) => {
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
        background: 'rgba(0,0,0,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '860px', maxWidth: '95vw',
          height: '90vh',
          background: '#050e0e',
          border: '2px solid rgba(0,255,204,0.4)',
          display: 'flex', flexDirection: 'column',
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'transform 0.25s ease',
          boxShadow: '0 0 60px rgba(0,255,204,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* 헤더 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '2px solid rgba(0,255,204,0.3)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#00ffcc', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '3px' }}>SYS</span>
            <div style={{ width: '1px', height: '16px', background: '#00ffcc44' }} />
            <h2 style={{ margin: 0, color: '#00ffcc', fontSize: '15px', fontFamily: 'monospace', letterSpacing: '4px', fontWeight: 'normal' }}>
              ANSWER KEY — AP CALCULUS BC
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

        {/* PDF 뷰어 */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <iframe
            src="/answers/Answers.pdf"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#fff',
            }}
            title="AP Calculus BC Answers"
          />
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '10px 24px',
          borderTop: '2px solid rgba(0,255,204,0.15)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#2a5050', fontSize: '11px', fontFamily: 'monospace' }}>
            AP CALCULUS BC · MAY 2026
          </span>
          <a
            href="/answers/Answers.pdf"
            download="Answers.pdf"
            style={{
              color: '#00ffcc', fontSize: '11px', fontFamily: 'monospace',
              letterSpacing: '1px', textDecoration: 'none',
              border: '1px solid rgba(0,255,204,0.3)', padding: '4px 12px',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,204,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            ↓ DOWNLOAD
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnswersModal;