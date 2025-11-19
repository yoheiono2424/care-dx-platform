export interface AccidentReport {
  id: string;
  patientName: string;
  birthDate: string;
  age: number;
  ageAtIncident: number;
  gender: string;
  serviceStartDate: string;
  careLevel: string;
  facilityName: string;
  roomNumber: string;
  buildingName: string;
  floor: string;
  reportDate: string;
  reporterName: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  incidentType: string;
  incidentDescription: string;
  supplementaryNote: string;
  consultationMethod: string;
  hospitalName?: string;
  diagnosis?: string;
  diagnosisDetail?: string;
  treatmentSummary?: string;
}

// モックデータ
export const mockAccidentReports: AccidentReport[] = [
  {
    id: 'AR001',
    patientName: '田中 太郎',
    birthDate: '1940-05-15',
    age: 84,
    ageAtIncident: 84,
    gender: '男性',
    serviceStartDate: '2020-04-01',
    careLevel: '要介護3',
    facilityName: 'メディケア癒しDX京町台',
    roomNumber: '101',
    buildingName: 'メディケア癒しDX',
    floor: '1F',
    reportDate: '2025-11-18',
    reporterName: '佐藤 花子',
    incidentDate: '2025-11-18',
    incidentTime: '14:30',
    location: '居室',
    incidentType: '転倒・転落',
    incidentDescription: 'ベッドから立ち上がろうとした際にバランスを崩し転倒',
    supplementaryNote: '床に血痕あり、頭部打撲の可能性',
    consultationMethod: '受診（外来・往診）',
    hospitalName: '○○病院',
    diagnosis: '頭部打撲',
    diagnosisDetail: '打撲・捻挫・脱臼',
    treatmentSummary: '頭部CT検査、経過観察',
  },
  {
    id: 'AR002',
    patientName: '鈴木 春子',
    birthDate: '1945-03-22',
    age: 79,
    ageAtIncident: 79,
    gender: '女性',
    serviceStartDate: '2021-06-15',
    careLevel: '要介護2',
    facilityName: 'メディケア癒しDX今宿',
    roomNumber: '205',
    buildingName: 'メディケア癒しDX',
    floor: '2F',
    reportDate: '2025-11-17',
    reporterName: '山田 一郎',
    incidentDate: '2025-11-17',
    incidentTime: '10:15',
    location: '浴室',
    incidentType: 'やけど',
    incidentDescription: '入浴介助中、シャワーの温度が高く右腕にやけど',
    supplementaryNote: '皮膚が赤くなっている',
    consultationMethod: '経過観察',
  },
  {
    id: 'AR003',
    patientName: '佐々木 健一',
    birthDate: '1938-12-10',
    age: 86,
    ageAtIncident: 86,
    gender: '男性',
    serviceStartDate: '2019-11-20',
    careLevel: '要介護4',
    facilityName: 'メディケア癒しDX長嶺',
    roomNumber: '302',
    buildingName: 'メディケア癒しDX',
    floor: '3F',
    reportDate: '2025-11-16',
    reporterName: '高橋 美咲',
    incidentDate: '2025-11-16',
    incidentTime: '18:45',
    location: '共有スペース',
    incidentType: '転倒・転落',
    incidentDescription: '車椅子から立ち上がろうとして転倒',
    supplementaryNote: '右膝に痛みを訴えている',
    consultationMethod: '施設内の医師',
    diagnosis: '右膝打撲',
    diagnosisDetail: '打撲・捻挫・脱臼',
    treatmentSummary: '冷却処置、湿布貼付',
  },
];

export const accidentLocations = [
  '居室',
  '共有スペース',
  '浴室',
  '廊下',
  'トイレ',
  '洗面台',
  'トレーニングスペース',
  '送迎先',
  '車内',
  'フロア（ウォークラン）',
  '駐車場',
  '玄関',
  '機能訓練室',
  '公園',
  '活動①の部屋',
  '活動②の部屋',
  '個別の部屋①',
  '個別の部屋②',
  'こども用トイレ',
  'イオンのトイレ',
  '階段',
  '荷物棚スペース',
  '保育室（活動スペース）',
  '保育室（机上スペース）',
  '乳児室',
  '園児棚',
  '本棚',
  'テラス',
  '散歩道中',
];

export const accidentTypes = [
  '転倒・転落',
  'やけど',
  '異食',
  '誤薬・与薬漏れ',
  '感染症・結核',
  '誤嚥・窒息',
  '医療処置関連',
  'その他',
];

export const consultationMethods = [
  '施設内の医師',
  '受診（外来・往診）',
  '救急搬送',
  '経過観察',
  'その他',
];

export const diagnosisDetails = [
  '切傷・擦過傷',
  '打撲・捻挫・脱臼',
  '骨折',
  'その他',
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
