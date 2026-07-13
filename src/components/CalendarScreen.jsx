import React, { useState } from 'react';
import { audioController } from '../utils/audio';

const STICKERS = [
  { id: 's1', icon: '🌟' },
  { id: 's2', icon: '🍎' },
  { id: 's3', icon: '🐶' },
  { id: 's4', icon: '🚀' },
  { id: 's5', icon: '🌸' }
];

export default function CalendarScreen({ gameStateHook, onBack }) {
  const { gameState, setCalendarSticker } = gameStateHook;
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0].id);

  // カレンダーの生成 (今月分)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleStick = (day) => {
    if (!day) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 過去の日付や今日の日付なら貼れるようにする
    if (day <= today.getDate()) {
      audioController.playSE('click');
      setCalendarSticker(dateStr, selectedSticker);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
        <button className="btn btn-red" onClick={() => { audioController.playSE('click'); onBack(); }}>戻る</button>
        <div className="wood-panel" style={{ padding: '8px 16px', borderRadius: '99px' }}>
          ログインボーナス
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        <h2 style={{ color: '#FFF', textAlign: 'center', marginBottom: '10px' }}>
          {year}年 {month + 1}月
        </h2>

        {/* Sticker Selection */}
        <div className="wood-panel" style={{ marginBottom: '20px', padding: '15px' }}>
          <div style={{ color: '#F9E79F', marginBottom: '10px', textAlign: 'center' }}>貼るシールをえらぼう！</div>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {STICKERS.map(s => (
              <div 
                key={s.id}
                onClick={() => { audioController.playSE('click'); setSelectedSticker(s.id); }}
                style={{
                  width: '40px', height: '40px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selectedSticker === s.id ? '#FFF' : 'transparent',
                  borderRadius: '50%', cursor: 'pointer', transition: 'background 0.2s'
                }}
              >
                {s.icon}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div style={{ background: '#FFF', borderRadius: '10px', padding: '10px', color: '#000' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
            <div style={{ color: 'red' }}>日</div><div>月</div><div>火</div><div>水</div><div>木</div><div>金</div><div style={{ color: 'blue' }}>土</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
            {days.map((day, idx) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const hasStickerId = dateStr ? gameState.calendarStickers[dateStr] : null;
              const sticker = STICKERS.find(s => s.id === hasStickerId);
              
              const isToday = day === today.getDate();
              const isPast = day && day <= today.getDate();

              return (
                <div 
                  key={idx} 
                  onClick={() => handleStick(day)}
                  style={{
                    height: '50px', 
                    border: '1px solid #EEE', 
                    borderRadius: '5px',
                    background: isToday ? '#FFF8E7' : (day ? '#FAFAFA' : 'transparent'),
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: isPast ? 'pointer' : 'default',
                    position: 'relative'
                  }}
                >
                  {day && <span style={{ fontSize: '0.8rem', color: isToday ? '#E74C3C' : '#555', fontWeight: isToday ? 'bold' : 'normal' }}>{day}</span>}
                  
                  {sticker && (
                    <div className="anim-pop" style={{ fontSize: '1.5rem', position: 'absolute', top: '50%', transform: 'translateY(-40%)' }}>
                      {sticker.icon}
                    </div>
                  )}
                  {isToday && !sticker && (
                    <div className="anim-blink" style={{ fontSize: '0.6rem', color: '#E74C3C', position: 'absolute', bottom: '2px' }}>
                      Tap!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
