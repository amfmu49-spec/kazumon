import React, { useState } from 'react';
import { audioController } from '../utils/audio';

const gachaItems = [
  { name: 'ひのきの棒', power: 1, icon: '🪵', rarity: 'N' },
  { name: 'どうのつるぎ', power: 3, icon: '🗡️', rarity: 'R' },
  { name: 'はがねの剣', power: 5, icon: '⚔️', rarity: 'SR' },
  { name: '勇者の剣', power: 10, icon: '✨', rarity: 'SSR' },
];

export default function GachaScreen({ gameStateHook }) {
  const { gameState, updateState, addCoin } = gameStateHook;
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [flashClass, setFlashClass] = useState('');

  const drawGacha = () => {
    if (gameState.coins < 100) {
      alert('100コイン必要だよ！');
      return;
    }
    
    setAnimating(true);
    addCoin(-100);
    setResult(null);
    setFlashClass('');

    // 回転中の音
    audioController.playSE('swing');
    let tickCount = 0;
    const shakeInterval = setInterval(() => {
      tickCount++;
      if (tickCount % 2 === 0) audioController.playSE('click');
    }, 200);

    setTimeout(() => {
      clearInterval(shakeInterval);
      
      // 確率設定 (SSR: 5%, SR: 15%, R: 40%, N: 40%)
      const rand = Math.random();
      let itemBase;
      if (rand > 0.95) itemBase = gachaItems[3]; // SSR
      else if (rand > 0.8) itemBase = gachaItems[2]; // SR
      else if (rand > 0.4) itemBase = gachaItems[1]; // R
      else itemBase = gachaItems[0]; // N

      const newItem = {
        ...itemBase,
        id: Date.now() + Math.random().toString()
      };

      updateState({ equipment: [...gameState.equipment, newItem] });
      setResult(newItem);
      setAnimating(false);
      
      // レア度に応じたフラッシュ＆サウンド演出
      if (itemBase.rarity === 'SSR') {
        setFlashClass('gacha-flash-ssr');
        audioController.playSE('levelUp');
        setTimeout(() => audioController.playSE('levelUp'), 300);
      } else if (itemBase.rarity === 'SR') {
        setFlashClass('gacha-flash-sr');
        audioController.playSE('levelUp');
      } else if (itemBase.rarity === 'R') {
        setFlashClass('gacha-flash-r');
        audioController.playSE('click');
      } else {
        setFlashClass('');
        audioController.playSE('click');
      }

      // 数秒後にフラッシュを消す
      setTimeout(() => setFlashClass(''), 2000);
    }, 2500); // 演出時間は2.5秒
  };

  const getCardStyle = (rarity) => {
    switch(rarity) {
      case 'SSR':
        return {
          background: 'linear-gradient(135deg, #FFD700, #FF8C00, #FF0080, #8A2BE2)',
          border: '4px solid #FFF',
          boxShadow: '0 0 30px #FFD700, inset 0 0 20px rgba(255,255,255,0.8)',
          animation: 'ssrFloat 2s ease-in-out infinite'
        };
      case 'SR':
        return {
          background: 'linear-gradient(135deg, #F1C40F, #E67E22)',
          border: '3px solid #FFF',
          boxShadow: '0 0 15px #F1C40F'
        };
      case 'R':
        return {
          background: 'linear-gradient(135deg, #BDC3C7, #95A5A6)',
          border: '2px solid #FFF'
        };
      default:
        return {
          background: '#8D6E63',
          border: '2px solid #5D4037'
        };
    }
  };

  return (
    <div className={`app-container bg-forest ${flashClass}`} style={{ padding: '20px', display: 'flex', flexDirection: 'column', paddingBottom: '80px', position: 'relative' }}>
      
      <style>{`
        .gacha-flash-ssr {
          animation: bgFlashSSR 1.5s ease-out;
        }
        .gacha-flash-sr {
          animation: bgFlashSR 1s ease-out;
        }
        .gacha-flash-r {
          animation: bgFlashR 0.5s ease-out;
        }

        @keyframes bgFlashSSR {
          0% { background-color: #FFF; }
          10% { background-color: #FF0080; }
          20% { background-color: #FFD700; transform: translate(5px, 5px); }
          30% { background-color: #00FF00; transform: translate(-5px, -5px); }
          40% { background-color: #00FFFF; transform: translate(5px, -5px); }
          50% { background-color: #FF00FF; transform: translate(-5px, 5px); }
          100% { background-color: transparent; transform: translate(0, 0); }
        }
        @keyframes bgFlashSR {
          0% { background-color: #FFF; }
          20% { background-color: #FFD700; }
          100% { background-color: transparent; }
        }
        @keyframes bgFlashR {
          0% { background-color: #FFF; }
          100% { background-color: transparent; }
        }
        
        .box-shake {
          animation: boxShakeAnim 0.1s infinite;
        }
        @keyframes boxShakeAnim {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5px, -5px) rotate(5deg); }
          50% { transform: translate(-5px, 5px) rotate(-5deg); }
          75% { transform: translate(-5px, -5px) rotate(5deg); }
          100% { transform: translate(5px, 5px) rotate(-5deg); }
        }

        @keyframes ssrFloat {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        
        .light-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200vw;
          height: 200vw;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.8) 10deg, transparent 20deg, rgba(255,255,255,0.8) 30deg, transparent 40deg, rgba(255,255,255,0.8) 50deg, transparent 60deg);
          animation: spinRay 10s linear infinite;
          transform-origin: center center;
          margin-top: -100vw;
          margin-left: -100vw;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }
        @keyframes spinRay {
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* 画面奥の光エフェクト（SSR/SRのときのみ） */}
      {result && (result.rarity === 'SSR' || result.rarity === 'SR') && <div className="light-ray" />}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', zIndex: 10 }}>
        <div className="wood-panel" style={{ padding: '8px 16px', borderRadius: '99px' }}>
          💰 {gameState.coins}
        </div>
      </div>

      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', zIndex: 10 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', textShadow: '2px 2px 4px #000' }}>プレミアムガチャ</h2>
        
        {/* ガチャ箱の表示 */}
        <div className={animating ? 'box-shake' : 'anim-float'} style={{ fontSize: animating ? '8rem' : '6rem', marginBottom: '30px', textShadow: '0 10px 10px rgba(0,0,0,0.5)', transition: 'font-size 0.3s' }}>
          {animating ? '🎁' : result ? '🎉' : '🎁'}
        </div>

        {/* 結果カードの表示 */}
        {result && !animating && (
          <div className="wood-panel anim-fade-in text-center" style={{ 
            padding: '20px', 
            marginBottom: '30px', 
            width: '85%', 
            maxWidth: '300px',
            ...getCardStyle(result.rarity)
          }}>
            <div style={{ color: '#FFF', fontWeight: '900', fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', fontStyle: 'italic' }}>
              {result.rarity === 'SSR' ? '👑 超大当たり 👑' : result.rarity === 'SR' ? '⭐ 大当たり ⭐' : result.rarity}
            </div>
            <div style={{ fontSize: result.rarity === 'SSR' ? '4.5rem' : '3.5rem', margin: '10px 0', filter: 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))' }}>
              {result.icon}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', textShadow: '1px 1px 0 #000', color: '#FFF' }}>
              {result.name}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#FFF', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '5px', marginTop: '10px' }}>
              経験値ボーナス +{result.power}
            </div>
          </div>
        )}

        <button 
          className="btn" 
          onClick={drawGacha} 
          disabled={animating}
          style={{ 
            padding: '15px 40px', 
            fontSize: '1.5rem', 
            background: animating ? '#7f8c8d' : 'linear-gradient(to right, #FF0080, #FF8C00)',
            border: '3px solid #FFF',
            boxShadow: '0 5px 15px rgba(255,0,128,0.4)',
            color: '#FFF',
            textShadow: '1px 1px 0 #000'
          }}
        >
          {animating ? '引いているよ...' : 'ガチャを引く (100💰)'}
        </button>
      </div>
    </div>
  );
}
