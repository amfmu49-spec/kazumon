import bgmOp from '../assets/数モン　op.mp3';
import bgmHome from '../assets/数モン　ホーム画面.mp3';
import bgmBattleNormal from '../assets/数モン　バトル　普通の敵.mp3';
import bgmBattleBoss from '../assets/数モン　バトル　boss.mp3';
import bgmGacha from '../assets/数モン　バトル　ガチャ用.mp3';

class AudioController {
  constructor() {
    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.4; // BGM volume
    this.currentBgm = null;
    
    // Audio Context for SE
    this.audioCtx = null;
  }
  
  init() {
    if (!this.audioCtx) {
      try {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  playBGM(type) {
    const bgmMap = {
      'opening': bgmOp,
      'home': bgmHome,
      'battle_normal': bgmBattleNormal,
      'battle_boss': bgmBattleBoss,
      'gacha': bgmGacha
    };
    
    const src = bgmMap[type];
    if (!src) return;
    
    if (this.currentBgm === src) {
      if (this.bgmAudio.paused) {
        this.bgmAudio.play().catch(e => console.log('BGM play prevented', e));
      }
      return;
    }
    
    this.bgmAudio.src = src;
    this.currentBgm = src;
    this.bgmAudio.play().catch(e => console.log('BGM play prevented by browser policy (requires user interaction first)', e));
  }
  
  stopBGM() {
    this.bgmAudio.pause();
    this.bgmAudio.currentTime = 0;
    this.currentBgm = null;
  }
  
  playSE(type, combo = 0) {
    this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    
    const now = this.audioCtx.currentTime;
    if (type === 'attack') {
      // アップロードされた効果音を再生
      const seAudio = new Audio();
      if (combo >= 5) {
        seAudio.src = '/sounds/剣で斬る5コンボ以上.mp3';
      } else if (combo >= 3) {
        seAudio.src = '/sounds/剣で斬る3コンボ以上.mp3';
      } else {
        seAudio.src = '/sounds/剣で斬る1～2コンボ.mp3';
      }
      seAudio.play().catch(e => console.log('SE play prevented', e));
      return; // 以前のWeb Audio APIによる合成音は再生しないようにする
      
      // 「バシュッ」という斬撃音を作成
      // ノイズと素早いエンベロープを使用
      const bufferSize = this.audioCtx.sampleRate * 0.2; // 0.2 seconds
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      
      // フィルターで「シュッ」という音を作る
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      // コンボが増えるとフィルターの周波数が高くなり鋭い音になる
      const baseCutoff = 3000 + (combo * 1000);
      filter.frequency.setValueAtTime(baseCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      
      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(1.0, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(gainNode);
      
      const masterGain = Math.min(0.8, 0.4 + (combo * 0.1));
      gainNode.gain.setValueAtTime(masterGain, now);
      
      noiseSource.start(now);
      
      // コンボが増えると重い「ドッ」という衝撃音が追加される
      if (combo >= 3) {
         const osc = this.audioCtx.createOscillator();
         const oscGain = this.audioCtx.createGain();
         osc.connect(oscGain);
         oscGain.connect(gainNode);
         
         osc.type = 'triangle';
         osc.frequency.setValueAtTime(150 + (combo * 20), now);
         osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
         
         oscGain.gain.setValueAtTime(0.3, now); // 音量を下げた
         oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
         
         osc.start(now);
         osc.stop(now + 0.1);
      }
      
      // さらにコンボが増えると、金属的な高い音が混ざる（クリティカル風）
      if (combo >= 5) {
         const osc2 = this.audioCtx.createOscillator();
         const oscGain2 = this.audioCtx.createGain();
         osc2.connect(oscGain2);
         oscGain2.connect(gainNode);
         
         osc2.type = 'square';
         osc2.frequency.setValueAtTime(2000 + (combo * 100), now);
         osc2.frequency.exponentialRampToValueAtTime(100, now + 0.1);
         
         oscGain2.gain.setValueAtTime(0.15, now); // 音量を下げた
         oscGain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
         
         osc2.start(now);
         osc2.stop(now + 0.1);
      }
    } else if (type === 'swing') {
      // 「シュッ」という素振りの音
      const bufferSize = this.audioCtx.sampleRate * 0.1;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.1);
      
      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(gainNode);
      
      noiseSource.start(now);
    } else if (type === 'damage') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gainNode.gain.setValueAtTime(0.15, now); // 音量を下げた
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'defeat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.1);
      osc.frequency.linearRampToValueAtTime(600, now + 0.2);
      osc.frequency.linearRampToValueAtTime(100, now + 0.5);
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'levelUp') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.setValueAtTime(0.2, now + 0.4);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'alarm') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      
      // 1回目のビープ音
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.setValueAtTime(0.15, now + 0.1);
      gainNode.gain.setValueAtTime(0, now + 0.15);
      
      // 2回目のビープ音
      gainNode.gain.setValueAtTime(0.15, now + 0.2);
      gainNode.gain.setValueAtTime(0.15, now + 0.3);
      gainNode.gain.setValueAtTime(0, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }
}

export const audioController = new AudioController();
