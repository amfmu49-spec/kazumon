import monsterImg from '../assets/monster_punipuni_transparent.png';
import slimeImg from '../assets/slime_transparent.png';
import ghostImg from '../assets/ghost_transparent.png';
import golemImg from '../assets/golem_transparent.png';
import dragonImg from '../assets/dragon_transparent.png';

// 簡単な色違いを実現するためにCSSのfilter（hue-rotate等）のスタイルを持たせる
export const ENEMIES_DATA = {
  normal: [
    { id: 'n1', name: 'プニモン（緑）', img: monsterImg, baseHp: 20, filter: 'hue-rotate(0deg)' },
    { id: 'n2', name: 'スライム（青）', img: slimeImg, baseHp: 25, filter: 'hue-rotate(0deg)' },
    { id: 'n3', name: 'ゴースト（白）', img: ghostImg, baseHp: 30, filter: 'hue-rotate(0deg)' },
    { id: 'n4', name: 'ゴーレム（岩）', img: golemImg, baseHp: 35, filter: 'hue-rotate(0deg)' },
    { id: 'n5', name: 'プニモン（黄）', img: monsterImg, baseHp: 40, filter: 'hue-rotate(60deg) saturate(2)' },
    { id: 'n6', name: 'レッドスライム', img: slimeImg, baseHp: 45, filter: 'hue-rotate(150deg) saturate(2)' },
    { id: 'n7', name: 'ダークゴースト', img: ghostImg, baseHp: 50, filter: 'grayscale(80%) brightness(0.5)' },
    { id: 'n8', name: 'マグマゴーレム', img: golemImg, baseHp: 55, filter: 'hue-rotate(180deg) saturate(2) brightness(0.8)' },
    { id: 'n9', name: 'アイスプニ', img: monsterImg, baseHp: 65, filter: 'hue-rotate(200deg) brightness(1.5)' },
    { id: 'n10', name: 'キングスライム', img: slimeImg, baseHp: 80, filter: 'hue-rotate(60deg) saturate(1.5) brightness(1.2)', scale: 1.5 }
  ],
  boss: [
    { id: 'b1', name: 'ドラゴモン（火）', img: dragonImg, baseHp: 150, filter: 'hue-rotate(0deg)' },
    { id: 'b2', name: 'クリスタルゴーレム', img: golemImg, baseHp: 180, filter: 'hue-rotate(200deg) brightness(1.5)', scale: 1.2 },
    { id: 'b3', name: 'ドラゴモン（雷）', img: dragonImg, baseHp: 220, filter: 'hue-rotate(60deg) saturate(2)' },
    { id: 'b4', name: 'ファントムキング', img: ghostImg, baseHp: 260, filter: 'hue-rotate(280deg) brightness(0.6)', scale: 1.4 },
    { id: 'b5', name: '真・ドラゴモン', img: dragonImg, baseHp: 350, filter: 'hue-rotate(300deg) saturate(2) brightness(1.2)', scale: 1.3 }
  ]
};

// すごろくの進行度（1〜15）に応じて出現する敵を決めるロジック
export const getEnemyForNode = (progress) => {
  const nodeNum = progress + 1; // 1〜15
  let type = 'normal';
  if (nodeNum > 10) type = 'boss';

  // ノード番号に応じて敵を選ぶ（例：1〜10なら n1〜n10）
  if (type === 'normal') {
    const idx = Math.min(nodeNum - 1, ENEMIES_DATA.normal.length - 1);
    return { ...ENEMIES_DATA.normal[idx], type: 'normal' };
  } else {
    // 11〜15なら b1〜b5
    const idx = Math.min(nodeNum - 11, ENEMIES_DATA.boss.length - 1);
    return { ...ENEMIES_DATA.boss[idx], type: 'boss' };
  }
};
