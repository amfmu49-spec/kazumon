import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo_transparent.png';
import { ENEMIES_DATA } from '../utils/enemies';

export default function OpeningScreen({ onStart }) {
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [monsters, setMonsters] = useState([]);

  useEffect(() => {
    // ランダムに3体のモンスターを選ぶ
    const arr = [...ENEMIES_DATA.normal].sort(() => Math.random() - 0.5).slice(0, 3);
    setMonsters(arr);
  }, []);

  // 音声初期化前の黒画面
  if (!isAudioInitialized) {
    return (
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF', cursor: 'pointer', zIndex: 9999 }}
        onClick={() => {
          import('../utils/audio').then(({ audioController }) => {
            audioController.init();
            audioController.playBGM('opening');
            setIsAudioInitialized(true);
          });
        }}
      >
        <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>※BGM・効果音が鳴ります</p>
        <p className="anim-blink" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F1C40F' }}>タップして開始</p>
      </div>
    );
  }

  // 実際のオープニング画面（タイトル画面）
  return (
    <div 
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', cursor: 'pointer' }}
      onClick={onStart}
    >
      
      {/* Title Logo */}
      <div className="anim-float" style={{ position: 'absolute', top: '10%', left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <img src={logoImg} alt="数モン" style={{ width: '90%', maxWidth: '500px', maxHeight: '40vh', objectFit: 'contain', filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.8))' }} />
      </div>

      {/* Touch to start */}
      <div className="anim-blink" style={{ position: 'absolute', bottom: '40%', left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <p style={{ 
          fontSize: '2.5rem', 
          fontWeight: '900', 
          color: '#F9E79F',
          textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
          margin: 0
        }}>
          画面をタッチ！
        </p>
      </div>

      {/* Monsters Background */}
      <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 20px', zIndex: 5 }}>
        {monsters.map((m, idx) => (
          <img 
            key={idx}
            src={m.img} 
            className="anim-float" 
            alt={m.name} 
            style={{ 
              width: idx === 1 ? '120px' : '100px', 
              height: idx === 1 ? '120px' : '100px', 
              objectFit: 'contain', 
              filter: `drop-shadow(0 10px 10px rgba(0,0,0,0.5)) ${m.filter || ''}`, 
              animationDelay: `${0.5 * (idx + 1)}s` 
            }} 
          />
        ))}
      </div>
    </div>
  );
}
