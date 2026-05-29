import React, { useState } from 'react';
import LoadDataModal from './LoadDataModal';
import AnswersModal from './AnswersModal';

export default function MenuScreen({ onStart, onOverview }) {
  const [isDataOpen, setIsDataOpen] = useState(false);
  const [isAnswersOpen, setIsAnswersOpen] = useState(false);

  return (
    <div className="menu-screen">
      <div className="menu-overlay" />

      <div className="menu-content">
        <h1 className="title">JEJU SMART CITY MANAGER</h1>
        <h2 className="subtitle">AP CALCULUS BC FINAL PROJECT (May 2026 ver.)</h2>

        <div className="button-group">
          <button className="menu-button" onClick={onStart}>
            START SIMULATION
          </button>

          <button className="menu-button" onClick={() => setIsAnswersOpen(true)}>
            ANSWERS
          </button>

          <button className="menu-button" onClick={onOverview}>
            CALCULUS OVERVIEW
          </button>

          <button className="menu-button" onClick={() => setIsDataOpen(true)}>
            LOAD DATA
          </button>
        </div>
      </div>

      <LoadDataModal isOpen={isDataOpen} onClose={() => setIsDataOpen(false)} />
      <AnswersModal isOpen={isAnswersOpen} onClose={() => setIsAnswersOpen(false)} />
    </div>
  );
}