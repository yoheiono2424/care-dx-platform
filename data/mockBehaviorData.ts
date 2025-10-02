export interface BehaviorData {
  id: number;
  date: string;
  patientName: string;
  roomName: string;
  bedTimeAvg: string;
  standUpBedAvg: number;
  standUpOutsideAvg: number;
  standUpTotal: number;
  outsideRoomTimeAvg: string;
  buildingExitCountAvg: number;
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 時間を「○時間○分」形式に変換
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins}分`;
};

// ダミーデータ生成関数
const generateBehaviorData = (): BehaviorData[] => {
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
  ];

  const roomNames = [
    '101号室',
    '102号室',
    '103号室',
    '201号室',
    '202号室',
    '203号室',
    '301号室',
    '302号室',
    '303号室',
    '304号室',
  ];

  const data: BehaviorData[] = [];
  let id = 1;
  let seed = 54321;

  // 各利用者について、過去30日間のデータを生成
  patientNames.forEach((name, patientIndex) => {
    for (let day = 29; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      // 臥床時間: 6-10時間 (360-600分)
      const bedTimeMinutes = Math.floor(seededRandom(seed++) * 240) + 360;

      // 立ち上がり回数: 1-8回
      const standUpBed = Math.floor(seededRandom(seed++) * 8) + 1;
      const standUpOutside = Math.floor(seededRandom(seed++) * 10) + 1;

      // 居室外滞在時間: 1-5時間 (60-300分)
      const outsideTimeMinutes = Math.floor(seededRandom(seed++) * 240) + 60;

      // 離棟の実施回数: 0-3回
      const buildingExit = Math.floor(seededRandom(seed++) * 4);

      data.push({
        id: id,
        date: date.toISOString().split('T')[0],
        patientName: name,
        roomName: roomNames[patientIndex],
        bedTimeAvg: formatTime(bedTimeMinutes),
        standUpBedAvg: standUpBed,
        standUpOutsideAvg: standUpOutside,
        standUpTotal: standUpBed + standUpOutside,
        outsideRoomTimeAvg: formatTime(outsideTimeMinutes),
        buildingExitCountAvg: buildingExit,
      });

      id++;
    }
  });

  // 日付の降順でソート
  return data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

export const mockBehaviorData: BehaviorData[] = generateBehaviorData();
