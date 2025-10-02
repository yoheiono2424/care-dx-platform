export interface PatientRecord {
  id: number;
  roomNumber: string; // 部屋番号
  name: string; // 氏名
  status: string; // 状況
  age: number; // 年齢
  gender: string; // 性別
  admissionDate: string; // 利用開始日
}

export interface PatientMemo {
  id: number;
  createdAt: string; // 作成日時
  roomNumber: string; // 部屋番号
  patientName: string; // 利用者名
  createdBy: string; // 作成者
  respondedBy: string; // 対応者
  memo: string; // メモ
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 利用者ダミーデータ生成関数
const generatePatientData = (): PatientRecord[] => {
  const names = [
    '山田太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
    '伊藤由美',
    '田中博',
    '中村さくら',
    '小林誠',
    '加藤愛子',
    '山本太一',
    '吉田春子',
    '松本次郎',
    '井上恵子',
    '木村健二',
  ];

  const statuses = ['健康', '要観察', '治療中'];
  const genders = ['男性', '女性'];

  const data: PatientRecord[] = [];
  let seed = 11111;

  names.forEach((name, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(seededRandom(seed++) * 24));
    const admissionDate = date.toISOString().slice(0, 10);

    data.push({
      id: index + 1,
      roomNumber: `${Math.floor(index / 5) + 1}0${(index % 5) + 1}`,
      name: name,
      status: statuses[Math.floor(seededRandom(seed++) * statuses.length)],
      age: Math.floor(seededRandom(seed++) * 30) + 65,
      gender: genders[Math.floor(seededRandom(seed++) * genders.length)],
      admissionDate: admissionDate + ' 10:30',
    });
  });

  return data;
};

// 利用者メモダミーデータ生成関数
const generatePatientMemoData = (): PatientMemo[] => {
  const patientNames = [
    '山田太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
  ];

  const creators = ['鈴木花子', '田中太郎', '佐藤一郎'];
  const responders = ['小林俊樹', '高橋美咲', '渡辺健太'];

  const memoTexts = [
    'メモ,メモ,メモ, ...',
    '定期検診の結果、特に問題なし',
    '食事量が少し減っている。様子を見る',
    '夜間の巡回時、安眠していた',
    'リハビリの進捗良好',
  ];

  const data: PatientMemo[] = [];
  let seed = 22222;

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 30));
    date.setHours(Math.floor(seededRandom(seed++) * 12) + 8);
    date.setMinutes(Math.floor(seededRandom(seed++) * 60));

    const patientIndex = Math.floor(seededRandom(seed++) * patientNames.length);
    const creatorIndex = Math.floor(seededRandom(seed++) * creators.length);
    const responderIndex = Math.floor(seededRandom(seed++) * responders.length);
    const memoIndex = Math.floor(seededRandom(seed++) * memoTexts.length);

    data.push({
      id: i + 1,
      createdAt: date.toISOString().slice(0, 16).replace('T', ' '),
      roomNumber: `${Math.floor(seededRandom(seed++) * 3) + 1}0${Math.floor(seededRandom(seed++) * 9) + 1}`,
      patientName: patientNames[patientIndex],
      createdBy: creators[creatorIndex],
      respondedBy: responders[responderIndex],
      memo: memoTexts[memoIndex],
    });
  }

  // 作成日時の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockPatientData: PatientRecord[] = generatePatientData();
export const mockPatientMemoData: PatientMemo[] = generatePatientMemoData();
