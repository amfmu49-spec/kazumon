import React, { useState } from 'react';
import heroImg from '../assets/hero_basic_transparent.png';

export default function PartyScreen({ gameStateHook }) {
  const { gameState, updateState } = gameStateHook;
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleEquip = (itemId) => {
    updateState({ equipped: itemId });
  };

  const equippedItem = gameState.equipment.find(i => i.id === gameState.equipped);

  return (
    <div className="app-container bg-forest" style={{ padding: '20px', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        <h2 className="text-center" style={{ fontSize: '2rem', marginBottom: '15px', textShadow: '2px 2px 4px #000' }}>そうび</h2>
      </div>

      <div className="wood-panel" style={{ padding: '15px', marginBottom: '20px', flexShrink: 0 }}>
        <h3 style={{ margin: 0, marginBottom: '10px', color: '#F1C40F' }}>現在のそうび</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <div className="anim-float" style={{ 
            width: '160px', height: '160px', 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
            marginBottom: '10px',
            position: 'relative'
          }}>
            <img src={heroImg} alt="Hero Avatar" style={{ width: '140px', height: '140px', objectFit: 'contain' }} />
            {equippedItem && (
              <div className="anim-pulse" style={{ position: 'absolute', top: -10, right: 0, fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}>
                {equippedItem.icon}
              </div>
            )}
          </div>

          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
              <input 
                type="text" 
                value={tempName} 
                onChange={(e) => setTempName(e.target.value)}
                maxLength={8}
                style={{ padding: '5px', borderRadius: '5px', border: 'none', textAlign: 'center', width: '120px' }}
              />
              <button className="btn" style={{ padding: '5px 10px' }} onClick={() => {
                if(tempName.trim()) updateState({ heroName: tempName.trim() });
                setIsEditingName(false);
              }}>OK</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textShadow: '1px 1px 0 #000' }}>{gameState.heroName || 'ゆうしゃ'}</div>
              <button onClick={() => { setTempName(gameState.heroName || 'ゆうしゃ'); setIsEditingName(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✏️</button>
            </div>
          )}
          
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Lv. {gameState.level}</div>
          <div style={{ fontSize: '0.9rem', color: '#ccc' }}>次のレベルまで: {(gameState.level * 10) - gameState.exp} EXP</div>
          
          <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', width: '100%', textAlign: 'center' }}>
            {equippedItem ? (
              <div style={{ fontSize: '1.2rem' }}>
                {equippedItem.icon} {equippedItem.name} <span style={{fontSize:'0.8rem'}}>(ボーナス +{equippedItem.power})</span>
              </div>
            ) : (
              <div style={{ color: '#aaa' }}>なし</div>
            )}
          </div>
        </div>
      </div>

      <h3 style={{ margin: 0, marginBottom: '10px', color: '#F1C40F', textShadow: '1px 1px 2px #000', flexShrink: 0 }}>そうび一覧</h3>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '20px', minHeight: 0 }}>
        {gameState.equipment.length === 0 ? (
          <div className="text-center" style={{ color: '#ccc', marginTop: '20px' }}>
            そうびを持っていません。<br/>ガチャで引いてみよう！
          </div>
        ) : (
          gameState.equipment.map(item => (
            <div key={item.id} className="wood-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name} <span style={{ color: '#F4D03F', fontSize: '0.8rem' }}>★{item.rarity}</span></div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>経験値ボーナス +{item.power}</div>
                </div>
              </div>
              <button 
                className={`btn ${gameState.equipped === item.id ? 'btn-red' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                onClick={() => handleEquip(item.id)}
                disabled={gameState.equipped === item.id}
              >
                {gameState.equipped === item.id ? 'そうび中' : 'そうびする'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
