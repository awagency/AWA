import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ progress = 0, isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <h2 className="loading-title">Apolo Web Agency</h2>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
        <p className="loading-text">{Math.round(progress * 100)}% Cargado</p>
      </div>
    </div>
  );
};

export default LoadingScreen;