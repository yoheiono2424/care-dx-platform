export interface StatusChange {
  id: string;
  // 基本情報
  patientName: string;
  birthDate: string;
  age: number;
  gender: string;
  serviceStartDate: string;
  careLevel: string;
  facilityName: string;
  roomNumber: string;
  buildingName: string;
  floor: string;

  // 報告情報
  reportDate: string;
  reporterName: string;
  changeDate: string;
  changeTime: string;

  // かかりつけ情報（設計書仕様）
  primaryCare: PrimaryCareType;

  // 状態変化内容（かかりつけ別）
  statusChangeType: StatusChangeType;
  changeDescription: string;
  supplementaryNote: string;

  // 初回対応
  initialResponse: InitialResponseType;

  // 初回対応別の詳細
  observationDetails?: string; // 経過観察詳細
  medicationDetails?: string; // 内服詳細（選択肢または自由入力）
  ivDetails?: string; // 点滴詳細
  medicationIvDetails?: string; // 内服・点滴詳細
  oxygenDetails?: string; // 酸素投与詳細（選択肢または自由入力）
  outpatientDetails?: string; // 外来受診詳細
  transportHospital?: TransportHospitalType; // 搬送先病院

  // バイタル情報
  temperature?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
  pulse?: number;
  spo2?: number;

  // 連絡状況
  familyContactDate?: string;
  familyContactTime?: string;
  familyContactPerson?: string;
  familyContactContent?: string;
  careManagerContactDate?: string;
  careManagerContactContent?: string;

  // ステータス
  status: '対応中' | '経過観察中' | '完了';

  // 旧フィールド（後方互換性のため残す）
  primaryCareType?: '病院' | 'クリニック' | '訪問診療' | '救急搬送' | 'なし';
  changeType?: string;
  hospitalName?: string;
  hospitalPhone?: string;
  consultationDate?: string;
  consultationTime?: string;
  diagnosis?: string;
  treatmentSummary?: string;
  prescription?: string;
  nextAppointment?: string;
  visitDoctorName?: string;
  visitDate?: string;
  visitTime?: string;
  visitDiagnosis?: string;
  visitTreatment?: string;
  visitPrescription?: string;
  visitNextDate?: string;
  emergencyHospital?: string;
  emergencyDate?: string;
  emergencyTime?: string;
  emergencyReason?: string;
  emergencyDiagnosis?: string;
  emergencyTreatment?: string;
  hospitalizationRequired?: boolean;
  hospitalizedDate?: string;
  dischargeDate?: string;
}

// かかりつけ選択肢（設計書仕様）
export type PrimaryCareType =
  | '小山内科クリニック'
  | 'あおぞらクリニック'
  | '武蔵ヶ丘病院'
  | 'グレース'
  | 'その他のかかりつけor予定入院';

export const primaryCareOptions: PrimaryCareType[] = [
  '小山内科クリニック',
  'あおぞらクリニック',
  '武蔵ヶ丘病院',
  'グレース',
  'その他のかかりつけor予定入院',
];

// 状態変化の種類（設計書仕様 - 全かかりつけ共通）
export type StatusChangeType =
  | '発熱'
  | '血圧低下'
  | 'SpO2低下'
  | '嘔吐・下痢'
  | 'その他';

export const statusChangeTypes: StatusChangeType[] = [
  '発熱',
  '血圧低下',
  'SpO2低下',
  '嘔吐・下痢',
  'その他',
];

// 初回対応の種類（設計書仕様 - 全かかりつけ共通）
export type InitialResponseType =
  | '経過観察'
  | '内服'
  | '点滴'
  | '内服・点滴'
  | '酸素投与'
  | '外来受診'
  | '搬送';

export const initialResponseTypes: InitialResponseType[] = [
  '経過観察',
  '内服',
  '点滴',
  '内服・点滴',
  '酸素投与',
  '外来受診',
  '搬送',
];

// 搬送先病院選択肢（設計書仕様 - 全かかりつけ共通）
export type TransportHospitalType =
  | '国立HP'
  | '済生会熊本HP'
  | '武蔵ヶ丘HP'
  | '西日本HP'
  | '熊本中央HP'
  | 'その他';

export const transportHospitals: TransportHospitalType[] = [
  '国立HP',
  '済生会熊本HP',
  '武蔵ヶ丘HP',
  '西日本HP',
  '熊本中央HP',
  'その他',
];

// あおぞらクリニック用 - 内服選択肢
export const aozoraClinicMedicationOptions = [
  'カロナール2錠',
  'カロナール1錠',
  'PL顆粒 3g 3×毎食後',
  'ビオフェルミン',
  'ミヤBM',
  '抗生剤',
  'その他',
];

// あおぞらクリニック用 - 酸素投与選択肢
export const aozoraClinicOxygenOptions = [
  '吸引',
  'O2 0.5L/min 漸増',
  '吸引 + O2 5L/min 漸増',
  'その他',
];

// 武蔵ヶ丘病院用 - 内服選択肢
export const musashigaokaMedicationOptions = [
  'アセトアミノフェン 200mg2T',
  'アセトアミノフェン坐剤200mg 1個 (挿肛)',
  'その他',
];

// 武蔵ヶ丘病院用 - 酸素投与選択肢
export const musashigaokaOxygenOptions = [
  '鼻カニューラ 1L/min',
  '鼻カニューラ1.5L/min',
  '鼻カニューラ2.0L/min',
  '鼻カニューラ2.5L/min',
  '鼻カニューラ3.0L/min',
  'その他',
];

// モックデータ
export const mockStatusChanges: StatusChange[] = [
  {
    id: 'SC001',
    patientName: '田中 太郎',
    birthDate: '1940-05-15',
    age: 84,
    gender: '男性',
    serviceStartDate: '2020-04-01',
    careLevel: '要介護3',
    facilityName: 'メディケア癒しDX京町台',
    roomNumber: '101',
    buildingName: 'メディケア癒しDX',
    floor: '1F',
    reportDate: '2025-12-20',
    reporterName: '佐藤 花子',
    changeDate: '2025-12-20',
    changeTime: '09:30',
    primaryCare: '小山内科クリニック',
    statusChangeType: '発熱',
    changeDescription: '朝の検温時に38.5度の発熱を確認。咳症状あり。',
    supplementaryNote: '前日から軽い咳があった',
    initialResponse: '内服',
    medicationDetails: '解熱剤処方',
    temperature: 38.5,
    bloodPressureHigh: 135,
    bloodPressureLow: 82,
    pulse: 88,
    spo2: 96,
    familyContactDate: '2025-12-20',
    familyContactTime: '12:00',
    familyContactPerson: '田中 一郎（長男）',
    familyContactContent: '発熱と受診結果を報告。様子を見守ることで了承。',
    careManagerContactDate: '2025-12-20',
    careManagerContactContent: '発熱の件を報告済み',
    status: '経過観察中',
  },
  {
    id: 'SC002',
    patientName: '鈴木 春子',
    birthDate: '1945-03-22',
    age: 79,
    gender: '女性',
    serviceStartDate: '2021-06-15',
    careLevel: '要介護2',
    facilityName: 'メディケア癒しDX今宿',
    roomNumber: '205',
    buildingName: 'メディケア癒しDX',
    floor: '2F',
    reportDate: '2025-12-19',
    reporterName: '山田 一郎',
    changeDate: '2025-12-19',
    changeTime: '14:00',
    primaryCare: 'あおぞらクリニック',
    statusChangeType: '嘔吐・下痢',
    changeDescription: '朝から嘔吐2回、下痢3回あり。',
    supplementaryNote: '水分摂取は問題なし',
    initialResponse: '内服',
    medicationDetails: 'ビオフェルミン',
    temperature: 36.4,
    bloodPressureHigh: 128,
    bloodPressureLow: 76,
    pulse: 72,
    spo2: 98,
    familyContactDate: '2025-12-19',
    familyContactTime: '16:00',
    familyContactPerson: '鈴木 美咲（長女）',
    familyContactContent: '症状について報告。内服で対応することを説明。',
    status: '経過観察中',
  },
  {
    id: 'SC003',
    patientName: '佐々木 健一',
    birthDate: '1938-12-10',
    age: 86,
    gender: '男性',
    serviceStartDate: '2019-11-20',
    careLevel: '要介護4',
    facilityName: 'メディケア癒しDX長嶺',
    roomNumber: '302',
    buildingName: 'メディケア癒しDX',
    floor: '3F',
    reportDate: '2025-12-18',
    reporterName: '高橋 美咲',
    changeDate: '2025-12-18',
    changeTime: '20:30',
    primaryCare: '武蔵ヶ丘病院',
    statusChangeType: 'SpO2低下',
    changeDescription: 'SpO2が88%まで低下。呼吸困難感あり。',
    supplementaryNote: '左側に麻痺症状あり',
    initialResponse: '搬送',
    transportHospital: '済生会熊本HP',
    temperature: 37.2,
    bloodPressureHigh: 180,
    bloodPressureLow: 95,
    pulse: 92,
    spo2: 88,
    familyContactDate: '2025-12-18',
    familyContactTime: '21:30',
    familyContactPerson: '佐々木 正男（長男）',
    familyContactContent: '救急搬送の連絡。病院で合流することを確認。',
    careManagerContactDate: '2025-12-19',
    careManagerContactContent: '入院となった旨を報告。今後のケアプラン見直しについて相談。',
    status: '対応中',
  },
  {
    id: 'SC004',
    patientName: '山本 花子',
    birthDate: '1942-08-05',
    age: 82,
    gender: '女性',
    serviceStartDate: '2022-01-10',
    careLevel: '要介護1',
    facilityName: 'メディケア癒しDX京町台',
    roomNumber: '103',
    buildingName: 'メディケア癒しDX',
    floor: '1F',
    reportDate: '2025-12-17',
    reporterName: '佐藤 花子',
    changeDate: '2025-12-17',
    changeTime: '10:00',
    primaryCare: 'グレース',
    statusChangeType: '発熱',
    changeDescription: '37.8度の発熱を確認。',
    supplementaryNote: '食事内容に変化なし',
    initialResponse: '経過観察',
    observationDetails: '2時間おきにバイタル測定実施',
    temperature: 37.8,
    bloodPressureHigh: 122,
    bloodPressureLow: 74,
    pulse: 68,
    spo2: 99,
    familyContactDate: '2025-12-17',
    familyContactTime: '15:00',
    familyContactPerson: '山本 健太（長男）',
    familyContactContent: '発熱について報告。経過観察中。',
    status: '完了',
  },
  {
    id: 'SC005',
    patientName: '伊藤 次郎',
    birthDate: '1935-11-20',
    age: 89,
    gender: '男性',
    serviceStartDate: '2018-05-01',
    careLevel: '要介護5',
    facilityName: 'メディケア癒しDX今宿',
    roomNumber: '201',
    buildingName: 'メディケア癒しDX',
    floor: '2F',
    reportDate: '2025-12-16',
    reporterName: '田村 太郎',
    changeDate: '2025-12-16',
    changeTime: '06:00',
    primaryCare: 'その他のかかりつけor予定入院',
    statusChangeType: 'その他',
    changeDescription: '深夜から早朝にかけて何度も目が覚める状態が続いている。',
    supplementaryNote: '日中の活動量は変化なし',
    initialResponse: '経過観察',
    observationDetails: '睡眠パターンを記録中',
    temperature: 36.2,
    bloodPressureHigh: 130,
    bloodPressureLow: 78,
    pulse: 70,
    spo2: 97,
    familyContactDate: '2025-12-16',
    familyContactTime: '10:00',
    familyContactPerson: '伊藤 美智子（妻）',
    familyContactContent: '睡眠状態について報告。様子を見ることで了承。',
    status: '経過観察中',
  },
];

// 旧定義（後方互換性のため残す）
export const changeTypes = [
  '発熱',
  '血圧低下',
  'SpO2低下',
  '嘔吐・下痢',
  'その他',
];

export const primaryCareTypes = [
  '小山内科クリニック',
  'あおぞらクリニック',
  '武蔵ヶ丘病院',
  'グレース',
  'その他のかかりつけor予定入院',
];

export const statusOptions = ['対応中', '経過観察中', '完了'];

export const facilityNames = [
  'メディケア癒しDX京町台',
  'メディケア癒しDX今宿',
  'メディケア癒しDX長嶺',
  'メディケア癒し花園',
  'グッドファイブ熊本',
  'グッドファイブ福岡',
  'ケンプロ24',
  'ホコル健軍',
  'ホコル琴平',
  'ホコル福岡',
  'ラポァレ健軍',
  'ラポァレ熊本(センター)',
  'ラポァレ熊本(放課後デイサービス)',
  'ラポァレ福岡',
  'チャレッジ保育園',
  'ラシクアーレ(介護)',
  'ラシクアーレ(看護)',
  'ウォークラン健軍',
  'ウォークラン福岡',
  '脳梗塞リハビリセンター',
  'YOU8',
  '本部',
];
