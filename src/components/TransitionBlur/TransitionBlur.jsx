import React, { useState, useEffect } from 'react';
import './TransitionBlur.css';

export const TransitionBlur = ({ isTransitioning }) => {
  return (
    <div className={`transition-blur ${isTransitioning ? 'active' : ''}`} />
  );
};