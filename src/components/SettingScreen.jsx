import React from 'react';

export default function SettingScreen() {
  const handleReset = () => {
    if (window.confirm('本当にデータを消去しますか？（取り消せません）')) {
      localStorage.removeItem('fraction_rpg_save_data');
      window.location.reload();
    }
  };

  return (
    <div className="app-container bg-forest" style={{ padding: '20px', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div className="wood-panel" style={{ padding: '8px 16px', borderRadius: '99px' }}>
          せってい
        </div>
      </div>

      <div className="wood-panel text-center" style={{ padding: '30px', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>データリセット</h3>
        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '20px' }}>
          これまでのレベルや装備、おかねがすべて消えます。<br/>最初からやり直す場合のみ押してください。
        </p>
        <button className="btn btn-red" onClick={handleReset}>
          データを消す
        </button>
      </div>
    </div>
  );
}
