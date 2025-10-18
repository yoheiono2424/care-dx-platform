// 月次決算データの型定義
export interface MonthlySettlementRecord {
  id: number;
  currentStatus: string; // 当月状態
  floor: string; // フロア
  roomNumber: string; // 居室番号
  patientName: string; // 利用者名
  furigana: string; // ﾌﾘｶﾞﾅ
  age: number; // 年齢
  careLevel: string; // 介護度
  plannedIntervention: number; // 予定介入数
  welfare: string; // 生保
  code: string; // コード
  medicalInsurance: string; // 医療保険
  specialManagement: string; // 特管
  initialDays: number; // 初期加算日数
  startDate: string; // 利用開始日
  terminal: string; // ターミナル
  hospitalDischargeGuidance: string; // 退院時指導(医)
  oralCare: string; // 口腔連携
  dailyRecords: { [key: string]: string }; // 日次記録（日付をキーとした記号）
  total: number; // 合計 ※確認中
  careSalesTotal: number; // 介護売上合計 ※確認中
  medicalSalesTotal: number; // 医療売上合計 ※確認中
  hotelCostTotal: number; // ﾎﾃﾙｺｽﾄ合計 ※確認中
  careBurdenRate: string; // 介護負担割合
  medicalBurdenRate: string; // 医療負担割合
  medicalNotes: string; // 医療特記 ※確認中
  medicalPublicExpense: string; // 医療公費 ※確認中
  thickeningUse: string; // とろみ利用
  thickeningStartDate: string; // 開始日
  thickeningEndDate: string; // 終了日
  thickeningConcentration: string; // とろみ濃度
}

// サンプルデータ: 2025年9月の日次記録を生成
const generateDailyRecords = (pattern: string): { [key: string]: string } => {
  const records: { [key: string]: string } = {};
  const daysInMonth = 30; // 9月は30日

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `9/${day}`;

    // パターンに応じてデータを生成
    if (pattern === 'normal') {
      records[dateKey] = '●'; // 介護介入のみ
    } else if (pattern === 'medical') {
      // 医療介入（20 = 看護2回リハ0回）
      records[dateKey] = day % 3 === 0 ? '20' : '●';
    } else if (pattern === 'hospitalized') {
      // 入院中
      if (day >= 10 && day <= 20) {
        records[dateKey] = '■';
      } else {
        records[dateKey] = '●';
      }
    } else if (pattern === 'dayService') {
      // 通所減算あり
      records[dateKey] = day % 7 === 0 ? '▼' : '●';
    } else if (pattern === 'mixed') {
      // 混合パターン
      if (day % 2 === 0) {
        records[dateKey] = '10▼';
      } else {
        records[dateKey] = '●';
      }
    }
  }

  return records;
};

// モックデータ
export const mockMonthlySettlementData: MonthlySettlementRecord[] = [
  {
    id: 1,
    currentStatus: '追跡',
    floor: '3F',
    roomNumber: '305',
    patientName: '橋本美佳子',
    furigana: 'ハシモトミカコ',
    age: 94,
    careLevel: '5',
    plannedIntervention: 3,
    welfare: 'なし',
    code: '.46',
    medicalInsurance: 'ガン',
    specialManagement: '',
    initialDays: 0,
    startDate: '2024/07/01',
    terminal: '循環カテーテル',
    hospitalDischargeGuidance: '',
    oralCare: '',
    dailyRecords: generateDailyRecords('medical'),
    total: 0, // ※確認中
    careSalesTotal: 0, // ※確認中
    medicalSalesTotal: 0, // ※確認中
    hotelCostTotal: 0, // ※確認中
    careBurdenRate: '1割',
    medicalBurdenRate: '1割',
    medicalNotes: '',
    medicalPublicExpense: '',
    thickeningUse: '利用なし',
    thickeningStartDate: '',
    thickeningEndDate: '',
    thickeningConcentration: '',
  },
  {
    id: 2,
    currentStatus: '追跡',
    floor: '3F',
    roomNumber: '306',
    patientName: '竹村一',
    furigana: 'タケムラハジメ',
    age: 91,
    careLevel: '4',
    plannedIntervention: 3,
    welfare: 'なし',
    code: '',
    medicalInsurance: '',
    specialManagement: '',
    initialDays: 0,
    startDate: '2025/04/22',
    terminal: '',
    hospitalDischargeGuidance: '',
    oralCare: '',
    dailyRecords: generateDailyRecords('normal'),
    total: 0, // ※確認中
    careSalesTotal: 0, // ※確認中
    medicalSalesTotal: 0, // ※確認中
    hotelCostTotal: 0, // ※確認中
    careBurdenRate: '1割',
    medicalBurdenRate: '1割',
    medicalNotes: '',
    medicalPublicExpense: '',
    thickeningUse: '利用なし',
    thickeningStartDate: '',
    thickeningEndDate: '',
    thickeningConcentration: '',
  },
  {
    id: 3,
    currentStatus: '追跡',
    floor: '3F',
    roomNumber: '307',
    patientName: '折田マツ',
    furigana: 'オリタマツ',
    age: 93,
    careLevel: '4',
    plannedIntervention: 3,
    welfare: 'なし',
    code: '',
    medicalInsurance: '',
    specialManagement: '',
    initialDays: 0,
    startDate: '2023/09/12',
    terminal: '',
    hospitalDischargeGuidance: '',
    oralCare: '',
    dailyRecords: generateDailyRecords('normal'),
    total: 0, // ※確認中
    careSalesTotal: 0, // ※確認中
    medicalSalesTotal: 0, // ※確認中
    hotelCostTotal: 0, // ※確認中
    careBurdenRate: '1割',
    medicalBurdenRate: '1割',
    medicalNotes: '',
    medicalPublicExpense: '',
    thickeningUse: '利用なし',
    thickeningStartDate: '',
    thickeningEndDate: '',
    thickeningConcentration: '',
  },
  {
    id: 4,
    currentStatus: '追跡',
    floor: '3F',
    roomNumber: '310',
    patientName: '岡本幸',
    furigana: 'オカモトミユキ',
    age: 83,
    careLevel: '5',
    plannedIntervention: 3,
    welfare: 'なし',
    code: '.46',
    medicalInsurance: '特指示',
    specialManagement: '',
    initialDays: 0,
    startDate: '2023/02/10',
    terminal: '循環カテーテル',
    hospitalDischargeGuidance: '',
    oralCare: '',
    dailyRecords: generateDailyRecords('medical'),
    total: 0, // ※確認中
    careSalesTotal: 0, // ※確認中
    medicalSalesTotal: 0, // ※確認中
    hotelCostTotal: 0, // ※確認中
    careBurdenRate: '1割',
    medicalBurdenRate: '1割',
    medicalNotes: '',
    medicalPublicExpense: '',
    thickeningUse: '利用なし',
    thickeningStartDate: '',
    thickeningEndDate: '',
    thickeningConcentration: '',
  },
  {
    id: 5,
    currentStatus: '入院',
    floor: '3F',
    roomNumber: '313',
    patientName: '松尾ミサオ',
    furigana: 'マツオミサオ',
    age: 97,
    careLevel: '4',
    plannedIntervention: 3,
    welfare: 'なし',
    code: '',
    medicalInsurance: '',
    specialManagement: '',
    initialDays: 0,
    startDate: '2021/08/19',
    terminal: '',
    hospitalDischargeGuidance: '',
    oralCare: '',
    dailyRecords: generateDailyRecords('hospitalized'),
    total: 0, // ※確認中
    careSalesTotal: 0, // ※確認中
    medicalSalesTotal: 0, // ※確認中
    hotelCostTotal: 0, // ※確認中
    careBurdenRate: '1割',
    medicalBurdenRate: '1割',
    medicalNotes: '',
    medicalPublicExpense: '',
    thickeningUse: '利用なし',
    thickeningStartDate: '',
    thickeningEndDate: '',
    thickeningConcentration: '',
  },
];
