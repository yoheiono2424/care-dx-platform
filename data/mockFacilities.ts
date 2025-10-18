import {
  FacilityRecord,
  ParentFloorRecord,
  ChildFloorRecord,
} from '@/types/facility';

// シード値を使った疑似乱数生成（SSR対応）
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
      status: statuses[statusIndex],
      createdAt: date.toISOString().slice(0, 10),
    });
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 親フロアダミーデータ生成関数
const generateParentFloorData = (): ParentFloorRecord[] => {
  const floorNames = ['1階', '2階', '3階'];
  const statuses = ['利用中', '休止中'];

  const data: ParentFloorRecord[] = [];
  let seed = 77777;
  let idCounter = 1;

  // 各施設に対して親フロアを生成
  mockFacilityData.forEach((facility) => {
    // 各施設に2-3個の親フロアを追加
    const numFloors = 2 + Math.floor(seededRandom(seed++) * 2); // 2 or 3

    for (let i = 0; i < numFloors && i < floorNames.length; i++) {
      const date = new Date(facility.createdAt);
      date.setDate(date.getDate() + Math.floor(seededRandom(seed++) * 30));

      const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

      data.push({
        id: idCounter++,
        facilityId: facility.id,
        name: floorNames[i],
        type: '親フロア',
        status: statuses[statusIndex],
        createdAt: date.toISOString().slice(0, 10),
      });
    }
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 子フロアダミーデータ生成関数
const generateChildFloorData = (): ChildFloorRecord[] => {
  const childFloorSuffixes = ['A', 'B', 'C'];
  const statuses = ['利用中', '休止中'];

  const data: ChildFloorRecord[] = [];
  let seed = 88888;
  let idCounter = 1;

  // 各親フロアに対して子フロアを生成
  mockParentFloorData.forEach((parentFloor) => {
    // 各親フロアに1-2個の子フロアを追加
    const numChildFloors = 1 + Math.floor(seededRandom(seed++) * 2); // 1 or 2

    for (let i = 0; i < numChildFloors && i < childFloorSuffixes.length; i++) {
      const date = new Date(parentFloor.createdAt);
      date.setDate(date.getDate() + Math.floor(seededRandom(seed++) * 15));

      const statusIndex = Math.floor(seededRandom(seed++) * statuses.length);

      data.push({
        id: idCounter++,
        facilityId: parentFloor.facilityId,
        parentFloorId: parentFloor.id,
        name: `${parentFloor.name}${childFloorSuffixes[i]}`,
        type: '子フロア',
        status: statuses[statusIndex],
        createdAt: date.toISOString().slice(0, 10),
      });
    }
  });

  // 作成日の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// データ生成（階層順に生成する必要がある）
export const mockFacilityData: FacilityRecord[] = generateFacilityData();
export const mockParentFloorData: ParentFloorRecord[] =
  generateParentFloorData();
export const mockChildFloorData: ChildFloorRecord[] = generateChildFloorData();

// 後方互換性のためのエクスポート（患者管理画面などで使用）
// 親フロアと子フロアを統合したリスト（フロア選択用）
export interface FloorRecord {
  id: number;
  name: string; // フロア名
  type: string; // 種別
  facility: string; // 所属する施設
  parentFloor: string; // 所属するフロア
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

export const mockFloorData: FloorRecord[] = [
  ...mockParentFloorData.map((pf) => ({
    id: pf.id,
    name: pf.name,
    type: pf.type,
    facility: mockFacilityData.find((f) => f.id === pf.facilityId)?.name || '',
    parentFloor: 'ー', // 親フロアは親を持たない
    status: pf.status,
    createdAt: pf.createdAt,
  })),
  ...mockChildFloorData.map((cf) => ({
    id: cf.id + 1000, // IDの重複を避けるため1000を加算
    name: cf.name,
    type: cf.type,
    facility: mockFacilityData.find((f) => f.id === cf.facilityId)?.name || '',
    parentFloor:
      mockParentFloorData.find((pf) => pf.id === cf.parentFloorId)?.name || '',
    status: cf.status,
    createdAt: cf.createdAt,
  })),
].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
