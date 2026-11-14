import React from 'react';
import './EnvironmentThemeToggle.css';

interface EnvironmentThemeToggleProps {
  isDay: boolean;
  onToggle: (isDay: boolean) => void;
  className?: string;
}

export function EnvironmentThemeToggle({
  isDay,
  onToggle,
  className = '',
}: EnvironmentThemeToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.target.checked);
  };

  return (
    <div
      className={`env-toggle-scale ${className}`}
      title={isDay ? 'Switch to Candlelit Evening Mode' : 'Switch to Sunlit Morning Harvest'}
    >
      <label className="env-toggle" aria-label="Toggle Day and Night Environment">
        <input
          type="checkbox"
          className="toggle-input"
          checked={isDay}
          onChange={handleChange}
          data-testid="env-toggle-input"
        />

        <div className="sky">
          {/* Stars (Visible at Night / OFF) */}
          <div className="stars">
            <span className="star s1">✦</span>
            <span className="star s2">✦</span>
            <span className="star s3">•</span>
            <span className="star s4">•</span>
            <span className="star s5">✦</span>
            <span className="star s6">•</span>
          </div>

          {/* Clouds (Visible at Day / ON) */}
          <div className="clouds cloud-back">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="clouds cloud-front">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Sun / Moon Knob */}
          <div className="celestial-knob">
            <div className="crater c1"></div>
            <div className="crater c2"></div>
            <div className="crater c3"></div>
          </div>
        </div>
      </label>
    </div>
  );
}
