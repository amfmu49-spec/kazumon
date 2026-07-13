import { useState, useEffect } from 'react';

const STORAGE_KEY = 'fraction_rpg_save_data';

const initialGameState = {
  heroName: 'ゆうしゃ',
  level: 1,
  exp: 0,
  coins: 0,
  todayClearedCount: 0, // 今日の正解数（最大10）
  lastPlayedDate: null,
  loginBonusClaimedDate: null,
  equipment: [], // { id, name, power, icon }
  equipped: null, // id of equipped item
  items: {
    potions: 0,
    hintCards: 0,
    choiceCards: 0
  },
  wrongProblems: [],
  dailyHistory: [], // { problem, isCorrect, explanation, userAns }
  allHistory: [], // [{ date: 'YYYY-MM-DD', history: [] }] (最大30日分)
  calendarStickers: {} // { 'YYYY-MM-DD': 'sticker_id' }
};

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 日付が変わっていたら一日の進捗をリセット
        const today = new Date().toDateString();
        if (parsed.lastPlayedDate !== today) {
           if (parsed.dailyHistory && parsed.dailyHistory.length > 0) {
             parsed.allHistory = parsed.allHistory || [];
             parsed.allHistory.unshift({ date: parsed.lastPlayedDate, history: parsed.dailyHistory });
             if (parsed.allHistory.length > 30) parsed.allHistory = parsed.allHistory.slice(0, 30);
           }
           parsed.todayClearedCount = 0;
           parsed.lastPlayedDate = today;
           parsed.dailyHistory = [];
        }
        return { ...initialGameState, ...parsed };
      } catch (e) {
        return initialGameState;
      }
    }
    return { ...initialGameState, lastPlayedDate: new Date().toDateString() };
  });

  // 状態が変わるたびに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);
  
  const updateState = (updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const addExp = (amount) => {
    setGameState(prev => {
      let bonus = 0;
      if (prev.equipped) {
        const item = prev.equipment.find(i => i.id === prev.equipped);
        if (item) bonus = item.power || 0;
      }
      let newExp = prev.exp + amount + bonus;
      let newLevel = prev.level;
      let nextLevelExp = newLevel * 10;
      while (newExp >= nextLevelExp) {
        newLevel++;
        newExp -= nextLevelExp;
        nextLevelExp = newLevel * 10;
      }
      return { ...prev, exp: newExp, level: newLevel };
    });
  };

  const addCoin = (amount) => {
    setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const claimLoginBonus = () => {
    const today = new Date().toDateString();
    setGameState(prev => {
      if (prev.loginBonusClaimedDate === today) return prev;
      return {
        ...prev,
        loginBonusClaimedDate: today,
        coins: prev.coins + 50 // ログインで50コイン
      };
    });
  };

  const addWrongProblem = (problem) => {
    setGameState(prev => {
      // 既に同じ問題がないかチェック
      const isExist = prev.wrongProblems.find(p => p.f1.n === problem.f1.n && p.f1.d === problem.f1.d && p.f2.n === problem.f2.n && p.f2.d === problem.f2.d && p.type === problem.type);
      if (isExist) return prev;
      return { ...prev, wrongProblems: [...prev.wrongProblems, problem] };
    });
  };

  const removeWrongProblem = (problemId) => {
    setGameState(prev => ({
      ...prev,
      wrongProblems: prev.wrongProblems.filter(p => p.id !== problemId)
    }));
  };

  const addDailyHistory = (historyItem) => {
    setGameState(prev => {
      // 同じ問題が既に履歴にある場合は、間違いフラグを更新するかスキップ
      const exists = prev.dailyHistory.find(h => h.problem.id === historyItem.problem.id);
      if (exists && !historyItem.isCorrect) {
        // もし既に履歴にあって今回間違えたなら記録を更新する
        return {
          ...prev,
          dailyHistory: prev.dailyHistory.map(h => 
            h.problem.id === historyItem.problem.id ? { ...h, isCorrect: false } : h
          )
        };
      } else if (exists) {
        return prev;
      }
      return { ...prev, dailyHistory: [...prev.dailyHistory, historyItem] };
    });
  };

  const setCalendarSticker = (dateStr, stickerId) => {
    setGameState(prev => ({
      ...prev,
      calendarStickers: {
        ...prev.calendarStickers,
        [dateStr]: stickerId
      }
    }));
  };

  const consumeItem = (itemType) => {
    let success = false;
    setGameState(prev => {
      if (prev.items[itemType] > 0) {
        success = true;
        return {
          ...prev,
          items: {
            ...prev.items,
            [itemType]: prev.items[itemType] - 1
          }
        };
      }
      return prev;
    });
    return success;
  };

  const buyItem = (itemType, cost) => {
    let success = false;
    setGameState(prev => {
      if (prev.coins >= cost) {
        success = true;
        return {
          ...prev,
          coins: prev.coins - cost,
          items: {
            ...prev.items,
            [itemType]: (prev.items[itemType] || 0) + 1
          }
        };
      }
      return prev;
    });
    return success;
  };

  const addEquipment = (eqItem) => {
    let resultMessage = '';
    setGameState(prev => {
      const alreadyHas = prev.equipment.find(i => i.id === eqItem.id);
      if (alreadyHas) {
        // If already has, convert to coins
        resultMessage = `すでに持っていたので、かわりに 50 コイン をゲットした！`;
        return { ...prev, coins: prev.coins + 50 };
      } else {
        resultMessage = `「${eqItem.name}」をゲットした！`;
        return { ...prev, equipment: [...prev.equipment, eqItem] };
      }
    });
    return resultMessage;
  };

  return {
    gameState,
    updateState,
    addExp,
    addCoin,
    claimLoginBonus,
    addWrongProblem,
    removeWrongProblem,
    addDailyHistory,
    setCalendarSticker,
    consumeItem,
    buyItem,
    addEquipment
  };
}
