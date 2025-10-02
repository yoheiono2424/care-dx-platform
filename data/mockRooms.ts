// 疑似乱数生成関数
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface RoomRecord {
  id: number;
  roomNumber: string; // 部屋番号
  facility: string; // 施設名
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

const facilities = ['ケアホーム熊本', 'ケアホーム福岡', 'ケアホーム鹿児島'];
const statuses = ['利用中', '休止中'];

// モックデータ生成
export const mockRoomData: RoomRecord[] = Array.from({ length: 12 }, (_, i) => {
  const seed = i * 100;
  const facilityIndex = Math.floor(seededRandom(seed + 1) * facilities.length);
  const statusIndex = Math.floor(seededRandom(seed + 2) * statuses.length);

  // 部屋番号: 101-112
  const roomNumber = (101 + i).toString();

  // 作成日: 2025年9月1日から順に
  const baseDate = new Date('2025-09-01');
  baseDate.setDate(baseDate.getDate() + i);
  const createdAt = baseDate.toISOString().split('T')[0];

  return {
    id: i + 1,
    roomNumber,
    facility: facilities[facilityIndex],
    status: statuses[statusIndex],
    createdAt,
  };
}).reverse(); // 新しい順に並び替え
