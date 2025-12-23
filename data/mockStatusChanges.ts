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

  // かかりつけ情報
  primaryCareType: '病院' | 'クリニック' | '訪問診療' | '救急搬送' | 'なし';

  // 状態変化内容
  changeType: string;
  changeDescription: string;
  supplementaryNote: string;

  // バイタル情報
  temperature?: number;
  bloodPressureHigh?: number;
  bloodPressureLow?: number;
  pulse?: number;
  spo2?: number;

  // 病院・クリニックルート用
  hospitalName?: string;
  hospitalPhone?: string;
  consultationDate?: string;
  consultationTime?: string;
  diagnosis?: string;
  treatmentSummary?: string;
  prescription?: string;
  nextAppointment?: string;

  // 訪問診療ルート用
  visitDoctorName?: string;
  visitDate?: string;
  visitTime?: string;
  visitDiagnosis?: string;
  visitTreatment?: string;
  visitPrescription?: string;
  visitNextDate?: string;

  // 救急搬送ルート用
  emergencyHospital?: string;
  emergencyDate?: string;
  emergencyTime?: string;
  emergencyReason?: string;
  emergencyDiagnosis?: string;
  emergencyTreatment?: string;
  hospitalizationRequired?: boolean;
  hospitalizedDate?: string;
  dischargeDate?: string;

  // 連絡状況
  familyContactDate?: string;
  familyContactTime?: string;
  familyContactPerson?: string;
  familyContactContent?: string;
  careManagerContactDate?: string;
  careManagerContactContent?: string;

  // ステータス
  status: '対応中' | '経過観察中' | '完了';
}

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
    primaryCareType: '病院',
    changeType: '発熱',
    changeDescription: '朝の検温時に38.5度の発熱を確認。咳症状あり。',
    supplementaryNote: '前日から軽い咳があった',
    temperature: 38.5,
    bloodPressureHigh: 135,
    bloodPressureLow: 82,
    pulse: 88,
    spo2: 96,
    hospitalName: '○○総合病院',
    hospitalPhone: '03-1234-5678',
    consultationDate: '2025-12-20',
    consultationTime: '11:00',
    diagnosis: '気管支炎',
    treatmentSummary: '抗生剤処方、安静指示',
    prescription: 'クラリス錠200mg 1日2回',
    nextAppointment: '2025-12-27',
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
    primaryCareType: '訪問診療',
    changeType: '食欲低下',
    changeDescription: '3日前から食事量が半分程度に減少。水分摂取は問題なし。',
    supplementaryNote: '表情は穏やか、痛みの訴えなし',
    temperature: 36.4,
    bloodPressureHigh: 128,
    bloodPressureLow: 76,
    pulse: 72,
    spo2: 98,
    visitDoctorName: '佐藤 医師',
    visitDate: '2025-12-20',
    visitTime: '10:00',
    visitDiagnosis: '軽度の胃腸障害',
    visitTreatment: '整腸剤処方',
    visitPrescription: 'ビオフェルミン錠 1日3回',
    visitNextDate: '2025-12-27',
    familyContactDate: '2025-12-19',
    familyContactTime: '16:00',
    familyContactPerson: '鈴木 美咲（長女）',
    familyContactContent: '食欲低下について報告。訪問診療で対応することを説明。',
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
    primaryCareType: '救急搬送',
    changeType: '意識障害',
    changeDescription: '夕食後、呼びかけに反応が鈍くなり、意識レベル低下を確認。',
    supplementaryNote: '左側に麻痺症状あり',
    temperature: 37.2,
    bloodPressureHigh: 180,
    bloodPressureLow: 95,
    pulse: 92,
    spo2: 94,
    emergencyHospital: '△△救急病院',
    emergencyDate: '2025-12-18',
    emergencyTime: '21:00',
    emergencyReason: '意識障害、左片麻痺',
    emergencyDiagnosis: '脳梗塞',
    emergencyTreatment: 'tPA投与、ICU管理',
    hospitalizationRequired: true,
    hospitalizedDate: '2025-12-18',
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
    primaryCareType: 'クリニック',
    changeType: '皮膚トラブル',
    changeDescription: '右腕に発疹を確認。かゆみを訴えている。',
    supplementaryNote: '食事内容に変化なし',
    temperature: 36.6,
    bloodPressureHigh: 122,
    bloodPressureLow: 74,
    pulse: 68,
    spo2: 99,
    hospitalName: '○○皮膚科クリニック',
    hospitalPhone: '03-9876-5432',
    consultationDate: '2025-12-17',
    consultationTime: '14:00',
    diagnosis: '接触性皮膚炎',
    treatmentSummary: '塗り薬処方',
    prescription: 'リンデロンVG軟膏 1日2回塗布',
    nextAppointment: '2025-12-24',
    familyContactDate: '2025-12-17',
    familyContactTime: '15:00',
    familyContactPerson: '山本 健太（長男）',
    familyContactContent: '皮膚科受診結果を報告。',
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
    primaryCareType: 'なし',
    changeType: '睡眠障害',
    changeDescription: '深夜から早朝にかけて何度も目が覚める状態が続いている。',
    supplementaryNote: '日中の活動量は変化なし',
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

export const changeTypes = [
  '発熱',
  '血圧変動',
  '食欲低下',
  '嘔吐・下痢',
  '呼吸困難',
  '意識障害',
  '転倒後の状態変化',
  '皮膚トラブル',
  '疼痛',
  '睡眠障害',
  '精神状態の変化',
  'その他',
];

export const primaryCareTypes = [
  '病院',
  'クリニック',
  '訪問診療',
  '救急搬送',
  'なし',
];

export const statusOptions = [
  '対応中',
  '経過観察中',
  '完了',
];

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
