import React from 'react';

export default function SugorokuMap({ progress, onNodeClick }) {
  const TOTAL_NODES = 15;
  
  // 15マスの配置（ジグザグに進む）
  // 1  2  3  4  5
  // 10 9  8  7  6
  // 11 12 13 14 15
  const layout = [
    [1, 2, 3, 4, 5],
    [10, 9, 8, 7, 6],
    [11, 12, 13, 14, 15]
  ];

  const getNodeType = (num) => {
    if (num <= 3) return 'review'; // 1-3 復習
    if (num <= 10) return 'normal'; // 4-10 通常
    return 'boss'; // 11-15 ボス
  };

  const getNodeColor = (type, isCleared, isCurrent) => {
    if (isCleared) return '#F1C40F'; // クリア済: ゴールド
    if (isCurrent) return '#FFF';    // 現在地: 白
    if (type === 'review') return '#3498DB'; // 青
    if (type === 'boss') return '#E74C3C'; // 赤
    return '#2ECC71'; // 緑（通常）
  };

  const getIcon = (type, isCleared) => {
    if (isCleared) return '⭐';
    if (type === 'review') return '📖';
    if (type === 'boss') return '💀';
    return '⚔️';
  };

  const currentNode = Math.min(progress + 1, TOTAL_NODES);
  const isCompleted = progress >= TOTAL_NODES;

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '350px', 
      background: 'rgba(0,0,0,0.5)', 
      borderRadius: '15px', 
      padding: '20px 10px',
      position: 'relative'
    }}>
      <h3 style={{ color: '#FFF', textAlign: 'center', margin: '0 0 15px 0', textShadow: '1px 1px 2px #000' }}>
        今日のクエスト ({Math.min(progress, TOTAL_NODES)}/{TOTAL_NODES})
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'space-around', position: 'relative' }}>
            
            {/* 経路の線 */}
            <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '4px', background: '#555', zIndex: 0, transform: 'translateY(-50%)' }} />
            
            {row.map((nodeNum, colIndex) => {
              const type = getNodeType(nodeNum);
              const isCleared = nodeNum <= progress;
              const isCurrent = nodeNum === currentNode && !isCompleted;
              const bgColor = getNodeColor(type, isCleared, isCurrent);
              
              return (
                <div 
                  key={nodeNum}
                  onClick={() => {
                    if (isCurrent) onNodeClick(type);
                  }}
                  className={isCurrent ? 'anim-pulse' : ''}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    background: bgColor,
                    border: isCurrent ? '4px solid #F1C40F' : '3px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    cursor: isCurrent ? 'pointer' : 'default',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
                    opacity: nodeNum > currentNode ? 0.7 : 1,
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{getIcon(type, isCleared)}</span>
                  
                  {/* ノード番号 */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    fontSize: '0.7rem', 
                    color: '#FFF', 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 1px #000'
                  }}>
                    {nodeNum}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* 行を繋ぐ縦線 (左端と右端) */}
      <div style={{ position: 'absolute', right: '36px', top: '70px', width: '4px', height: '40px', background: '#555' }} />
      <div style={{ position: 'absolute', left: '36px', top: '130px', width: '4px', height: '40px', background: '#555' }} />
      
      {isCompleted && (
        <div className="anim-bounce text-center" style={{ marginTop: '20px', color: '#F1C40F', fontWeight: 'bold', fontSize: '1.2rem', textShadow: '1px 1px 2px #000' }}>
          🎉 今日のクエスト全クリア！ 🎉
        </div>
      )}
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-green" onClick={() => onNodeClick('okawari')} style={{ padding: '8px 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🍚</span> おかわり（3問）
        </button>
      </div>
    </div>
  );
}
