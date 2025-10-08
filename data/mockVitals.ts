// バイタルデータのダミーデータ

export interface VitalRecord {
  id: string;
  registeredAt: string; // 登録日時
  patientId: string;
  patientName: string;
  floor: string;
  bloodPressure: string; // 血圧 (例: "120/80")
  pulse: number; // 脈拍
  respiratoryRate: number; // 呼吸数 (回/分)
  oxygenSaturation: number; // 酸素飽和度 (SpO2)
  temperature: number; // 体温
  ecg: string; // 心電図 (正常/異常)
  height: number; // 身長 (cm)
  weight: number; // 体重 (kg)
}

// 利用者名リスト
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
  '吉田 勇',
  '山田 真理子',
  '佐々木 和也',
  '松本 優子',
  '井上 健一',
  '木村 千春',
  '林 正雄',
  '清水 恵美',
  '山崎 大輔',
  '森 由紀子',
];

// フロアリスト
const floors = ['1F', '2F', '3F', '4F'];

// バイタルダミーデータ生成関数
const generateVitalRecords = (): VitalRecord[] => {
  const records: VitalRecord[] = [];
  let id = 1;

  // 各利用者について、過去2週間のバイタルデータを生成
  patientNames.forEach((name, index) => {
    const patientId = `P${String(index + 1).padStart(3, '0')}`;
    const floor = floors[index % floors.length];

    // 過去14日間のデータを生成（1日3回測定: 朝・昼・夜）
    for (let day = 13; day >= 0; day--) {
      for (let timeIndex = 0; timeIndex < 3; timeIndex++) {
        const date = new Date();
        date.setDate(date.getDate() - day);

        // 時刻設定（朝7時、昼12時、夜19時）
        const hours = timeIndex === 0 ? 7 : timeIndex === 1 ? 12 : 19;
        date.setHours(hours, Math.floor(Math.random() * 60), 0, 0);

        // バイタル値の生成（個人差を反映）
        const baseBloodPressureHigh = 110 + index * 2;
        const baseBloodPressureLow = 70 + index;
        const basePulse = 65 + index;
        const baseTemperature = 36.0 + index * 0.1;
        const baseWeight = 45 + index * 2;

        // ランダムな変動を追加
        const bloodPressureHigh =
          baseBloodPressureHigh + Math.floor(Math.random() * 20) - 10;
        const bloodPressureLow =
          baseBloodPressureLow + Math.floor(Math.random() * 15) - 7;
        const pulse = basePulse + Math.floor(Math.random() * 20) - 10;
        const respiratoryRate = 15 + Math.floor(Math.random() * 10) - 5; // 呼吸数 10-20回/分
        const oxygenSaturation = 95 + Math.floor(Math.random() * 5);
        const temperature =
          Math.round((baseTemperature + Math.random() * 1.0 - 0.5) * 10) / 10;
        const height = 150 + index * 2; // 身長は固定
        const weight =
          Math.round((baseWeight + Math.random() * 4 - 2) * 10) / 10;

        // 心電図は95%の確率で正常
        const ecg = Math.random() > 0.05 ? '正常' : '異常';

        records.push({
          id: String(id),
          registeredAt: date.toISOString(),
          patientId,
          patientName: name,
          floor,
          bloodPressure: `${bloodPressureHigh}/${bloodPressureLow}`,
          pulse,
          respiratoryRate,
          oxygenSaturation,
          temperature,
          ecg,
          height,
          weight,
        });

        id++;
      }
    }
  });

  // 登録日時の降順でソート
  return records.sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );
};

// エクスポート
export const mockVitalRecords = generateVitalRecords();

// 利用者名リストもエクスポート（フィルタリング用）
export const availablePatientNames = patientNames;

// フロアリストもエクスポート（フィルタリング用）
export const availableFloors = floors;
