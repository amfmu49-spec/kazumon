import React from 'react';

export default function BottomNav({ onNavigate, currentScreen }) {
  return (
    <div className="wood-panel bottom-nav" style={{ borderRadius: '0', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      
      <div className={`nav-item ${currentScreen === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
        <div className="nav-icon">🏠</div>
        ホーム
      </div>
      
      <div className={`nav-item ${currentScreen === 'party' ? 'active' : ''}`} onClick={() => onNavigate('party')}>
        <div className="nav-icon">⚔️</div>
        そうび
      </div>
      
      {/* Center Big Battle Button */}
      <div 
        className="nav-item" 
        onClick={() => onNavigate('battle')}
        style={{ position: 'relative', top: '-15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div 
          className="anim-pulse flex-center" 
          style={{ 
            width: '60px', height: '60px', 
            borderRadius: '50%', 
            background: 'linear-gradient(to bottom, #FF6B6B, #C92A2A)',
            boxShadow: '0 5px 15px rgba(201, 42, 42, 0.6), inset 0 2px 5px rgba(255,255,255,0.5)',
            border: '3px solid #FFF',
            fontSize: '1.8rem',
            marginBottom: '5px'
          }}
        >
          ✏️
        </div>
        <span style={{ fontWeight: 'bold', color: '#FF6B6B', textShadow: '1px 1px 0 #FFF' }}>バトル</span>
      </div>

      <div className={`nav-item ${currentScreen === 'gacha' ? 'active' : ''}`} onClick={() => onNavigate('gacha')}>
        <div className="nav-icon">🎲</div>
        ガチャ
      </div>
      
      <div className={`nav-item ${currentScreen === 'shop' ? 'active' : ''}`} onClick={() => onNavigate('shop')}>
        <div className="nav-icon">🏪</div>
        ショップ
      </div>
    </div>
  );
}
