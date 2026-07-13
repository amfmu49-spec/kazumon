import React, { useState, useEffect } from 'react';
import { generateFractionProblem } from '../utils/mathGen';
import monsterImg from '../assets/monster_punipuni_transparent.png';
import dragonImg from '../assets/dragon_transparent.png';
import heroImg from '../assets/hero_basic_transparent.png';
import { audioController } from '../utils/audio';
import { getRandomEquipment } from '../utils/equipment';
import TrainingResultScreen from './TrainingResultScreen';

import { getEnemyForNode, ENEMIES_DATA } from '../utils/enemies';
const FractionDisplay = ({ fraction }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px', verticalAlign: 'middle', fontSize: '1.5rem', fontWeight: '900' }}>
    <div style={{ padding: '0 5px', borderBottom: '3px solid white' }}>{fraction.n}</div>
    <div style={{ padding: '0 5px' }}>{fraction.d}</div>
  </div>
);

export default function BattleScreen({ gameStateHook, onBack, onFinishDaily, mode }) {
  const { gameState, updateState, addExp, addCoin, addWrongProblem, removeWrongProblem, addDailyHistory, consumeItem, addEquipment } = gameStateHook;
  
  const [problem, setProblem] = useState(null);
  const [inputN, setInputN] = useState('');
  const [inputD, setInputD] = useState('');
  
  const [focusedInput, setFocusedInput] = useState('N');
  const [shouldOverwrite, setShouldOverwrite] = useState(false);
  
  const [enemyAnim, setEnemyAnim] = useState('anim-float');
  const [playerAnim, setPlayerAnim] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Item states
  const [showHint, setShowHint] = useState(false);
  const [isChoiceMode, setIsChoiceMode] = useState(false);
  const [choices, setChoices] = useState([]);

  // HP States
  const playerMaxHp = 50 + (gameState.level * 10);
  const [playerHp, setPlayerHp] = useState(playerMaxHp);
  
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [enemyHp, setEnemyHp] = useState(1);
  const [enemyMaxHp, setEnemyMaxHp] = useState(1);
  const [okawariCount, setOkawariCount] = useState(0);
  
  // Combo and effects
  const [combo, setCombo] = useState(0);
  const [showComboAnim, setShowComboAnim] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [showSlash, setShowSlash] = useState(false);

  // Training Mode States
  const [score, setScore] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [isTrainingFinished, setIsTrainingFinished] = useState(false);

  // Time limit
  const TIME_LIMIT = mode === 'training' ? 120 : 20;
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [isTimeActive, setIsTimeActive] = useState(false);

  const getTimeColor = (time) => {
    if (time >= 13) return '#3498DB'; // 青
    if (time >= 8) return '#F1C40F'; // 黄
    return '#FF0000'; // 赤
  };

  useEffect(() => {
    // 毎回ヒントカードを最低1枚持っている状態にする
    if (!gameState.items || gameState.items.hintCards < 1) {
      updateState({ items: { ...(gameState.items || {}), hintCards: Math.max(1, (gameState.items?.hintCards || 0)) } });
    }
    // Reset player HP on battle start
    setPlayerHp(playerMaxHp);
    spawnEnemy();
  }, []);

  useEffect(() => {
    if (!isTimeActive || playerHp <= 0 || enemyHp <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isTimeActive, playerHp, enemyHp, problem]);

  // アラーム音の再生
  useEffect(() => {
    if (isTimeActive && timeLeft <= 7 && timeLeft > 0) {
      audioController.playSE('alarm');
    }
  }, [timeLeft, isTimeActive]);

  const handleTimeOut = () => {
    setIsTimeActive(false);
    if (mode === 'training') {
      setIsTrainingFinished(true);
    } else {
      handleWrongAnswer('timeout');
    }
  };

  const spawnEnemy = () => {
    // 進行度に応じて敵を取得
    let enemyTemplate;
    if (mode === 'okawari') {
      const allEnemies = [...ENEMIES_DATA.normal, ...ENEMIES_DATA.boss];
      enemyTemplate = allEnemies[Math.floor(Math.random() * allEnemies.length)];
    } else {
      enemyTemplate = getEnemyForNode(gameState.todayClearedCount);
    }
    
    const difficultyMultiplier = 1 + (gameState.level * 0.2);
    const maxHp = Math.floor(enemyTemplate.baseHp * difficultyMultiplier);
    
    setCurrentEnemy(enemyTemplate);
    setEnemyMaxHp(maxHp);
    setEnemyHp(maxHp);
    
    if (enemyTemplate.type === 'boss') {
      audioController.playBGM('battle_boss');
    } else {
      audioController.playBGM('battle_normal');
    }
    
    nextProblem();
  };

  const handlePadPress = (val) => {
    if (val === 'C') {
      if (focusedInput === 'N') setInputN('');
      else setInputD('');
      setShouldOverwrite(false);
    } else if (val === 'NEXT') {
      setFocusedInput(focusedInput === 'N' ? 'D' : 'N');
      setShouldOverwrite(true);
    } else {
      if (focusedInput === 'N') {
        if (shouldOverwrite) {
          setInputN(val);
          setShouldOverwrite(false);
        } else {
          if (inputN.length < 3) setInputN(prev => prev + val);
        }
      } else {
        if (shouldOverwrite) {
          setInputD(val);
          setShouldOverwrite(false);
        } else {
          if (inputD.length < 3) setInputD(prev => prev + val);
        }
      }
    }
  };

  const nextProblem = () => {
    setInputN('');
    setInputD('');
    setShouldOverwrite(false);
    setFeedbackMsg('');
    setShowHint(false);
    setIsChoiceMode(false);
    setEnemyAnim('anim-fade-in');
    
    if (mode === 'review' && gameState.wrongProblems.length > 0) {
      const randomIdx = Math.floor(Math.random() * gameState.wrongProblems.length);
      setProblem(gameState.wrongProblems[randomIdx]);
    } else {
      setProblem(generateFractionProblem(gameState.level));
    }

    if (mode !== 'training') {
      setTimeLeft(TIME_LIMIT);
    }
    setIsTimeActive(true);

    setTimeout(() => setEnemyAnim('anim-float'), 500);
  };

  const useItem = (type) => {
    if (gameState.items[type] <= 0) {
      setFeedbackMsg('アイテムが足りない！');
      return;
    }
    
    if (type === 'potions') {
      if (playerHp >= playerMaxHp) {
         setFeedbackMsg('HPは満タンだ！');
         return;
      }
      if (consumeItem('potions')) {
         setPlayerHp(prev => Math.min(playerMaxHp, prev + (playerMaxHp * 0.5)));
         audioController.playSE('heal'); // Assuming heal exists, or use powerup
         setFeedbackMsg('💊 HPが回復した！');
      }
    } else if (type === 'hintCards') {
      if (showHint) return;
      if (consumeItem('hintCards')) {
         setShowHint(true);
         setFeedbackMsg('💡 ヒントを使った！');
      }
    } else if (type === 'choiceCards') {
      if (isChoiceMode) return;
      if (consumeItem('choiceCards')) {
         const correctAns = problem.answer;
         // Generate some believable dummies
         const dummy1 = { n: correctAns.n + 1, d: correctAns.d };
         const dummy2 = { n: correctAns.n, d: correctAns.d + 1 };
         if (dummy1.n === dummy1.d) dummy1.n += 1;
         
         const arr = [correctAns, dummy1, dummy2].sort(() => Math.random() - 0.5);
         setChoices(arr);
         setIsChoiceMode(true);
         setFeedbackMsg('🃏 3択になった！');
      }
    }
  };

  const handleEscape = () => {
    if (gameState.todayClearedCount > 0) {
      onFinishDaily();
    } else {
      onBack();
    }
  };

  const handleAttack = (overrideN, overrideD) => {
    // audioController.playSE('swing'); // 素振り音はMP3と被るため削除
    
    // 斬撃エフェクトを表示
    setShowSlash(true);
    setTimeout(() => setShowSlash(false), 200);

    let ansN, ansD;
    if (overrideN !== undefined) {
      ansN = overrideN;
      ansD = overrideD;
    } else {
      if (!inputN || !inputD) return;
      ansN = parseInt(inputN, 10);
      ansD = parseInt(inputD, 10);
    }
    
    if (ansN === problem.answer.n && ansD === problem.answer.d) {
      // Correct! Deal damage
      setIsTimeActive(false);
      const newCombo = combo + 1;
      setCombo(newCombo);
      audioController.playSE('attack', newCombo);
      setEnemyAnim('anim-shake');
      
      if (mode === 'training') {
        const earned = 100 + (newCombo * 50);
        setScore(prev => prev + earned);
        setMaxCombo(prev => Math.max(prev, newCombo));
        setSolvedCount(prev => prev + 1);
      }
      
      if (newCombo >= 2) {
        setShowComboAnim(true);
        setTimeout(() => setShowComboAnim(false), 1000);
      }
      if (newCombo >= 3 && newCombo < 5) {
        setScreenFlash('flash-white');
        setTimeout(() => setScreenFlash(''), 150);
      } else if (newCombo >= 5 && newCombo < 10) {
        setScreenFlash('flash-gold');
        setTimeout(() => setScreenFlash(''), 300);
      } else if (newCombo >= 10) {
        setScreenFlash('flash-rainbow');
        setTimeout(() => setScreenFlash(''), 500);
      }
      
      // 正解を履歴に保存
      addDailyHistory({
        problem,
        isCorrect: true,
        userAns: { n: ansN, d: ansD },
        explanation: problem.type === 'multiply' ? '分子同士、分母同士をかけ算しましょう。最後に約分できる場合は忘れずに！' : 'わる数の分母と分子を入れ替えて（逆数にして）から、かけ算と同じように計算しましょう。'
      });

      setEnemyHp(0); // 1問正解で必ず倒せる
      // audioController.playSE('defeat'); // 撃破音もMP3と被るため削除
      setFeedbackMsg(`✨ ${currentEnemy.name}をたおした！ ✨`);
      
      let nextCount = mode === 'okawari' ? okawariCount + 1 : gameState.todayClearedCount + 1;
      
      if (mode === 'okawari') {
        setOkawariCount(nextCount);
      } else {
        updateState({ todayClearedCount: nextCount });
      }
      
      addExp(currentEnemy.type === 'boss' ? 20 : 5);
      addCoin(currentEnemy.type === 'boss' ? 50 : 10);
      
      // ドロップ判定
      if (currentEnemy.type === 'boss' || (mode === 'okawari' && nextCount >= 3)) {
        setTimeout(() => {
          const eq = getRandomEquipment();
          const msg = addEquipment(eq);
          audioController.playSE('powerup');
          alert(`🎉 宝箱から装備が出た！\n${eq.icon} ${msg}`);
        }, 800);
      }
      
      setTimeout(() => {
        if (mode === 'training') {
          spawnEnemy(); // 修行モードは時間切れまで無限に続く
        } else if ((mode === 'okawari' && nextCount >= 3) || (mode !== 'okawari' && nextCount >= 15)) {
          onFinishDaily();
        } else {
          spawnEnemy();
        }
      }, 1500);
      
    } else if (ansN * problem.answer.d === ansD * problem.answer.n) {
      // 値は合っているが約分されていない
      setFeedbackMsg('⚠️ まだ約分できるよ！もう一度！');
      setPlayerAnim('anim-shake');
      setShouldOverwrite(true);
      // ペナルティは与えず、returnして再入力させる
      return;
    } else {
      // Wrong! Player takes damage and enemy escapes/advances
      handleWrongAnswer('miss', ansN, ansD);
    }
  };

  const handleWrongAnswer = (reason, ansN = 0, ansD = 0) => {
      setIsTimeActive(false);
      setCombo(0);
      audioController.playSE('damage');
      setPlayerAnim('anim-shake');
      
      // 間違いを履歴に保存
      addDailyHistory({
        problem,
        isCorrect: false,
        userAns: { n: ansN, d: ansD },
        explanation: problem.type === 'multiply' ? '分子同士、分母同士をかけ算しましょう。最後に約分できる場合は忘れずに！' : 'わる数の分母と分子を入れ替えて（逆数にして）から、かけ算と同じように計算しましょう。'
      });

      const damageTaken = Math.floor(enemyMaxHp * 0.1) + 5;
      const newPlayerHp = Math.max(0, playerHp - damageTaken);
      setPlayerHp(newPlayerHp);
      
      if (reason === 'timeout') {
        setFeedbackMsg(`⏰ タイムアップ！ ${damageTaken} ダメージを受けた！`);
      } else {
        setFeedbackMsg(`❌ ミス！ ${damageTaken} ダメージを受けた！`);
      }
      
      if (mode === 'normal') {
        addWrongProblem(problem);
      }
      
      let nextCount = mode === 'okawari' ? okawariCount + 1 : gameState.todayClearedCount + 1;
      if (mode === 'okawari') {
        setOkawariCount(nextCount);
      } else {
        updateState({ todayClearedCount: nextCount });
      }
      
      if (newPlayerHp <= 0) {
        setFeedbackMsg(`💀 まけてしまった...`);
        setTimeout(() => {
          if (mode === 'training') {
            setIsTrainingFinished(true);
          } else {
            onBack();
          }
        }, 2000);
      } else {
        setTimeout(() => {
          setPlayerAnim('');
          if ((mode === 'okawari' && nextCount >= 3) || (mode !== 'okawari' && nextCount >= 15)) {
            onFinishDaily();
          } else {
            spawnEnemy(); // 間違えても次の敵(問題)へ進む
          }
        }, 1500);
      }
  };

  if (!problem) return null;

  if (isTrainingFinished) {
    return (
      <TrainingResultScreen 
        score={score} 
        maxCombo={maxCombo} 
        solvedCount={solvedCount} 
        onBack={onBack} 
      />
    );
  }

  return (
    <div className={`${playerAnim} ${timeLeft <= 7 ? 'danger-shake' : ''}`} style={{ padding: '5px 10px', flex: 1, width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      
      <style>{`
        .flash-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 999;
          pointer-events: none;
        }
        .flash-white {
          background: white;
          animation: flashAnim 0.15s ease-out forwards;
        }
        .flash-gold {
          background: #F1C40F;
          animation: flashAnim 0.3s ease-out forwards;
          mix-blend-mode: overlay;
        }
        .flash-rainbow {
          background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet);
          animation: flashAnim 0.5s ease-out forwards;
          mix-blend-mode: color-dodge;
        }
        @keyframes flashAnim {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        .slash-effect {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 10px;
          background: white;
          box-shadow: 0 0 15px white, 0 0 30px #4ECDC4;
          transform: translate(-50%, -50%) rotate(-45deg);
          animation: slashAnim 0.2s ease-out forwards;
          pointer-events: none;
          z-index: 50;
        }
        @keyframes slashAnim {
          0% { clip-path: inset(0 100% 0 0); opacity: 1; }
          50% { clip-path: inset(0 0 0 0); opacity: 1; transform: translate(-50%, -50%) rotate(-45deg) scale(1.2); }
          100% { clip-path: inset(0 0 0 100%); opacity: 0; }
        }

        .danger-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 900;
          pointer-events: none;
          box-shadow: inset 0 0 50px rgba(255, 0, 0, 0.8);
          animation: dangerPulse 1s infinite alternate;
        }
        @keyframes dangerPulse {
          0% { box-shadow: inset 0 0 30px rgba(255, 0, 0, 0.4); }
          100% { box-shadow: inset 0 0 120px rgba(255, 0, 0, 1); }
        }
        
        .danger-shake {
          animation: subtleShake 0.15s infinite;
        }
        @keyframes subtleShake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, 1px); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(1px, 1px); }
        }

        .combo-text {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 3rem;
          font-weight: 900;
          color: #FF5733;
          text-shadow: 2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 4px 4px 10px rgba(0,0,0,0.5);
          z-index: 100;
          animation: popCombo 1s ease-out forwards;
          pointer-events: none;
        }
        .combo-gold {
          color: #F1C40F;
          font-size: 4rem;
          text-shadow: 2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF, 0 0 20px #F1C40F;
        }
        .combo-rainbow {
          background: linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet);
          -webkit-background-clip: text;
          color: transparent;
          font-size: 5rem;
          text-shadow: 2px 2px 0 rgba(255,255,255,0.5);
        }
        @keyframes popCombo {
          0% { transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.3) rotate(5deg); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -100%) scale(0.8); opacity: 0; }
        }
      `}</style>
      
      {screenFlash && <div className={`flash-overlay ${screenFlash}`} />}
      {showComboAnim && (
        <div className={`combo-text ${combo >= 10 ? 'combo-rainbow' : combo >= 5 ? 'combo-gold' : ''}`}>
          {combo} COMBO!!
        </div>
      )}
      {showSlash && <div className="slash-effect" />}
      {timeLeft <= 7 && <div className="danger-overlay" />}
      
      {/* Header Info (Progress & Status) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ background: 'rgba(0,0,0,0.6)', border: '2px solid #F1C40F', borderRadius: '99px', padding: '4px 12px', color: '#F1C40F', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {mode === 'training' ? (
            `SCORE: ${score}  (🔥${solvedCount}問)`
          ) : mode === 'okawari' ? (
            `第 ${Math.min(okawariCount + 1, 3)} 戦 / 全 3 戦 (おかわり)`
          ) : (
            `第 ${Math.min(gameState.todayClearedCount + 1, 15)} 戦 / 全 15 戦`
          )}
        </div>
        <button className="btn btn-red" onClick={handleEscape} style={{ padding: '6px 12px', fontSize: '0.9rem', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}>
          逃げる
        </button>
      </div>

      {/* Player HP */}
      <div style={{ width: '100%', marginBottom: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '2px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div className={playerAnim} style={{ position: 'relative', width: '30px', height: '30px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '2px' }}>
              <img src={heroImg} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              {gameState.equipped && (
                <div style={{ position: 'absolute', top: -5, right: -5, fontSize: '1rem', textShadow: '0 0 2px rgba(255,255,255,0.8)' }}>
                  {gameState.equipment.find(e => e.id === gameState.equipped)?.icon}
                </div>
              )}
            </div>
            <span>{gameState.heroName || 'ゆうしゃ'}のHP</span>
          </div>
          <span>{Math.floor(playerHp)} / {playerMaxHp}</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden', border: '1px solid #FFF' }}>
          <div style={{ width: `${(playerHp / playerMaxHp) * 100}%`, height: '100%', background: playerHp > playerMaxHp * 0.3 ? '#2ECC71' : '#E74C3C', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Battle Scene */}
      <div className="flex-center" style={{ flex: 1, minHeight: 0, flexDirection: 'column', position: 'relative' }}>
        
        {/* Item Bag & Hint Area */}
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="btn-small red" onClick={() => useItem('potions')} style={{ width: '35px', height: '35px', padding: 0 }}>
              <div style={{ fontSize: '1rem' }}>💊</div>
              <div style={{ fontSize: '0.6rem', position: 'absolute', bottom: -2, right: 2 }}>{gameState.items?.potions || 0}</div>
            </button>
            <button className="btn-small green" onClick={() => useItem('hintCards')} style={{ width: '35px', height: '35px', padding: 0 }}>
              <div style={{ fontSize: '1rem' }}>💡</div>
              <div style={{ fontSize: '0.6rem', position: 'absolute', bottom: -2, right: 2 }}>{gameState.items?.hintCards || 0}</div>
            </button>
            <button className="btn-small" onClick={() => useItem('choiceCards')} style={{ width: '35px', height: '35px', padding: 0, background: 'linear-gradient(to bottom, #9B59B6, #8E44AD)' }}>
              <div style={{ fontSize: '1rem' }}>🃏</div>
              <div style={{ fontSize: '0.6rem', position: 'absolute', bottom: -2, right: 2 }}>{gameState.items?.choiceCards || 0}</div>
            </button>
          </div>
        </div>

        {/* Enemy */}
        <div className={enemyAnim} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '5px', width: '100%' }}>
          <div style={{ 
            color: currentEnemy?.type === 'boss' ? '#FF5733' : '#FFF', 
            fontWeight: '900', 
            textShadow: currentEnemy?.type === 'boss' ? '0 0 10px #FF0000, 2px 2px 0 #000' : '1px 1px 2px #000', 
            marginBottom: '2px', 
            fontSize: currentEnemy?.type === 'boss' ? '1.2rem' : '0.9rem',
            flexShrink: 0
          }}>
            {currentEnemy?.type === 'boss' ? `😈 ${currentEnemy?.name} 😈` : currentEnemy?.name}
          </div>
          {/* Enemy HP Bar */}
          <div style={{ width: currentEnemy?.type === 'boss' ? '120px' : '80px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden', marginBottom: '5px', border: '1px solid #FFF', boxShadow: currentEnemy?.type === 'boss' ? '0 0 5px red' : 'none', flexShrink: 0 }}>
            <div style={{ width: `${(enemyHp / enemyMaxHp) * 100}%`, height: '100%', background: '#E74C3C', transition: 'width 0.3s' }} />
          </div>
          <img 
            src={currentEnemy?.img || monsterImg} 
            alt="Enemy" 
            style={{ 
              width: '100%', 
              height: '100%',
              maxWidth: currentEnemy?.type === 'boss' ? '250px' : '160px',
              maxHeight: '100%', 
              objectFit: 'contain', 
              transform: currentEnemy?.scale ? `scale(${currentEnemy.scale})` : 'none',
              filter: `drop-shadow(0 10px 10px rgba(0,0,0,0.6)) ${currentEnemy?.filter || ''} ${currentEnemy?.type === 'boss' ? 'drop-shadow(0 0 15px red)' : ''}`,
              position: 'relative',
              zIndex: 1
            }} 
          />
        </div>
        
        {/* Feedback Message */}
        <div style={{ height: '20px', margin: '2px 0', color: feedbackMsg.includes('✨') ? '#F4D03F' : '#FF6B6B', fontWeight: '900', fontSize: '0.9rem', textShadow: '1px 1px 0 #000' }}>
          {feedbackMsg}
        </div>

        {/* Time Limit Bar */}
        <div style={{ width: '90%', maxWidth: '300px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '20px', border: `2px solid ${getTimeColor(timeLeft)}`, boxShadow: timeLeft <= 7 ? '0 0 10px #FF0000' : 'none', transition: 'border 0.3s' }}>
          <span style={{ fontSize: '1.2rem', animation: timeLeft <= 7 ? 'anim-shake 0.5s infinite' : 'none' }}>⏰</span>
          <div style={{ flex: 1, height: '8px', background: '#222', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%`, height: '100%', background: getTimeColor(timeLeft), transition: 'width 1s linear, background 0.3s', boxShadow: '0 0 5px rgba(255,255,255,0.5)' }} />
          </div>
          <span style={{ color: timeLeft <= 7 ? '#FF0000' : '#FFF', fontWeight: 'bold', fontSize: '0.9rem', width: '30px', textAlign: 'right', transition: 'color 0.3s' }}>{timeLeft}s</span>
        </div>

        {/* Problem Display */}
        <div className="wood-panel" style={{ width: '100%', marginBottom: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5px' }}>
          {showHint && (
            <div style={{ fontSize: '0.8rem', color: '#F1C40F', marginBottom: '5px' }}>
              {problem.type === 'multiply' ? 'ヒント: 分子同士、分母同士をかけよう！' : 'ヒント: 右の分数を逆数にして掛け算にしよう！'}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FractionDisplay fraction={problem.f1} />
            <span style={{ margin: '0 5px', color: '#F9E79F' }}>{problem.operatorStr}</span>
            <FractionDisplay fraction={problem.f2} />
            <span style={{ margin: '0 5px', color: '#F9E79F' }}>=</span>
            
            {isChoiceMode ? (
              <span style={{ margin: '0 5px', color: '#FFF' }}>?</span>
            ) : (
              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
                <div 
                  onClick={() => { setFocusedInput('N'); setShouldOverwrite(true); }}
                  style={{ width: '65px', height: '45px', lineHeight: '45px', textAlign: 'center', fontSize: inputN.length >= 3 ? '1.1rem' : '1.5rem', overflow: 'hidden', background: '#FFF8E7', color: '#000', border: focusedInput === 'N' ? '3px solid #FF6B6B' : '2px solid #8B5A2B', borderRadius: '8px', marginBottom: '6px', fontWeight: 'bold', cursor: 'pointer', textShadow: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  {inputN || <span style={{color:'#aaa', fontSize:'0.9rem'}}>分子</span>}
                </div>
                <div style={{ width: '60px', height: '3px', backgroundColor: 'white', marginBottom: '6px' }} />
                <div 
                  onClick={() => { setFocusedInput('D'); setShouldOverwrite(true); }}
                  style={{ width: '65px', height: '45px', lineHeight: '45px', textAlign: 'center', fontSize: inputD.length >= 3 ? '1.1rem' : '1.5rem', overflow: 'hidden', background: '#FFF8E7', color: '#000', border: focusedInput === 'D' ? '3px solid #FF6B6B' : '2px solid #8B5A2B', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textShadow: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  {inputD || <span style={{color:'#aaa', fontSize:'0.9rem'}}>分母</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area (Choice or Numpad) */}
        {isChoiceMode ? (
          <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', marginBottom: '10px' }}>
            {choices.map((c, i) => (
              <button 
                key={i} 
                className="wood-panel"
                style={{ padding: '10px 20px', border: 'none', background: 'linear-gradient(to bottom, #4ECDC4, #16A085)', minHeight: '60px' }}
                onClick={() => handleAttack(c.n, c.d)}
              >
                <FractionDisplay fraction={c} />
              </button>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', width: '100%', maxWidth: '320px', marginBottom: '8px' }}>
              {[1,2,3,4,5,6,7,8,9,'C',0,'NEXT'].map(key => (
                <button 
                  key={key} 
                  className={`wood-panel ${key === 'C' ? 'btn-red' : ''}`}
                  style={{ 
                    padding: '8px 5px', fontSize: '1.3rem', fontWeight: 'bold', border: 'none', borderRadius: '8px',
                    background: key === 'NEXT' ? 'linear-gradient(to bottom, #4ECDC4, #16A085)' : '',
                    textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.3)', transform: 'translateY(0)', transition: 'transform 0.1s, box-shadow 0.1s'
                  }}
                  onClick={() => handlePadPress(key.toString())}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0.3)'; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.3)'; }}
                  onTouchStart={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0.3)'; }}
                  onTouchEnd={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.3)'; }}
                >
                  {key === 'NEXT' ? <span style={{fontSize:'1rem', color:'#FFF', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'}}>切替</span> : key}
                </button>
              ))}
            </div>
            
            <button 
              className="btn" 
              onClick={() => handleAttack()}
              style={{ width: '100%', maxWidth: '320px', padding: '15px', fontSize: '1.4rem', borderRadius: '10px', opacity: playerHp <= 0 ? 0.5 : 1, pointerEvents: playerHp <= 0 ? 'none' : 'auto', textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
            >
              ⚔️ こうげき！
            </button>
          </>
        )}
        
        {!isChoiceMode && (
          <div style={{ marginTop: '5px', fontSize: '0.8rem', color: '#FFF', textShadow: '1px 1px 2px #000', fontWeight: 'bold' }}>
            ※答えは必ず「約分」してね！
          </div>
        )}

      </div>
    </div>
  );
}
