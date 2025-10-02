export interface RoomEntryRecord {
  id: number;
  roomNumber: string; // 居室番号
  patientName: string; // 利用者名
  staffName: string; // スタッフ名
  entryDateTime: string; // 入室日時
  exitDateTime: string; // 退室日時
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ダミーデータ生成関数
const generateRoomEntryData = (): RoomEntryRecord[] => {
  const patientNames = [
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
  ];

  const staffNames = [
    '田中太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
  ];

  const data: RoomEntryRecord[] = [];
  let seed = 54321;

  // 過去30日間のデータを生成
  for (let day = 29; day >= 0; day--) {
    // 1日あたり5-10件の入室記録
    const recordsPerDay = Math.floor(seededRandom(seed++) * 6) + 5;

    for (let i = 0; i < recordsPerDay; i++) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      // 入室日時（8:00-18:00の間）
      const entryHour = Math.floor(seededRandom(seed++) * 10) + 8;
      const entryMinute = Math.floor(seededRandom(seed++) * 60);
      const entryDateTime = new Date(date);
      entryDateTime.setHours(entryHour, entryMinute, 0);

      // 退室日時（入室から30分-2時間後）
      const exitDateTime = new Date(entryDateTime);
      exitDateTime.setMinutes(
        exitDateTime.getMinutes() + Math.floor(seededRandom(seed++) * 90) + 30
      );

      const patientIndex = Math.floor(
        seededRandom(seed++) * patientNames.length
      );
      const staffIndex = Math.floor(seededRandom(seed++) * staffNames.length);
      const roomNumber = `${Math.floor(seededRandom(seed++) * 3) + 1}0${Math.floor(seededRandom(seed++) * 9) + 1}`;

      data.push({
        id: data.length + 1,
        roomNumber: roomNumber,
        patientName: patientNames[patientIndex],
        staffName: staffNames[staffIndex],
        entryDateTime: entryDateTime
          .toISOString()
          .slice(0, 16)
          .replace('T', ' '),
        exitDateTime: exitDateTime.toISOString().slice(0, 16).replace('T', ' '),
      });
    }
  }

  // 入室日時の降順でソート
  return data.sort(
    (a, b) =>
      new Date(b.entryDateTime).getTime() - new Date(a.entryDateTime).getTime()
  );
};

export const mockRoomEntryData: RoomEntryRecord[] = generateRoomEntryData();
