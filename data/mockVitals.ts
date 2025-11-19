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
  cough: string; // 咳嗽 (なし/湿性/乾性)
  sputumAmount: string; // 痰の量 (小/中/多)
  sputumColor: string; // 痰の色 (透明/白色/黄色/緑色/暗赤・褐色/赤色/ピンク色/錆色)
  sputumConsistency: string; // 痰の性状 (漿液性/粘性/膿性/血性/泡沫状)
}

// 固定シード値を使った疑似乱数生成関数（SSR対応）
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
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
  let seed = 12345; // 固定シード値

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
        date.setHours(hours, Math.floor(seededRandom(seed++) * 60), 0, 0);

        // バイタル値の生成（個人差を反映）
        const baseBloodPressureHigh = 110 + index * 2;
        const baseBloodPressureLow = 70 + index;
        const basePulse = 65 + index;
        const baseTemperature = 36.0 + index * 0.1;
        const baseWeight = 45 + index * 2;

        // ランダムな変動を追加
        const bloodPressureHigh =
          baseBloodPressureHigh + Math.floor(seededRandom(seed++) * 20) - 10;
        const bloodPressureLow =
          baseBloodPressureLow + Math.floor(seededRandom(seed++) * 15) - 7;
        const pulse = basePulse + Math.floor(seededRandom(seed++) * 20) - 10;
        const respiratoryRate = 15 + Math.floor(seededRandom(seed++) * 10) - 5; // 呼吸数 10-20回/分
        const oxygenSaturation = 95 + Math.floor(seededRandom(seed++) * 5);
        const temperature =
          Math.round(
            (baseTemperature + seededRandom(seed++) * 1.0 - 0.5) * 10
          ) / 10;
        const height = 150 + index * 2; // 身長は固定
        const weight =
          Math.round((baseWeight + seededRandom(seed++) * 4 - 2) * 10) / 10;

        // 心電図は95%の確率で正常
        const ecg = seededRandom(seed++) > 0.05 ? '正常' : '異常';

        // 咳嗽（80%の確率でなし）
        const coughOptions = ['なし', '湿性', '乾性'];
        const coughRand = seededRandom(seed++);
        const cough =
          coughRand < 0.8
            ? 'なし'
            : coughOptions[Math.floor((coughRand - 0.8) * 10)];

        // 痰の量（70%の確率で小）
        const sputumAmountOptions = ['小', '中', '多'];
        const sputumAmountRand = seededRandom(seed++);
        const sputumAmount =
          sputumAmountRand < 0.7
            ? '小'
            : sputumAmountOptions[Math.floor((sputumAmountRand - 0.7) * 6.67)];

        // 痰の色（80%の確率で透明）
        const sputumColorOptions = [
          '透明',
          '白色',
          '黄色',
          '緑色',
          '暗赤・褐色',
          '赤色',
          'ピンク色',
          '錆色',
        ];
        const sputumColorRand = seededRandom(seed++);
        const sputumColor =
          sputumColorRand < 0.8
            ? '透明'
            : sputumColorOptions[Math.floor((sputumColorRand - 0.8) * 35)];

        // 痰の性状（70%の確率で漿液性）
        const sputumConsistencyOptions = [
          '漿液性',
          '粘性',
          '膿性',
          '血性',
          '泡沫状',
        ];
        const sputumConsistencyRand = seededRandom(seed++);
        const sputumConsistency =
          sputumConsistencyRand < 0.7
            ? '漿液性'
            : sputumConsistencyOptions[
                Math.floor((sputumConsistencyRand - 0.7) * 13.33)
              ];

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
          cough,
          sputumAmount,
          sputumColor,
          sputumConsistency,
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
