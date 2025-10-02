export interface UrineTestData {
  id: string;
  registeredAt: string;
  patientName: string;
  whiteBloodCells: string;
  urobilinogen: string;
  occultBlood: string;
  bilirubin: string;
  glucose: string;
  albuminMainDish: string; // アルブミン-主食
  protein: string;
  nitrite: string;
  uricAcid: string;
  fatBurningScore: number;
  carbScore: number;
  vegetableScore: number;
  waterScore: number;
  saltScore: number;
  vitaminCScore: number;
  magnesiumScore: number;
  calciumScore: number;
  oxidativeStressScore: number;
  zincScore: number;
}

// シード値を使った疑似乱数生成（サーバー/クライアント一致）
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ダミーデータ生成関数
const generateUrineTestData = (): UrineTestData[] => {
  const patientNames = [
    '田中 太郎',
    '佐藤 花子',
    '鈴木 一郎',
    '高橋 美咲',
    '渡辺 健太',
    '伊藤 由美',
    '山本 博',
    '中村 さくら',
    '小林 誠',
    '加藤 愛子',
    '吉田 勇',
    '山田 真理子',
    '佐々木 和也',
    '松本 優子',
    '井上 健一',
  ];

  const results = ['陰性', '微量', '陽性'];
  const normalResults = ['正常', '低値', '高値'];

  const data: UrineTestData[] = [];
  let id = 1;
  let seed = 12345; // 固定シード値

  // 各利用者について、過去30日間のデータを生成
  patientNames.forEach((name, patientIndex) => {
    for (let day = 29; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(8, 0, 0, 0);

      // シード値ベースの値生成
      data.push({
        id: String(id),
        registeredAt: date.toISOString(),
        patientName: name,
        whiteBloodCells: results[Math.floor(seededRandom(seed++) * 3)],
        urobilinogen: normalResults[Math.floor(seededRandom(seed++) * 3)],
        occultBlood: results[Math.floor(seededRandom(seed++) * 3)],
        bilirubin: results[Math.floor(seededRandom(seed++) * 3)],
        glucose: results[Math.floor(seededRandom(seed++) * 3)],
        albuminMainDish: results[Math.floor(seededRandom(seed++) * 3)],
        protein: results[Math.floor(seededRandom(seed++) * 3)],
        nitrite: results[Math.floor(seededRandom(seed++) * 3)],
        uricAcid: normalResults[Math.floor(seededRandom(seed++) * 3)],
        fatBurningScore: Math.floor(seededRandom(seed++) * 40) + 60,
        carbScore: Math.floor(seededRandom(seed++) * 40) + 60,
        vegetableScore: Math.floor(seededRandom(seed++) * 40) + 60,
        waterScore: Math.floor(seededRandom(seed++) * 40) + 60,
        saltScore: Math.floor(seededRandom(seed++) * 40) + 60,
        vitaminCScore: Math.floor(seededRandom(seed++) * 40) + 60,
        magnesiumScore: Math.floor(seededRandom(seed++) * 40) + 60,
        calciumScore: Math.floor(seededRandom(seed++) * 40) + 60,
        oxidativeStressScore: Math.floor(seededRandom(seed++) * 40) + 60,
        zincScore: Math.floor(seededRandom(seed++) * 40) + 60,
      });

      id++;
    }
  });

  // 登録日時の降順でソート
  return data.sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );
};

export const mockUrineTestData: UrineTestData[] = generateUrineTestData();

// 利用者名リストもエクスポート（フィルタリング用）
export const availableUrineTestPatients = [
  '田中 太郎',
  '佐藤 花子',
  '鈴木 一郎',
  '高橋 美咲',
  '渡辺 健太',
  '伊藤 由美',
  '山本 博',
  '中村 さくら',
  '小林 誠',
  '加藤 愛子',
  '吉田 勇',
  '山田 真理子',
  '佐々木 和也',
  '松本 優子',
  '井上 健一',
];
