import React, { useState, useEffect } from 'react';
import SugorokuMap from './SugorokuMap';

export default function HomeScreen({ gameStateHook, onNavigate }) {
  const { gameState } = gameStateHook;
  const [showLoginBonus, setShowLoginBonus] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (gameState.loginBonusClaimedDate !== today) {
      setShowLoginBonus(true);
    }
  }, [gameState.loginBonusClaimedDate]);

  const handleClaimBonus = () => {
    gameStateHook.claimLoginBonus();
    setShowLoginBonus(false);
    onNavigate('calendar');
  };

  return (
    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      
      {/* Top Status Bar */}
      <div className="wood-panel status-bar">
        {/* Left Side (Stamina & Settings) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div className="status-item" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            <span style={{ color: '#FF6B6B', marginRight: '3px' }}>❤️</span>
            <span style={{ fontSize: '0.6rem', marginRight: '3px' }}>やる気</span>
            MAX
          </div>
          <div 
            className="status-item anim-pulse" 
            style={{ fontSize: '0.7rem', padding: '2px 8px', cursor: 'pointer', background: '#333', justifyContent: 'center' }}
            onClick={() => onNavigate('setting')}
          >
            ⚙️ せってい
          </div>
        </div>

        {/* Right Side (Gold & Jewels) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'flex-end' }}>
          <div className="status-item" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            <span style={{ color: '#F4D03F', marginRight: '3px' }}>💰</span>
            <span style={{ fontSize: '0.6rem', marginRight: '3px' }}>おかね</span>
            {gameState.coins}
          </div>
          <div className="status-item" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
            <span style={{ color: '#85C1E9', marginRight: '3px' }}>💎</span>
            <span style={{ fontSize: '0.6rem', marginRight: '3px' }}>ジュエル</span>
            0
          </div>
        </div>
      </div>

      {/* Center Rank Badge */}
      <div className="rank-badge">
        <div style={{ fontSize: '0.9rem', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>ランク</div>
        <div style={{ fontSize: '2rem', lineHeight: '1' }}>{gameState.level}</div>
      </div>

      {/* Main Action Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Training Mode Banner */}
        <div style={{ position: 'absolute', top: '5%', width: '80%', zIndex: 10 }}>
          <button 
            className="btn anim-pulse" 
            style={{ width: '100%', padding: '10px', background: 'linear-gradient(to right, #E67E22, #D35400)', border: '2px solid #F1C40F', boxShadow: '0 5px 15px rgba(230,126,34,0.5)', fontSize: '1.1rem' }}
            onClick={() => onNavigate('battle_training')}
          >
            🔥 修行モード（2分間アタック）
          </button>
        </div>

        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SugorokuMap 
            progress={gameState.todayClearedCount} 
            onNodeClick={(type) => {
              // type can be 'review', 'normal', 'boss'
              // We pass the type to App.jsx via onNavigate, so App knows what mode to start
              onNavigate(`battle_${type}`);
            }} 
          />
        </div>

        {/* History Button (Left) */}
        <div 
          className="btn-small red anim-float" 
          style={{ position: 'absolute', bottom: '15%', left: '5%', animationDelay: '1s' }}
          onClick={() => onNavigate('history')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>きろく</span>
            <span style={{ fontSize: '1.5rem', color: '#FFF3E0', lineHeight: 1 }}>📖</span>
          </div>
        </div>

        {/* Calendar Button (Right) */}
        <div 
          className="btn-small green anim-float" 
          style={{ position: 'absolute', bottom: '15%', right: '5%', animationDelay: '2s' }}
          onClick={() => onNavigate('calendar')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>カレンダー</span>
            <span style={{ fontSize: '1.5rem', color: '#FFF3E0', lineHeight: 1 }}>📅</span>
          </div>
        </div>

      </div>

      {/* Login Bonus Modal */}
      {showLoginBonus && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="wood-panel anim-fade-in" style={{ padding: '20px', textAlign: 'center', width: '80%', maxWidth: '300px' }}>
            <h2 style={{ color: '#F1C40F', marginBottom: '10px' }}>🎁 ログインボーナス！</h2>
            <p style={{ fontSize: '1rem', marginBottom: '20px' }}>今日も遊びにきてくれてありがとう！<br/>プレゼントを受け取ってね！</p>
            <div className="anim-pulse" style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
            <p style={{ color: '#F4D03F', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>50 コイン ゲット！</p>
            <button className="btn" onClick={handleClaimBonus} style={{ width: '100%' }}>
              うけとる！
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
