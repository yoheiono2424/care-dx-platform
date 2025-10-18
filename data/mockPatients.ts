import { PatientRecord } from '@/types/patient';

export interface PatientMemo {
  id: number;
  createdAt: string; // 作成日時
  roomNumber: string; // 部屋番号
  patientName: string; // 利用者名
  createdBy: string; // 作成者
  respondedBy: string; // 対応者
  memo: string; // メモ
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 在所日数を計算する関数
const calculateDaysOfStay = (admissionDate: string): number => {
  const admission = new Date(admissionDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - admission.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// 年齢を計算する関数
const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// 利用者ダミーデータ生成関数
const generatePatientData = (): PatientRecord[] => {
  const names = [
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
    '山本太一',
    '吉田春子',
    '松本次郎',
    '井上恵子',
    '木村健二',
  ];

  const furiganas = [
    'ヤマダタロウ',
    'サトウハナコ',
    'スズキイチロウ',
    'タカハシミサキ',
    'ワタナベケンタ',
    'イトウユミ',
    'タナカヒロシ',
    'ナカムラサクラ',
    'コバヤシマコト',
    'カトウアイコ',
    'ヤマモトタイチ',
    'ヨシダハルコ',
    'マツモトジロウ',
    'イノウエケイコ',
    'キムラケンジ',
  ];

  const statuses = ['利用中', '利用中', '利用中', '退去済み'];
  const genders = ['男性', '女性'];
  const careLevels = [
    '要支援1',
    '要支援2',
    '要介護1',
    '要介護2',
    '要介護3',
    '要介護4',
    '要介護5',
  ];
  const yesNo = ['あり', 'なし'];
  const dailyLivingIndependence = [
    'J1',
    'J2',
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
  ];
  const dementiaIndependence = ['自立', 'Ⅰ', 'Ⅱa', 'Ⅱb', 'Ⅲa', 'Ⅲb', 'Ⅳ', 'M'];

  const data: PatientRecord[] = [];
  let seed = 11111;

  names.forEach((name, index) => {
    const admissionDateObj = new Date();
    admissionDateObj.setMonth(
      admissionDateObj.getMonth() - Math.floor(seededRandom(seed++) * 24)
    );
    const admissionDate = admissionDateObj.toISOString().slice(0, 10);

    // 生年月日を生成（65-95歳）
    const birthDateObj = new Date();
    birthDateObj.setFullYear(
      birthDateObj.getFullYear() - (Math.floor(seededRandom(seed++) * 30) + 65)
    );
    const birthDate = birthDateObj.toISOString().slice(0, 10);
    const birthMonth = birthDateObj.toISOString().slice(0, 7);

    // 最終利用日、利用再開日、退去日
    const lastUsageDateObj = new Date(admissionDate);
    lastUsageDateObj.setDate(lastUsageDateObj.getDate() + 30);
    const lastUsageDate = lastUsageDateObj.toISOString().slice(0, 10);

    const resumptionDateObj = new Date(lastUsageDate);
    resumptionDateObj.setDate(resumptionDateObj.getDate() + 15);
    const resumptionDate = resumptionDateObj.toISOString().slice(0, 10);

    const moveOutDateObj = new Date(admissionDate);
    moveOutDateObj.setMonth(moveOutDateObj.getMonth() + 12);
    const moveOutDate = moveOutDateObj.toISOString().slice(0, 10);

    // 個人賠償保険期限（1年後）
    const insuranceExpiryObj = new Date();
    insuranceExpiryObj.setFullYear(insuranceExpiryObj.getFullYear() + 1);
    const insuranceExpiry = insuranceExpiryObj.toISOString().slice(0, 10);

    // 医療行為のカウント（気切～褥瘡）
    const medicalActs = {
      tracheostomy: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      suctioning: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      ventilator: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      oxygenTherapy: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      nasalFeeding: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      gastrostomy: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      nephrostomy: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      ivh: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      stoma: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      catheter: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      cystostomy: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      dialysis: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      insulin: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      pressureUlcer: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
    };

    const medicalActCount = Object.values(medicalActs).filter(
      (val) => val === 'あり'
    ).length;

    // 通所利用曜日（ランダムに1-3個選択）
    const allDays = ['月', '火', '水', '木', '金', '土', '日'];
    const dayCount = Math.floor(seededRandom(seed++) * 3) + 1;
    const dayCareDays: string[] = [];
    for (let i = 0; i < dayCount; i++) {
      const dayIndex = Math.floor(seededRandom(seed++) * allDays.length);
      if (!dayCareDays.includes(allDays[dayIndex])) {
        dayCareDays.push(allDays[dayIndex]);
      }
    }

    // 透析利用曜日（ランダムに1-3個選択）
    const dialysisCount = Math.floor(seededRandom(seed++) * 3) + 1;
    const dialysisDays: string[] = [];
    for (let i = 0; i < dialysisCount; i++) {
      const dayIndex = Math.floor(seededRandom(seed++) * allDays.length);
      if (!dialysisDays.includes(allDays[dayIndex])) {
        dialysisDays.push(allDays[dayIndex]);
      }
    }

    // 既往歴（ランダムに1-3個選択）
    const allHistory = [
      '高血圧',
      '糖尿病',
      '脳梗塞',
      '心筋梗塞',
      'がん',
      '骨折',
      'その他',
    ];
    const historyCount = Math.floor(seededRandom(seed++) * 3) + 1;
    const medicalHistory: string[] = [];
    for (let i = 0; i < historyCount; i++) {
      const histIndex = Math.floor(seededRandom(seed++) * allHistory.length);
      if (!medicalHistory.includes(allHistory[histIndex])) {
        medicalHistory.push(allHistory[histIndex]);
      }
    }

    data.push({
      // 基本情報
      id: index + 1,
      status: statuses[Math.floor(seededRandom(seed++) * statuses.length)],
      roomNumber: `${Math.floor(index / 5) + 1}0${(index % 5) + 1}`,
      floor: `${Math.floor(index / 5) + 1}階`,
      name: name,
      furigana: furiganas[index],
      gender: genders[Math.floor(seededRandom(seed++) * genders.length)],
      careLevel:
        careLevels[Math.floor(seededRandom(seed++) * careLevels.length)],
      schedule7: ['該当', '非該当'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      publicAssistance: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      daysOfStay: calculateDaysOfStay(admissionDate),
      referralConfirmation: ['確認済み', '未確認'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      referralSource: ['紹介業者A', '紹介業者B', 'ホームページ', '口コミ'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      admissionDate: admissionDate,
      lastUsageDate: lastUsageDate,
      resumptionDate: resumptionDate,
      moveOutDate: moveOutDate,
      moveOutReason: ['入院', '死亡退去', '自己都合', '施設都合'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      birthMonth: birthMonth,
      birthDate: birthDate,
      age: calculateAge(birthDate),

      // 医療・プライマリー
      primary1: ['プライマリー担当A', 'プライマリー担当B'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      primary2: ['プライマリー担当C', 'プライマリー担当D'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      priorSituation: ['自宅', '病院', '施設'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      primaryHospital: '熊本総合病院',
      primaryDoctor: '山田医師',
      primaryDoctorTel: '096-123-4567',

      // 居宅・ケアマネ
      homeCareFacility: 'ケアサポート熊本',
      homeCareStaff: '田中担当',
      careManager1: '佐藤ケアマネ',
      careManagerTel: '096-234-5678',
      careManager2: '鈴木ケアマネ',
      careManagerFax: '096-234-5679',

      // 緊急連絡先
      emergencyContact1: '緊急連絡先①',
      emergencyName1: '山田花子（娘）',
      emergencyTel1: '090-1234-5678',
      emergencyContact2: '緊急連絡先②',
      emergencyName2: '山田次郎（息子）',
      emergencyTel2: '090-2345-6789',
      emergencyNotes: '特になし',
      visitNotes: '面会は事前連絡をお願いします',

      // サービス利用
      dayCareProvider: 'デイサービスセンターA',
      dayCareDays: dayCareDays,
      dialysisProvider: '透析クリニックB',
      dialysisDays: dialysisDays,
      homeVisitService: '訪問介護ステーションC',
      homeVisitRehab: '訪問リハビリD',
      homeVisitMedical: '訪問診療E',
      homeVisitDental: '訪問歯科F',
      pharmacy: 'すみれ薬局',
      welfareEquipment: '福祉用具レンタルG',
      welfareEquipmentContact: '096-345-6789',
      diaper: 'おむつ宅配サービスH',
      medicalEquipmentMaker: '医療機器メーカーI',

      // 疾患・医療行為
      disease: ['高血圧', '糖尿病', '認知症', '心疾患'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      diagnosis: ['アルツハイマー型認知症', '脳血管性認知症', 'その他'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      medicalHistory: medicalHistory,
      medicalActCount: medicalActCount,
      ...medicalActs,

      // ADL・ケア
      dailyLivingIndependence:
        dailyLivingIndependence[
          Math.floor(seededRandom(seed++) * dailyLivingIndependence.length)
        ],
      dementiaIndependence:
        dementiaIndependence[
          Math.floor(seededRandom(seed++) * dementiaIndependence.length)
        ],
      mobilityStatus: ['自立', '一部介助', '全介助', '車椅子'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      transfer: ['自立', '見守り', '一部介助', '全介助'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      mealAssistance: ['自立', '見守り', '一部介助', '全介助'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      roomMeal: ['はい', 'いいえ'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      bathAssistTime: ['午前', '午後', '夜間'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      bathAssistLevel: ['自立', '一部介助', '全介助'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      fallHistory: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      userEvaluation: ['A', 'B', 'C', 'D'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      familyEvaluation: ['A', 'B', 'C', 'D'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      mealTextureMain: ['常食', '軟食', 'きざみ食', 'ミキサー食'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      mealTextureSide: ['常食', '軟食', 'きざみ食', 'ミキサー食'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      thickener: ['不要', '弱とろみ', '中とろみ', '強とろみ'][
        Math.floor(seededRandom(seed++) * 4)
      ] as string,
      dentures: yesNo[Math.floor(seededRandom(seed++) * yesNo.length)],
      contraindication: '特になし',
      allergy: '特になし',

      // 急変・終末期
      emergencyResponse: ['救急搬送', '主治医連絡', '様子観察'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      emergencyResponseNotes: '特記事項なし',
      endOfLife: ['積極的治療', '緩和ケア', '自然な経過'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      endOfLifeNotes: '本人・家族と相談済み',
      chronicDeteriorationResponse: ['救急搬送', '主治医連絡', '様子観察'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      chronicDeteriorationNotes: '特記事項なし',
      emergencyTransportRequest: ['希望する', '希望しない', '家族判断'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,

      // 契約・その他
      contract: ['契約済み', '未契約'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      personalLiabilityInsuranceExpiry: insuranceExpiry,
      insurer: ['国民健康保険', '社会保険', '後期高齢者医療'][
        Math.floor(seededRandom(seed++) * 3)
      ] as string,
      residenceSpecialException: ['該当', '非該当'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      mailOpeningPermission: ['同意する', '同意しない'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      mailOpeningPermissionNotes: '特になし',
      hitomeQConsent: ['同意する', '同意しない'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      familyLineUsage: ['同意する', '同意しない'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
      portraitRightsConsent: ['同意する', '同意しない'][
        Math.floor(seededRandom(seed++) * 2)
      ] as string,
    });
  });

  return data;
};

// 利用者メモダミーデータ生成関数
const generatePatientMemoData = (): PatientMemo[] => {
  const patientNames = [
    '山田太郎',
    '佐藤花子',
    '鈴木一郎',
    '高橋美咲',
    '渡辺健太',
  ];

  const creators = ['鈴木花子', '田中太郎', '佐藤一郎'];
  const responders = ['小林俊樹', '高橋美咲', '渡辺健太'];

  const memoTexts = [
    'メモ,メモ,メモ, ...',
    '定期検診の結果、特に問題なし',
    '食事量が少し減っている。様子を見る',
    '夜間の巡回時、安眠していた',
    'リハビリの進捗良好',
  ];

  const data: PatientMemo[] = [];
  let seed = 22222;

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(seededRandom(seed++) * 30));
    date.setHours(Math.floor(seededRandom(seed++) * 12) + 8);
    date.setMinutes(Math.floor(seededRandom(seed++) * 60));

    const patientIndex = Math.floor(seededRandom(seed++) * patientNames.length);
    const creatorIndex = Math.floor(seededRandom(seed++) * creators.length);
    const responderIndex = Math.floor(seededRandom(seed++) * responders.length);
    const memoIndex = Math.floor(seededRandom(seed++) * memoTexts.length);

    data.push({
      id: i + 1,
      createdAt: date.toISOString().slice(0, 16).replace('T', ' '),
      roomNumber: `${Math.floor(seededRandom(seed++) * 3) + 1}0${Math.floor(seededRandom(seed++) * 9) + 1}`,
      patientName: patientNames[patientIndex],
      createdBy: creators[creatorIndex],
      respondedBy: responders[responderIndex],
      memo: memoTexts[memoIndex],
    });
  }

  // 作成日時の降順でソート
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const mockPatientData: PatientRecord[] = generatePatientData();
export const mockPatientMemoData: PatientMemo[] = generatePatientMemoData();
