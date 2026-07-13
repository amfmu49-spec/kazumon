import React, { useState, useEffect } from 'react';
import { submitScore, getRanking } from '../utils/firebase';

export default function TrainingResultScreen({ score, maxCombo, solvedCount, onBack }) {
  const [name, setName] = useState('');
  const [ranking, setRanking] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setIsLoading(true);
    const data = await getRanking();
    setRanking(data);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('名前を入力してください！');
      return;
    }
    setIsSubmitted(true);
    await submitScore(name.trim(), score, maxCombo, solvedCount);
    fetchRanking(); // ランキングを再取得
  };

  return (
    <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      
      <div className="wood-panel" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#F1C40F', fontSize: '1.5rem', marginBottom: '10px' }}>修行モード 結果発表！</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>正解数</div>
            <div style={{ fontSize: '1.5rem', color: '#4ECDC4', fontWeight: 'bold' }}>{solvedCount} <span style={{fontSize:'1rem'}}>問</span></div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.8rem', color: '#ccc' }}>最大コンボ</div>
            <div style={{ fontSize: '1.5rem', color: '#FF6B6B', fontWeight: 'bold' }}>{maxCombo} <span style={{fontSize:'1rem'}}>回</span></div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.5)', padding: '15px', borderRadius: '10px', border: '2px solid #F1C40F', marginBottom: '15px' }}>
          <div style={{ fontSize: '1rem', color: '#ccc' }}>最終スコア</div>
          <div className="anim-pulse" style={{ fontSize: '3rem', color: '#F1C40F', fontWeight: 'bold', textShadow: '0 0 10px #F1C40F' }}>
            {score}
          </div>
        </div>

        {!isSubmitted ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="あなたの名前" 
              style={{ flex: 1, padding: '10px', borderRadius: '5px', border: 'none', fontSize: '1rem' }}
              maxLength={10}
            />
            <button className="btn" onClick={handleSubmit} style={{ padding: '10px 15px', background: 'linear-gradient(to bottom, #E67E22, #D35400)' }}>
              ランキング登録！
            </button>
          </div>
        ) : (
          <div style={{ color: '#2ECC71', fontWeight: 'bold' }}>✅ ランキングに登録しました！</div>
        )}
      </div>

      <div className="wood-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '10px', color: '#85C1E9' }}>🏆 ネットランキング 🏆</h3>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>読み込み中...</div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
            {ranking.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: i === 0 ? 'rgba(241,196,15,0.2)' : 'transparent' }}>
                <div style={{ width: '30px', fontSize: '1.2rem', fontWeight: 'bold', color: i === 0 ? '#F1C40F' : i === 1 ? '#BDC3C7' : i === 2 ? '#CD7F32' : '#FFF' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>{r.name}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#F1C40F', fontWeight: 'bold', fontSize: '1.2rem' }}>{r.score}</div>
                  <div style={{ fontSize: '0.7rem', color: '#ccc' }}>{r.solved}問 / {r.combo}コンボ</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-red" onClick={onBack} style={{ marginTop: '15px' }}>
        ホームにもどる
      </button>

    </div>
  );
}
