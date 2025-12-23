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

// 選択肢の定義（設計書に基づく）
export const patientOptions = {
  // 基本情報
  status: ['利用中', '停止中'],
  gender: ['男', '女'],
  careLevel: ['１', '２', '３', '４', '５'],
  schedule7: ['なし', 'あり'],
  publicAssistance: ['なし', 'あり'],
  moveOutReason: [
    '自宅復帰',
    '退院の目処が立たず退去',
    '強制退去',
    'リハビリが十分でない',
    '金額面での不満',
    'その他施設へ住み替え',
    '入院後そのまま医療機関で療養',
    '虐待を疑われて',
    'スタッフの対応不良',
    '施設内ご逝去',
    '入院先で死亡退院',
    '当月看取り',
    'お看取り',
  ],
  birthMonth: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],

  // 医療・プライマリー
  priorSituation: [
    '病院',
    '自宅',
    'ｻ高住',
    '特養',
    '有料',
    '老健',
    '障害者施設',
    'ｸﾞﾙｰﾌﾟﾎｰﾑ',
    '看多機',
    '小多機',
    '介護医療院',
    'ｼｮｰﾄｽﾃｲ',
    '不明',
    'その他',
  ],

  // 緊急連絡先
  emergencyRelationship: [
    '不明',
    '妻',
    '長男',
    '長女',
    '息子',
    '兄',
    '姉',
    '次男',
    '娘',
    '夫',
    '姪',
    '次女',
    '息子嫁',
    '甥',
    '弟',
    '元夫',
    '友人・知人',
    '孫',
    '後見人',
    '妹',
    '娘旦那',
    '次男妻',
    '義理の妹',
    '長男妻',
    '三男',
    '娘(連子)',
    '三女',
    '旦那',
    '婿',
    '長男・長男嫁',
    '先輩',
    '内縁の妻',
    '元妻',
    '父',
    '義理息子',
  ],

  // サービス利用
  weekdays: ['月', '火', '水', '木', '金', '土', '日'],
  dayCareDays: ['月', '火', '水', '木', '金', '土', '日'],
  dialysisDays: ['月', '火', '水', '木', '金', '土', '日'],
  diaper: ['A-B', 'A-C', '行政', 'Aのみなくなり次第注文', 'Aのみ'],

  // 疾患・医療行為
  disease: [
    '悪生新生物(がん)',
    '血液及び造血器の疾患',
    '内分泌・代謝疾患(糖尿病など)',
    '精神及び行動の障害(精神疾患)',
    '神経系疾患',
    '循環器系疾患',
    '呼吸器系疾患',
    '消化器系疾患',
    '筋骨格系および結合組織の疾患',
    '腎臓・泌尿器系疾患',
    '脳血管疾患',
  ],
  yesNo: ['あり', 'なし'],
  medicalActs: ['あり', 'なし'], // 気切〜褥瘡（14項目）用

  // ADL・ケア
  dailyLivingIndependence: [
    'ランクJ:1.交通機関等を利用して外出する',
    'ランクJ:2.隣近所へなら外出する',
    'ランクA:1.介助により外出し日中はほとんどベッドから離れて生活する',
    'ランクA:2.外出の頻度が少なく日中も寝たり起きたりの生活をしている',
    'ランクB:1.車いすに移乗し食事排泄はベッドから離れて行う',
    'ランクB:2.介助により車いすに移乗する',
    'ランクC:1.自力で寝返りをうつ',
    'ランクC:2.自力では寝返りもうてない',
  ],
  dementiaIndependence: ['Ⅰ', 'Ⅱa', 'Ⅱb', 'Ⅲa', 'Ⅲb', 'Ⅳ', 'Ⅴ'],
  mobilityStatus: ['寝たきり', '車椅子', '歩行'],
  transfer: ['自立', '見守り', '一人介助', '二人介助', 'ストレッチャー'],
  mealAssistance: [
    '経管栄養',
    '自力摂取',
    '10分以内',
    '10分以上',
    '20分以上',
    '30分以上',
  ],
  roomMeal: ['あり', 'なし'],
  bathAssistTime: ['30分以内', '30分以上60分未満', '60分以上'],
  bathAssistLevel: [
    '自立',
    '見守り',
    '一人介助',
    '二人介助（移乗のみ）',
    '二人介助（洗体含む）',
  ],
  fallHistory: [
    '転倒歴なし',
    '入所前にあり',
    '入所後に1回あり',
    '入所後2回あり',
    '入所後3回以上',
  ],
  evaluation: ['１', '２', '３', '４', '５'], // 利用者評価・家族評価共通
  mealTextureMain: [
    'ご飯(常食)',
    '軟飯(二度炊き)',
    '全粥',
    'ミキサー粥',
    '経管栄養',
    '点滴のみ',
  ],
  mealTextureSide: [
    '形(常食)',
    '一口大',
    '刻み',
    'ソフト',
    'ミキサー',
    'ゼリー',
    '経管栄養',
    '点滴のみ',
  ],
  thickener: [
    '【熊本】薄とろみ200ml',
    '【熊本】中間とろみ200ml',
    '【熊本】濃いとろみ200ml',
    '【福岡】極うすめ100ml/200ml',
    '【福岡】薄とろみ100ml/200ml',
    '【福岡】中間とろみ100ml/200ml',
    '【福岡】濃いとろみ100ml/200ml',
  ],
  dentures: ['あり(部分入れ歯)', 'あり(総入れ歯)', 'なし'],

  // 急変・終末期
  emergencyResponse: [
    '救急病院への搬送を望む',
    '主治医の判断に委ねる',
    '望まない・自然な形で良い',
    '今は分からない',
  ],
  endOfLife: [
    '施設',
    '望まない・自然な形で良い',
    '救急病院への搬送を望む',
    '今は分からない',
  ],
  chronicDeteriorationResponse: [
    '施設でできる範囲で',
    '望まない・自然な形で良い',
    '救急病院への搬送を望む',
  ],

  // 契約・その他
  contract: ['契約済み', '未契約'],
  insurer: ['国民健康保険', '社会保険', '後期高齢者医療', 'その他'],
  residenceSpecialException: ['該当', '非該当'],
  consent: ['同意する', '同意しない'],

  // 後方互換性のための統合オプション
  mealTexture: [
    'ご飯(常食)',
    '軟飯(二度炊き)',
    '全粥',
    'ミキサー粥',
    '経管栄養',
    '点滴のみ',
    '形(常食)',
    '一口大',
    '刻み',
    'ソフト',
    'ミキサー',
    'ゼリー',
  ],

  // 救急搬送希望（病院選択が必要だが、暫定対応）
  emergencyTransportRequest: [
    '希望する',
    '希望しない',
    '家族判断',
  ],

  // 既往歴（複数選択可）
  medicalHistory: [
    '高血圧',
    '糖尿病',
    '脳梗塞',
    '心筋梗塞',
    'がん',
    '骨折',
    'その他',
  ],

  // ※バックエンド実装までの暫定プレースホルダー
  // 以下の項目は本来マスタテーブルから取得するが、バックエンド実装まで暫定表示
  referralConfirmation: ['確認済み', '未確認', '確認中'],
  referralSource: [
    'みんかい',
    'くらし計画',
    '高齢者住宅情報プラザ',
    'ホームページ',
    'ケアマネ紹介',
    '医療機関紹介',
    'その他',
  ],
  primary: [
    'スタッフA',
    'スタッフB',
    'スタッフC',
    'スタッフD',
  ],

  // ※以下はバックエンド実装時にマスタテーブルから取得する項目
  // - 紹介業者確認欄: referral_agencies テーブル（38社）
  // - 紹介業者or接触経路: referral_sources テーブル（65項目）
  // - かかりつけ病院: hospitals テーブル（100施設以上）
  // - 居宅: care_facilities テーブル（500施設以上）
  // - 通所利用先: day_care_providers テーブル（50施設以上）
  // - 透析先: dialysis_providers テーブル（5施設）
  // - 訪問サービス: home_visit_services テーブル（12社）
  // - 訪問リハ: rehab_providers テーブル（17施設）
  // - 訪問診療: doctors テーブル（60施設以上）
  // - 訪問歯科: dental_providers テーブル（33施設）
  // - 薬局: pharmacies テーブル（19社）
  // - 福祉用具: welfare_equipment_providers テーブル（21社）
  // - 救急搬送希望: hospitals テーブル（300施設以上）
};
