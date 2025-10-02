export interface CareManagerRecord {
  id: number;
  name: string; // ケアマネ名
  office: string; // 事業所名
  officeNumber: string; // 事業所番号
  personalPhone: string; // 個人電話番号
  officePhone: string; // 事業所電話番号
  fax: string; // FAX番号
  emergencyContact: string; // 緊急連絡先
  address: string; // 所在地
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ケアマネダミーデータ生成関数
const generateCareManagerData = (): CareManagerRecord[] => {
  const names = [
    '山田太郎',
    '佐藤花子',
    '田中健一',
    '鈴木美咲',
    '高橋誠',
    '渡辺由美',
    '伊藤博',
    '中村さくら',
  ];

  const offices = [
    '熊本事業所',
    '福岡ケアセンター',
    'さくら介護支援',
    'あおぞら事業所',
    'みどりケアマネ',
  ];

  const addresses = [
    '熊本県〜〜〜〜',
    '福岡県〜〜〜〜',
    '東京都〜〜〜〜',
    '大阪府〜〜〜〜',
  ];

  const statuses = ['利用中', '休止中'];

  const data: CareManagerRecord[] = [];
  let seed = 55555;

  names.forEach((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 90));

    const officeIndex = Math.floor(seededRandom(seed++) * offices.length);
    const addressIndex = Math.floor(seededRandom(seed++) * addresses.length);
    const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

    data.push({
      id: index + 1,
      name: name,
      office: offices[officeIndex],
      officeNumber: `1234567${index}`,
      personalPhone: `090-1234-567${index}`,
      officePhone: `00-0000-000${index}`,
      fax: `00-0000-000${index}`,
      emergencyContact: `00-0000-000${index}`,
      address: addresses[addressIndex],
      status: statuses[statusIndex],
      createdAt: date.toISOString().slice(0, 10),
    });
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockCareManagerData: CareManagerRecord[] =
  generateCareManagerData();
