// 疑似乱数生成関数
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface AccountRecord {
  id: number;
  staffId: string; // ID
  name: string; // スタッフ名
  email: string; // メールアドレス
  role: string; // 役職
  facility: string; // 施設
  floor: string; // フロア
  emergencyContact: string; // 緊急連絡先
  qualifications: string[]; // 保有資格
  status: string; // 利用ステータス
  notes: string; // 備考
  createdAt: string; // 作成日時
}

const names = [
  '山田太郎',
  '佐藤花子',
  '鈴木一郎',
  '田中美咲',
  '高橋健太',
  '渡辺由美',
];
const roles = ['スタッフ', '管理者', '看護師', '介護士'];
const facilities = ['ケアホーム熊本', 'ケアホーム福岡', 'ケアホーム鹿児島'];
const floors = ['1階', '2階', '3階'];
const statuses = ['利用中', '休止中'];
const qualificationsOptions = [
  ['介護職員初任者研修'],
  ['介護福祉士実務者研修'],
  ['介護職員初任者研修', '介護福祉士実務者研修'],
  ['介護福祉士実務者研修'],
];

// モックデータ生成
export const mockAccountData: AccountRecord[] = Array.from(
  { length: 10 },
  (_, i) => {
    const seed = i * 100;
    const nameIndex = Math.floor(seededRandom(seed + 1) * names.length);
    const roleIndex = Math.floor(seededRandom(seed + 2) * roles.length);
    const facilityIndex = Math.floor(
      seededRandom(seed + 3) * facilities.length
    );
    const floorIndex = Math.floor(seededRandom(seed + 4) * floors.length);
    const statusIndex = Math.floor(seededRandom(seed + 5) * statuses.length);
    const qualIndex = Math.floor(
      seededRandom(seed + 6) * qualificationsOptions.length
    );

    // スタッフID: 000001から順に
    const staffId = String(i + 1).padStart(6, '0');

    // メールアドレス
    const email = `staff${i + 1}@example.com`;

    // 緊急連絡先
    const phone1 = String(Math.floor(seededRandom(seed + 7) * 9000) + 1000);
    const phone2 = String(Math.floor(seededRandom(seed + 8) * 9000) + 1000);
    const phone3 = String(Math.floor(seededRandom(seed + 9) * 9000) + 1000);
    const emergencyContact = `0${phone1.substring(0, 2)}-${phone2}-${phone3}`;

    // 作成日時: 2025年8月10日から順に
    const baseDate = new Date('2025-08-10T11:05:00');
    baseDate.setDate(baseDate.getDate() + i);
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, '0');
    const day = String(baseDate.getDate()).padStart(2, '0');
    const hours = String(baseDate.getHours()).padStart(2, '0');
    const minutes = String(baseDate.getMinutes()).padStart(2, '0');
    const createdAt = `${year}/${month}/${day} ${hours}:${minutes}`;

    return {
      id: i + 1,
      staffId,
      name: names[nameIndex],
      email,
      role: roles[roleIndex],
      facility: facilities[facilityIndex],
      floor: floors[floorIndex],
      emergencyContact,
      qualifications: qualificationsOptions[qualIndex],
      status: statuses[statusIndex],
      notes: '',
      createdAt,
    };
  }
).reverse(); // 新しい順に並び替え
