import React from 'react'
import './LoadingScreen.css'

const LoadingScreen = ({ isVisible = true }) => {
  if (!isVisible) return null

  return (
    <div className="loading-screen">
      <h1 className="loading-title">Apolo Web Agency</h1>
    </div>
  )
}

export default LoadingScreen
