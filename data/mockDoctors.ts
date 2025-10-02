export interface DoctorRecord {
  id: number;
  name: string; // 医師名
  status: string; // ステータス
  hospital: string; // 所属医療機関
  address: string; // 住所
  phone: string; // 電話番号
  fax: string; // FAX番号
  mobilePhone: string; // 個別携帯番号
  emergencyContact: string; // 緊急連絡先
  createdAt: string; // 登録日時
  notes: string; // 備考
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 医師ダミーデータ生成関数
const generateDoctorData = (): DoctorRecord[] => {
  const doctorNames = [
    '山田太郎',
    '佐藤健一',
    '田中美咲',
    '鈴木一郎',
    '高橋花子',
    '渡辺誠',
    '伊藤由美',
    '中村博',
    '小林さくら',
    '加藤健太',
  ];

  const hospitals = [
    'A病院',
    'B医療センター',
    'Cクリニック',
    'D総合病院',
    'E内科医院',
  ];

  const addresses = [
    '東京都新宿区西新宿1-1-1',
    '東京都渋谷区渋谷2-2-2',
    '東京都港区六本木3-3-3',
    '東京都千代田区丸の内4-4-4',
    '東京都品川区大崎5-5-5',
  ];

  const statuses = ['利用中', '休止中'];

  const data: DoctorRecord[] = [];
  let seed = 33333;

  doctorNames.forEach((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 90));
    date.setHours(Math.floor(seededRandom(seed++) * 12) + 8);
    date.setMinutes(Math.floor(seededRandom(seed++) * 60));

    const hospitalIndex = Math.floor(seededRandom(seed++) * hospitals.length);
    const addressIndex = Math.floor(seededRandom(seed++) * addresses.length);
    const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

    data.push({
      id: index + 1,
      name: name,
      status: statuses[statusIndex],
      hospital: hospitals[hospitalIndex],
      address: addresses[addressIndex],
      phone: `00-0000-000${index}`,
      fax: `00-0000-100${index}`,
      mobilePhone: `000-0000-000${index}`,
      emergencyContact: `000-0000-100${index}`,
      createdAt: date.toISOString().slice(0, 16).replace('T', ' '),
      notes: index % 3 === 0 ? '定期訪問対応可能' : '',
    });
  });

  // 登録日時の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockDoctorData: DoctorRecord[] = generateDoctorData();
