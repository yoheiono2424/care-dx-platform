export interface PharmacyRecord {
  id: number;
  name: string; // 薬局名
  status: string; // 利用ステータス
  pharmacist: string; // 薬剤師名
  appSupport: string; // 服薬管理アプリ対応
  phone: string; // 電話番号
  fax: string; // FAX番号
  createdAt: string; // 作成日
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 薬局ダミーデータ生成関数
const generatePharmacyData = (): PharmacyRecord[] => {
  const pharmacyNames = [
    '福岡薬局',
    'さくら調剤薬局',
    'ひまわり薬局',
    'すずらん調剤薬局',
    'つばさ薬局',
    'みどり調剤薬局',
    'あおば薬局',
    'なごみ調剤薬局',
  ];

  const pharmacists = [
    '山田太郎',
    '佐藤花子',
    '田中健一',
    '鈴木美咲',
    '高橋誠',
  ];

  const statuses = ['利用中', '休止中'];
  const appSupports = ['対応', '非対応'];

  const data: PharmacyRecord[] = [];
  let seed = 44444;

  pharmacyNames.forEach((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 60));

    const pharmacistIndex = Math.floor(
      seededRandom(seed++) * pharmacists.length
    );
    const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);
    const appSupportIndex = Math.floor(
      seededRandom(seed++) * appSupports.length
    );

    data.push({
      id: index + 1,
      name: name,
      status: statuses[statusIndex],
      pharmacist: pharmacists[pharmacistIndex],
      appSupport: appSupports[appSupportIndex],
      phone: `000-0000-000${index}`,
      fax: `00-0000-000${index}`,
      createdAt: date.toISOString().slice(0, 10),
    });
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockPharmacyData: PharmacyRecord[] = generatePharmacyData();
