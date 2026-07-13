import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

// TODO: ここにご自身のFirebaseプロジェクトの設定を貼り付けてください
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// プレースホルダーの場合は初期化をスキップしてモック動作にするためのフラグ
const isMock = firebaseConfig.apiKey === "YOUR_API_KEY";

let app, db;
if (!isMock) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

// ランキングデータのモック（Firebase設定までの仮データ）
let mockRanking = [
  { name: 'アルキメデス', score: 15000, combo: 25, solved: 30, date: new Date().toISOString() },
  { name: 'ピタゴラス', score: 12000, combo: 18, solved: 25, date: new Date().toISOString() },
  { name: 'オイラー', score: 9500, combo: 15, solved: 20, date: new Date().toISOString() }
];

export const submitScore = async (name, score, combo, solved) => {
  const data = {
    name: name || '名無し',
    score,
    combo,
    solved,
    date: new Date().toISOString()
  };

  if (isMock) {
    mockRanking.push(data);
    return true;
  }

  try {
    await addDoc(collection(db, "rankings"), data);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const getRanking = async () => {
  if (isMock) {
    return [...mockRanking].sort((a, b) => b.score - a.score).slice(0, 10);
  }

  try {
    const q = query(collection(db, "rankings"), orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    return results;
  } catch (e) {
    console.error("Error getting ranking: ", e);
    return [];
  }
};
