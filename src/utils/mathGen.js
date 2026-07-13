// 共通の最大公約数（GCD）を求める関数
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// 分数を約分する関数
export function simplify(n, d) {
  const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}

// 分数問題を生成する関数
export function generateFractionProblem(level = 1) {
  // レベルに応じて分母の最大値を変更（難易度調整）
  // 序盤は分母が小さく、計算しやすい数にする
  const maxD = level <= 3 ? 5 : (level <= 10 ? 9 : 15);
  
  // 序盤（レベル1〜2）は必ず掛け算、それ以降は掛け算と割り算が混ざる
  const isMultiply = level <= 2 ? true : Math.random() > 0.5;

  const getRandomFraction = () => {
    // 分母は 2 〜 maxD
    const d = Math.floor(Math.random() * (maxD - 1)) + 2;
    
    // 分子は 1 〜 (d-1) （レベルが低い時は必ず真分数にする）
    let maxN = level <= 5 ? d - 1 : d + 2;
    if (maxN < 1) maxN = 1;
    
    const n = Math.floor(Math.random() * maxN) + 1; 
    return simplify(n, d);
  };
  
  let f1 = getRandomFraction();
  let f2 = getRandomFraction();
  
  let answerN, answerD;
  
  if (isMultiply) {
    answerN = f1.n * f2.n;
    answerD = f1.d * f2.d;
  } else {
    // 割り算: f1 ÷ f2 => f1 × (f2.d / f2.n)
    // ※問題として表示されるのは f1 ÷ f2 のまま（ユーザー自身で逆数にして掛ける）
    answerN = f1.n * f2.d;
    answerD = f1.d * f2.n;
  }
  
  const answer = simplify(answerN, answerD);
  
  return {
    id: Date.now() + Math.random().toString(), // Reactのkey用
    type: isMultiply ? 'multiply' : 'divide',
    f1,
    f2,
    operatorStr: isMultiply ? '×' : '÷',
    answer,
  };
}
