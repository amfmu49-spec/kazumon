import React, { useState } from 'react';
import { audioController } from '../utils/audio';
import { getRandomEquipment } from '../utils/equipment';

export default function ShopScreen({ gameStateHook }) {
  const { gameState, buyItem, addEquipment, updateState } = gameStateHook;

  const handleBuy = (itemType, cost, name) => {
    if (gameState.coins < cost) {
      alert('おかねが足りないよ！');
      return;
    }
    if (buyItem(itemType, cost)) {
      audioController.playSE('powerup'); // Buy sound
      alert(`${name}を買った！`);
    }
  };

  const shopItems = [
    { type: 'potions', name: 'HPポーション', icon: '💊', cost: 10, desc: 'バトル中に使うとHPが回復するよ。' },
    { type: 'hintCards', name: 'ヒントカード', icon: '💡', cost: 15, desc: 'バトル中に使うと解き方のヒントがもらえるよ。' },
    { type: 'choiceCards', name: '3択カード', icon: '🃏', cost: 20, desc: 'バトル中に使うと問題の答えが3択になるよ。' }
  ];


  return (
    <div className="app-container bg-forest" style={{ padding: '20px', display: 'flex', flexDirection: 'column', paddingBottom: '80px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div className="wood-panel" style={{ padding: '8px 16px', borderRadius: '99px' }}>
          💰 {gameState.coins}
        </div>
      </div>

      <h2 className="text-center" style={{ fontSize: '2rem', marginBottom: '20px', textShadow: '2px 2px 4px #000' }}>ショップ</h2>



      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {shopItems.map((item, idx) => (
          <div key={idx} className="wood-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', textShadow: '1px 1px 0 #000' }}>{item.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '2px' }}>{item.desc}</div>
                <div style={{ fontSize: '0.8rem', color: '#F1C40F' }}>所持数: {gameState.items?.[item.type] || 0}</div>
              </div>
            </div>
            <button className="btn" onClick={() => handleBuy(item.type, item.cost, item.name)} style={{ padding: '10px 15px', whiteSpace: 'nowrap' }}>
              {item.cost} 💰
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
