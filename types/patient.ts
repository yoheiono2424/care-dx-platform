// 利用者管理の型定義

export interface PatientRecord {
  // 基本情報
  id: number;
  status: string; // 状況
  roomNumber: string; // 部屋番号
  floor: string; // フロア
  name: string; // 氏名
  furigana: string; // フリガナ-半角カナ(スペースなし)
  gender: string; // 性別
  careLevel: string; // 介護度
  schedule7: string; // 別表7
  publicAssistance: string; // 生活保護
  daysOfStay: number; // 在所日数（自動計算）
  referralConfirmation: string; // 紹介業者確認欄
  referralSource: string; // 紹介業者or接触経路
  admissionDate: string; // 利用開始日
  lastUsageDate: string; // 最終利用日
  resumptionDate: string; // 利用再開日
  moveOutDate: string; // 退去日
  moveOutReason: string; // 退去理由
  birthMonth: string; // 誕生月
  birthDate: string; // 生年月日
  age: number; // 年齢（自動計算）

  // 医療・プライマリー
  primary1: string; // プライマリー①
  primary2: string; // プライマリー②
  priorSituation: string; // 入居前状況
  primaryHospital: string; // かかりつけ病院
  primaryDoctor: string; // 主治医
  primaryDoctorTel: string; // 主治医TEL

  // 居宅・ケアマネ
  homeCareFacility: string; // 居宅
  homeCareStaff: string; // 担当
  careManager1: string; // ケアマネ
  careManagerTel: string; // TEL
  careManager2: string; // ケアマネ(2)
  careManagerFax: string; // FAX

  // 緊急連絡先
  emergencyContact1: string; // 緊急連絡先①
  emergencyName1: string; // ①（氏名/続柄）
  emergencyTel1: string; // TEL①
  emergencyContact2: string; // 緊急連絡先②
  emergencyName2: string; // ②（氏名/続柄）
  emergencyTel2: string; // TEL②
  emergencyNotes: string; // 緊急時の特記事項
  visitNotes: string; // 面会注意事項

  // サービス利用
  dayCareProvider: string; // 通所利用先
  dayCareDays: string[]; // 通所利用曜日
  dialysisProvider: string; // 透析先
  dialysisDays: string[]; // 透析利用曜日
  homeVisitService: string; // 訪問サービス
  homeVisitRehab: string; // 訪問リハ
  homeVisitMedical: string; // 訪問診療
  homeVisitDental: string; // 訪問歯科
  pharmacy: string; // 薬局
  welfareEquipment: string; // 福祉用具
  welfareEquipmentContact: string; // 福祉用具連絡先
  diaper: string; // おむつ
  medicalEquipmentMaker: string; // 医療機器メーカー

  // 疾患・医療行為
  disease: string; // 疾患
  diagnosis: string; // 診断名
  medicalHistory: string[]; // 既往歴
  medicalActCount: number; // 医療行為（自動計算）
  tracheostomy: string; // 気切
  suctioning: string; // 痰吸引
  ventilator: string; // 人工呼吸器
  oxygenTherapy: string; // 在宅酸素
  nasalFeeding: string; // 経鼻
  gastrostomy: string; // 胃ろう
  nephrostomy: string; // 腎ろう
  ivh: string; // IVH
  stoma: string; // ストマ
  catheter: string; // バルーン
  cystostomy: string; // 膀胱ろう
  dialysis: string; // 透析
  insulin: string; // インスリン
  pressureUlcer: string; // 褥瘡

  // ADL・ケア
  dailyLivingIndependence: string; // 日常生活自立度 (ランク)
  dementiaIndependence: string; // 認知症高齢者の日常生活自立度
  mobilityStatus: string; // 移動状況
  transfer: string; // 移乗
  mealAssistance: string; // 食介
  roomMeal: string; // 居室でお食事をされている方
  bathAssistTime: string; // 入浴介助時間
  bathAssistLevel: string; // 入浴介助量
  fallHistory: string; // 転倒歴の有無
  userEvaluation: string; // 利用者評価
  familyEvaluation: string; // 家族評価
  mealTextureMain: string; // 食形態 (主食)
  mealTextureSide: string; // 食形態 (副食)
  thickener: string; // とろみ
  dentures: string; // 義歯の有無
  contraindication: string; // 禁忌
  allergy: string; // アレルギー

  // 急変・終末期
  emergencyResponse: string; // 急変時
  emergencyResponseNotes: string; // 急変時-備考
  endOfLife: string; // 終末期
  endOfLifeNotes: string; // 終末期-備考
  chronicDeteriorationResponse: string; // 慢性的な病態の悪化時
  chronicDeteriorationNotes: string; // 慢性的な病態の悪化時-備考
  emergencyTransportRequest: string; // 救急搬送希望

  // 契約・その他
  contract: string; // 契約書
  personalLiabilityInsuranceExpiry: string; // 個人賠償保険期限
  insurer: string; // 保険者
  residenceSpecialException: string; // 住所地特例確認
  mailOpeningPermission: string; // 郵便物 開封許可
  mailOpeningPermissionNotes: string; // 郵便物 開封許可-備考
  hitomeQConsent: string; // HitomeQケアサポート同意
  familyLineUsage: string; // ご家族の公式LINE使用
  portraitRightsConsent: string; // 肖像権の同意
}

// 選択肢の定義
export const patientOptions = {
  status: ['利用中', '退去済み', '一時退所中'],
  gender: ['男性', '女性'],
  careLevel: [
    '要支援1',
    '要支援2',
    '要介護1',
    '要介護2',
    '要介護3',
    '要介護4',
    '要介護5',
  ],
  schedule7: ['該当', '非該当'],
  publicAssistance: ['あり', 'なし'],
  referralConfirmation: ['確認済み', '未確認'],
  referralSource: [
    '紹介業者A',
    '紹介業者B',
    '紹介業者C',
    'ホームページ',
    '口コミ',
    'その他',
  ],
  moveOutReason: ['入院', '死亡退去', '自己都合', '施設都合', 'その他'],
  primary: [
    'プライマリー担当A',
    'プライマリー担当B',
    'プライマリー担当C',
    'プライマリー担当D',
  ],
  priorSituation: ['自宅', '病院', '施設', 'その他'],
  yesNo: ['あり', 'なし'],
  weekdays: ['月', '火', '水', '木', '金', '土', '日'],
  dailyLivingIndependence: ['J1', 'J2', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  dementiaIndependence: ['自立', 'Ⅰ', 'Ⅱa', 'Ⅱb', 'Ⅲa', 'Ⅲb', 'Ⅳ', 'M'],
  mobilityStatus: ['自立', '一部介助', '全介助', '車椅子', '寝たきり'],
  transfer: ['自立', '見守り', '一部介助', '全介助'],
  mealAssistance: ['自立', '見守り', '一部介助', '全介助'],
  roomMeal: ['はい', 'いいえ'],
  bathAssistTime: ['午前', '午後', '夜間'],
  bathAssistLevel: ['自立', '一部介助', '全介助'],
  fallHistory: ['あり', 'なし'],
  evaluation: ['A', 'B', 'C', 'D'],
  mealTexture: ['常食', '軟食', 'きざみ食', 'ミキサー食'],
  thickener: ['不要', '弱とろみ', '中とろみ', '強とろみ'],
  emergencyResponse: ['救急搬送', '主治医連絡', '様子観察', 'その他'],
  endOfLife: ['積極的治療', '緩和ケア', '自然な経過', 'その他'],
  emergencyTransportRequest: ['希望する', '希望しない', '家族判断'],
  contract: ['契約済み', '未契約'],
  insurer: ['国民健康保険', '社会保険', '後期高齢者医療', 'その他'],
  residenceSpecialException: ['該当', '非該当'],
  consent: ['同意する', '同意しない'],
  disease: [
    '高血圧',
    '糖尿病',
    '認知症',
    '脳血管疾患',
    '心疾患',
    'がん',
    'その他',
  ],
  medicalHistory: [
    '高血圧',
    '糖尿病',
    '脳梗塞',
    '心筋梗塞',
    'がん',
    '骨折',
    'その他',
  ],
  dayCareDays: ['月', '火', '水', '木', '金', '土', '日'],
};
