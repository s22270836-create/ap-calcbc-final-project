import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import missionSystem from '../systems/missionSystem';

const DOMAIN_COLOR = {
  traffic: '#ffaa00',
  energy:  '#00ffcc',
  weather: '#66aaff',
};

const MissionScreen = ({ mission: propMission, onBack }) => {
  const { activeEvent } = useGameStore();
  const [userInput, setUserInput] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const allMissions = missionSystem.getAllMissions();
  const mission = propMission
    || (activeEvent ? allMissions.find((m) => m.unit === activeEvent.relatedUnit) : null)
    || allMissions[0];

  if (!mission) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#050e0e' }}>
        <h1 style={{ color: '#00ffcc', fontFamily: 'monospace' }}>NO ACTIVE MISSION</h1>
        <button className="back-button" onClick={onBack} style={{ marginTop: '20px' }}>RETURN</button>
      </div>
    );
  }

  const domainColor = DOMAIN_COLOR[mission.domain] || '#00ffcc';

  const handleSubmit = () => {
    if (!userInput.trim() || isEvaluated) return;
    const correct = missionSystem.checkAnswer(mission, userInput);
    setIsCorrect(correct);
    setIsEvaluated(true);
    missionSystem.completeMission(mission.id, correct);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050e0e', display: 'flex', flexDirection: 'column' }}>

      {/* 헤더 */}
      <div style={{
        borderBottom: '2px solid rgba(0,255,204,0.5)',
        padding: '16px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#050e0e', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: domainColor, border: `2px solid ${domainColor}88`, padding: '3px 10px', letterSpacing: '1px' }}>
            {mission.domain?.toUpperCase()}
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a6060', letterSpacing: '1px' }}>
            {mission.unit}
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#2a5050' }}>
            #{String(mission.id).padStart(2, '0')}
          </span>
        </div>
        <button className="back-button" onClick={onBack} style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px' }}>
          ← BACK
        </button>
      </div>

      {/* 바디 */}
      <div style={{
        flex: 1, padding: '32px 40px',
        display: 'grid', gridTemplateColumns: '1fr 380px',
        gap: '32px', maxWidth: '1300px', margin: '0 auto', width: '100%', boxSizing: 'border-box',
      }}>

        {/* 왼쪽: 문제 이미지 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#fff',
            border: `2px solid rgba(0,255,204,0.3)`,
            padding: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '320px',
          }}>
            <img
              src={mission.image}
              alt={`Question ${mission.id}`}
              style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* 오른쪽: 답변 패널 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* 미션 정보 */}
          <div style={{ background: 'rgba(0,255,204,0.02)', border: '2px solid rgba(0,255,204,0.25)', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a6060', letterSpacing: '2px', marginBottom: '14px' }}>MISSION BRIEF</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'ID',     value: `#${String(mission.id).padStart(2, '0')}` },
                { label: 'DOMAIN', value: mission.domain?.toUpperCase() },
                { label: 'REWARD', value: `$${mission.reward}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#3a6060', fontFamily: 'monospace' }}>{label}</span>
                  <span style={{ color: '#cceee8', fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 답 입력 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3a6060', letterSpacing: '2px' }}>YOUR ANSWER</div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isEvaluated}
              placeholder="e.g. -3, 25, 5π, 8π, Concave Up..."
              style={{
                background: 'rgba(0,255,204,0.04)',
                border: `1px solid ${isEvaluated ? (isCorrect ? '#00ffcc' : '#ff4444') : 'rgba(0,255,204,0.3)'}`,
                color: '#fff', padding: '14px 18px', fontSize: '15px',
                fontFamily: 'monospace', outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />

            {!isEvaluated ? (
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                style={{
                  padding: '14px',
                  background: userInput.trim() ? domainColor : 'transparent',
                  color: userInput.trim() ? '#000' : '#3a6060',
                  border: `1px solid ${userInput.trim() ? domainColor : '#3a6060'}`,
                  cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'monospace', fontSize: '13px', letterSpacing: '2px', fontWeight: 'bold',
                }}
              >
                SUBMIT
              </button>
            ) : (
              <div style={{
                padding: '16px',
                background: isCorrect ? 'rgba(0,255,204,0.08)' : 'rgba(255,68,68,0.08)',
                border: `2px solid ${isCorrect ? '#00ffcc44' : '#ff444444'}`,
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '22px' }}>{isCorrect ? '✓' : '✗'}</span>
                <div>
                  <div style={{ color: isCorrect ? '#00ffcc' : '#ff6666', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold' }}>
                    {isCorrect ? 'CORRECT' : 'WRONG'}
                  </div>
                  <div style={{ color: '#6a9090', fontSize: '12px', marginTop: '4px', fontFamily: 'monospace' }}>
                    {isCorrect ? `+$${mission.reward} credited.` : `Answer: ${mission.solution}`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 힌트 */}
          <div style={{ background: 'rgba(255,170,0,0.04)', border: '2px solid rgba(255,170,0,0.35)', padding: '14px' }}>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ background: 'transparent', border: 'none', color: '#ffaa00', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '1px', padding: 0, width: '100%', textAlign: 'left' }}
            >
              {showHint ? '▼' : '▶'} ANSWER FORMAT HINT
            </button>
            {showHint && (
              <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#aa8844', lineHeight: '1.6', fontFamily: 'monospace' }}>
                If there are two or more answers, separate them with commas.  <br /><br />
                If the question has parts such as a) and b), write the answers in the format:<br /> a)(answer), b)l(answer).
              </p>
            )}
          </div>

          {/* 돌아가기 */}
          {isEvaluated && (
            <button
              className="menu-button"
              onClick={onBack}
              style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px', borderColor: '#3a6060', color: '#6a9090' }}
            >
              ← RETURN TO MISSIONS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionScreen;