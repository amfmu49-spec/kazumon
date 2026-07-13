import React, { useEffect } from 'react';
import { audioController } from '../utils/audio';

const FractionText = ({ f }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', fontSize: '1rem', margin: '0 2px' }}>
    <span style={{ borderBottom: '1px solid currentColor', padding: '0 2px' }}>{f.n}</span>
    <span style={{ padding: '0 2px' }}>{f.d}</span>
  </span>
);

export default function ResultsScreen({ gameStateHook, onBack }) {
  const { gameState } = gameStateHook;

  useEffect(() => {
    // リザルト画面専用のファンファーレなどを鳴らす
    audioController.playSE('levelUp'); // 仮にレベルアップ音を使用
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', color: '#FFF', background: 'rgba(0,0,0,0.8)' }}>
      <h2 style={{ textAlign: 'center', color: '#F1C40F', textShadow: '2px 2px 0 #000' }}>
        🎉 クエストクリア！ 🎉
      </h2>
      <p style={{ textAlign: 'center', marginBottom: '20px' }}>今日の答え合わせ</p>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
        {gameState.dailyHistory.map((item, index) => {
          const { problem, isCorrect, userAns, explanation } = item;
          return (
            <div key={index} style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '10px', 
              marginBottom: '10px',
              borderLeft: `5px solid ${isCorrect ? '#2ECC71' : '#E74C3C'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  問{index + 1}: 
                  <FractionText f={problem.f1} />
                  <span style={{ margin: '0 5px' }}>{problem.type === 'addition' ? '+' : '-'}</span>
                  <FractionText f={problem.f2} />
                </div>
                <div style={{ fontSize: '1.5rem' }}>
                  {isCorrect ? '⭕' : '❌'}
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#CCC', marginBottom: '5px' }}>
                正解: <FractionText f={problem.answer} /> | 
                あなたの解答: <FractionText f={userAns} />
              </div>

              {!isCorrect && (
                <div style={{ background: '#333', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', color: '#F9E79F' }}>
                  <strong>💡 考え方:</strong><br />
                  {explanation}
                </div>
              )}
            </div>
          );
        })}

        {gameState.dailyHistory.length === 0 && (
          <div style={{ textAlign: 'center', color: '#AAA' }}>履歴がありません。</div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-red" onClick={onBack} style={{ width: '100%', padding: '15px', fontSize: '1.2rem' }}>
          ホームへ戻る
        </button>
      </div>
    </div>
  );
}
