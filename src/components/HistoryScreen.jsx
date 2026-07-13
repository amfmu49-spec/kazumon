import React, { useState } from 'react';

const FractionDisplay = ({ fraction }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px', verticalAlign: 'middle', fontSize: '1.2rem', fontWeight: 'bold' }}>
    <div style={{ padding: '0 5px', borderBottom: '2px solid white' }}>{fraction.n}</div>
    <div style={{ padding: '0 5px' }}>{fraction.d}</div>
  </div>
);

export default function HistoryScreen({ gameStateHook, onBack }) {
  const { gameState } = gameStateHook;
  const [selectedDate, setSelectedDate] = useState(null);

  // 1. 今日の履歴があれば一番上に追加
  const today = new Date().toDateString();
  const historyList = [...(gameState.allHistory || [])];
  
  if (gameState.dailyHistory && gameState.dailyHistory.length > 0) {
    const todayIndex = historyList.findIndex(h => h.date === today);
    if (todayIndex > -1) {
      // 既に今日のデータがallHistoryにあればマージするか上書き（通常は無い）
      historyList[todayIndex].history = gameState.dailyHistory;
    } else {
      historyList.unshift({ date: today, history: gameState.dailyHistory });
    }
  }

  const selectedData = historyList.find(h => h.date === selectedDate);

  return (
    <div className="anim-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', paddingBottom: '80px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0, textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>📖 学習の記録</h2>
        <button className="btn btn-side" onClick={selectedDate ? () => setSelectedDate(null) : onBack}>
          もどる
        </button>
      </div>

      {!selectedDate ? (
        <div style={{ flex: 1, overflowY: 'auto' }} className="wood-panel">
          {historyList.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>まだ記録がありません</p>
          ) : (
            historyList.map((item, idx) => {
              const correctCount = item.history.filter(h => h.isCorrect).length;
              return (
                <div 
                  key={idx} 
                  className="wood-panel"
                  style={{ marginBottom: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.4)' }}
                  onClick={() => setSelectedDate(item.date)}
                >
                  <div style={{ fontWeight: 'bold' }}>📅 {item.date}</div>
                  <div>正解数: {correctCount} / {item.history.length}</div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ textShadow: '1px 1px 0 #000' }}>📅 {selectedDate} の結果</h3>
          {selectedData.history.map((h, i) => (
            <div key={i} className="wood-panel" style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>Q{i + 1}.</span>
                <FractionDisplay fraction={h.problem.f1} />
                <span style={{ margin: '0 5px', color: '#F9E79F' }}>{h.problem.operatorStr}</span>
                <FractionDisplay fraction={h.problem.f2} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#ccc' }}>あなたの答え: </span>
                  <FractionDisplay fraction={h.userAns} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: h.isCorrect ? '#2ECC71' : '#E74C3C', textShadow: '1px 1px 0 #000' }}>
                  {h.isCorrect ? '⭕ 正解！' : '❌ ミス'}
                </div>
              </div>
              <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#F9E79F' }}>
                {h.explanation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
