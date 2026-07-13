export const EQUIPMENT_DATA = [
  { id: 'eq_sword1', name: '木の剣', icon: '🗡️', power: 2, rarity: 1 },
  { id: 'eq_wand1', name: '魔法の杖', icon: '🪄', power: 3, rarity: 2 },
  { id: 'eq_crown1', name: '勇者の冠', icon: '👑', power: 5, rarity: 3 },
  { id: 'eq_cat', name: 'ネコ耳', icon: '🐱', power: 1, rarity: 1 },
  { id: 'eq_sunglasses', name: 'サングラス', icon: '🕶️', power: 2, rarity: 1 },
  { id: 'eq_shield1', name: '木の盾', icon: '🛡️', power: 1, rarity: 1 },
  { id: 'eq_fire', name: '炎の剣', icon: '🔥', power: 8, rarity: 4 },
  { id: 'eq_star', name: 'スターステッキ', icon: '⭐', power: 10, rarity: 5 }
];

export const getRandomEquipment = () => {
  // Simple random for now, but can be weighted by rarity
  const randIndex = Math.floor(Math.random() * EQUIPMENT_DATA.length);
  return EQUIPMENT_DATA[randIndex];
};
