export interface InterventionRecord {
  id: number;
  facilityNumber: string; // 居室番号
  recordDateTime: string; // 記録日時
  startDateTime: string; // 開始日時
  endDateTime: string; // 終了日時
  staffName: string; // スタッフ名
  patientName: string; // 利用者名
  interventionType: string; // 介入区分
  interventionContent: string; // 介入内容
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ダミーデータ生成関数
const generateInterventionData = (): InterventionRecord[] => {
  const patientNames = [
    '鈴木花子',
    '田中太郎',
    '佐藤一郎',
    '高橋美咲',
    '渡辺健太',
    '伊藤由美',
    '山本博',
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

  const interventionTypes = [
    'バイタルチェック',
    '服薬介助',
    '食事介助',
    '排泄介助',
    '入浴介助',
    'リハビリ',
    '見守り',
    '相談・助言',
  ];

  const interventionContents = [
    '血圧測定を実施。問題なし。',
    '朝の服薬を介助。全て服用完了。',
    '昼食の食事介助を実施。完食。',
    'トイレ誘導と排泄介助を実施。',
    '入浴介助を実施。特に問題なし。',
    '歩行訓練を30分実施。',
    '居室での見守りを実施。',
    '家族との面会に立ち会い、相談対応。',
  ];

  const data: InterventionRecord[] = [];
  let seed = 12345;

  // 過去30日間のデータを生成
  for (let day = 29; day >= 0; day--) {
    // 1日あたり3-5件の介入記録
    const recordsPerDay = Math.floor(seededRandom(seed++) * 3) + 3;

    for (let i = 0; i < recordsPerDay; i++) {
      const date = new Date();
      date.setDate(date.getDate() - day);

      // 記録日時（8:00-20:00の間）
      const recordHour = Math.floor(seededRandom(seed++) * 12) + 8;
      const recordMinute = Math.floor(seededRandom(seed++) * 60);
      const recordDateTime = new Date(date);
      recordDateTime.setHours(recordHour, recordMinute, 0);

      // 開始日時
      const startDateTime = new Date(recordDateTime);
      startDateTime.setMinutes(
        startDateTime.getMinutes() - Math.floor(seededRandom(seed++) * 30) - 5
      );

      // 終了日時（開始から10-60分後）
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(
        endDateTime.getMinutes() + Math.floor(seededRandom(seed++) * 50) + 10
      );

      const patientIndex = Math.floor(
        seededRandom(seed++) * patientNames.length
      );
      const staffIndex = Math.floor(seededRandom(seed++) * staffNames.length);
      const interventionIndex = Math.floor(
        seededRandom(seed++) * interventionTypes.length
      );

      data.push({
        id: data.length + 1,
        facilityNumber: `${Math.floor(seededRandom(seed++) * 3) + 1}0${Math.floor(seededRandom(seed++) * 9) + 1}`,
        recordDateTime: recordDateTime
          .toISOString()
          .slice(0, 16)
          .replace('T', ' '),
        startDateTime: startDateTime
          .toISOString()
          .slice(0, 16)
          .replace('T', ' '),
        endDateTime: endDateTime.toISOString().slice(0, 16).replace('T', ' '),
        staffName: staffNames[staffIndex],
        patientName: patientNames[patientIndex],
        interventionType: interventionTypes[interventionIndex],
        interventionContent: interventionContents[interventionIndex],
      });
    }
  }

  // 記録日時の降順でソート
  return data.sort(
    (a, b) =>
      new Date(b.recordDateTime).getTime() -
      new Date(a.recordDateTime).getTime()
  );
};

export const mockInterventionData: InterventionRecord[] =
  generateInterventionData();
