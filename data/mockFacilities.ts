export interface FacilityRecord {
  id: number;
  name: string; // 施設名
  openDate: string; // 稼働日
  floors: string; // フロア
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

export interface FloorRecord {
  id: number;
  name: string; // フロア名
  type: string; // 種別
  facility: string; // 所属する施設
  parentFloor: string; // 所属するフロア
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 施設ダミーデータ生成関数
const generateFacilityData = (): FacilityRecord[] => {
  const names = ['ケアホーム熊本', '福岡介護施設', 'さくら介護ホーム'];

  const statuses = ['利用中', '休止中'];

  const data: FacilityRecord[] = [];
  let seed = 66666;

  names.forEach((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 180));

    const openDate = new Date(date);
    openDate.setDate(openDate.getDate() + 10);

    const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

    data.push({
      id: index + 1,
      name: name,
      openDate: openDate.toISOString().slice(0, 10),
      floors: 'フロア',
      status: statuses[statusIndex],
      createdAt: date.toISOString().slice(0, 10),
    });
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// フロアダミーデータ生成関数
const generateFloorData = (): FloorRecord[] => {
  const floorNames = ['1階', '1階A', '2階', '2階B', '3階'];
  const types = ['親フロア', '子フロア'];
  const facilities = ['ケアホーム熊本', '福岡介護施設'];

  const statuses = ['利用中', '休止中'];

  const data: FloorRecord[] = [];
  let seed = 77777;

  floorNames.forEach((name, index) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 150));

    const typeIndex = Math.floor(seededRandom(seed++) * types.length);
    const facilityIndex = Math.floor(seededRandom(seed++) * facilities.length);
    const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

    // 子フロアの場合は親フロアを設定、親フロアの場合は「ー」
    const parentFloor = types[typeIndex] === '子フロア' ? '1階' : 'ー';

    data.push({
      id: index + 1,
      name: name,
      type: types[typeIndex],
      facility: facilities[facilityIndex],
      parentFloor: parentFloor,
      status: statuses[statusIndex],
      createdAt: date.toISOString().slice(0, 10),
    });
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockFacilityData: FacilityRecord[] = generateFacilityData();
export const mockFloorData: FloorRecord[] = generateFloorData();
