import { useState, useEffect } from 'react';
import './index.css';
import { useGameState } from './hooks/useGameState';
import OpeningScreen from './components/OpeningScreen';
import HomeScreen from './components/HomeScreen';
import BattleScreen from './components/BattleScreen';
import ResultsScreen from './components/ResultsScreen';
import CalendarScreen from './components/CalendarScreen';
import HistoryScreen from './components/HistoryScreen';
import GachaScreen from './components/GachaScreen';
import PartyScreen from './components/PartyScreen';
import ShopScreen from './components/ShopScreen';
import SettingScreen from './components/SettingScreen';
import BottomNav from './components/BottomNav';
import { audioController } from './utils/audio';

function App() {
  const [currentScreen, setCurrentScreen] = useState('opening');
  const gameStateHook = useGameState();
  const { claimLoginBonus } = gameStateHook;
  
  useEffect(() => {
    // 画面遷移に合わせてBGMを切り替える
    if (currentScreen === 'opening') {
      audioController.playBGM('opening');
    } else if (currentScreen === 'gacha') {
      audioController.playBGM('gacha');
    } else if (['home', 'party', 'shop', 'setting'].includes(currentScreen)) {
      audioController.playBGM('home');
    }
    // 'battle' と 'review' は BattleScreen 内で敵に応じたBGMを再生するためここでは何もしない
  }, [currentScreen]);

  const handleStart = () => {
    // ユーザーインタラクション時にAudioContextを初期化
    audioController.init();
    setCurrentScreen('home');
  };

  const showNav = ['home', 'gacha', 'party', 'shop', 'setting'].includes(currentScreen);

  return (
    <div className={`app-container ${currentScreen === 'opening' ? 'bg-sky' : 'bg-forest'}`}>
      {currentScreen === 'opening' && <OpeningScreen onStart={handleStart} />}
      {currentScreen === 'home' && <HomeScreen gameStateHook={gameStateHook} onNavigate={setCurrentScreen} />}
      {currentScreen.startsWith('battle') && (
        <BattleScreen 
          gameStateHook={gameStateHook} 
          onBack={() => setCurrentScreen('home')}
          onFinishDaily={() => setCurrentScreen('results')} 
          mode={currentScreen.split('_')[1] || 'normal'} 
        />
      )}
      {currentScreen === 'results' && <ResultsScreen gameStateHook={gameStateHook} onBack={() => setCurrentScreen('home')} />}
      {currentScreen === 'calendar' && <CalendarScreen gameStateHook={gameStateHook} onBack={() => setCurrentScreen('home')} />}
      {currentScreen === 'history' && <HistoryScreen gameStateHook={gameStateHook} onBack={() => setCurrentScreen('home')} />}
      {currentScreen === 'gacha' && <GachaScreen gameStateHook={gameStateHook} />}
      {currentScreen === 'party' && <PartyScreen gameStateHook={gameStateHook} />}
      {currentScreen === 'shop' && <ShopScreen gameStateHook={gameStateHook} />}
      {currentScreen === 'setting' && <SettingScreen />}
      
      {showNav && <BottomNav onNavigate={setCurrentScreen} currentScreen={currentScreen} />}
    </div>
  );
}

export default App;
