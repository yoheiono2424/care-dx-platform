'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { PatientRecord, patientOptions } from '@/types/patient';
import { mockPatientData } from '@/data/mockPatients';
import { mockDoctorData } from '@/data/mockDoctors';
import { mockCareManagerData } from '@/data/mockCareManagers';
import { mockPharmacyData } from '@/data/mockPharmacies';
import { mockRoomData } from '@/data/mockRooms';
import { mockFloorData } from '@/data/mockFacilities';

export default function PatientEditPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params.id);

  // 利用者データを取得
  const patient = mockPatientData.find((p) => p.id === patientId);

  // 初期フォームデータ（既存データを読み込み）
  const [formData, setFormData] = useState<Partial<PatientRecord>>(
    patient || {
      id: 0,
      status: '',
      roomNumber: '',
      floor: '',
      name: '',
      furigana: '',
      gender: '',
      careLevel: '',
      schedule7: '',
      publicAssistance: '',
      referralConfirmation: '',
      referralSource: '',
      admissionDate: '',
      lastUsageDate: '',
      resumptionDate: '',
      moveOutDate: '',
      moveOutReason: '',
      birthMonth: '',
      birthDate: '',
      primary1: '',
      primary2: '',
      priorSituation: '',
      primaryHospital: '',
      primaryDoctor: '',
      primaryDoctorTel: '',
      homeCareFacility: '',
      homeCareStaff: '',
      careManager1: '',
      careManagerTel: '',
      careManager2: '',
      careManagerFax: '',
      emergencyContact1: '',
      emergencyName1: '',
      emergencyTel1: '',
      emergencyContact2: '',
      emergencyName2: '',
      emergencyTel2: '',
      emergencyNotes: '',
      visitNotes: '',
      dayCareProvider: '',
      dayCareDays: [],
      dialysisProvider: '',
      dialysisDays: [],
      homeVisitService: '',
      homeVisitRehab: '',
      homeVisitMedical: '',
      homeVisitDental: '',
      pharmacy: '',
      welfareEquipment: '',
      welfareEquipmentContact: '',
      diaper: '',
      medicalEquipmentMaker: '',
      disease: '',
      diagnosis: '',
      medicalHistory: [],
      tracheostomy: '',
      suctioning: '',
      ventilator: '',
      oxygenTherapy: '',
      nasalFeeding: '',
      gastrostomy: '',
      nephrostomy: '',
      ivh: '',
      stoma: '',
      catheter: '',
      cystostomy: '',
      dialysis: '',
      insulin: '',
      pressureUlcer: '',
      dailyLivingIndependence: '',
      dementiaIndependence: '',
      mobilityStatus: '',
      transfer: '',
      mealAssistance: '',
      roomMeal: '',
      bathAssistTime: '',
      bathAssistLevel: '',
      fallHistory: '',
      userEvaluation: '',
      familyEvaluation: '',
      mealTextureMain: '',
      mealTextureSide: '',
      thickener: '',
      dentures: '',
      contraindication: '',
      allergy: '',
      emergencyResponse: '',
      emergencyResponseNotes: '',
      endOfLife: '',
      endOfLifeNotes: '',
      chronicDeteriorationResponse: '',
      chronicDeteriorationNotes: '',
      emergencyTransportRequest: '',
      contract: '',
      personalLiabilityInsuranceExpiry: '',
      insurer: '',
      residenceSpecialException: '',
      mailOpeningPermission: '',
      mailOpeningPermissionNotes: '',
      hitomeQConsent: '',
      familyLineUsage: '',
      portraitRightsConsent: '',
    }
  );

  // 自動計算項目（表示のみ）
  const [daysOfStay, setDaysOfStay] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [medicalActCount, setMedicalActCount] = useState<number>(0);

  // 利用開始日から在所日数を自動計算
  useEffect(() => {
    if (formData.admissionDate) {
      const admission = new Date(formData.admissionDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - admission.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysOfStay(diffDays);
    } else {
      setDaysOfStay(0);
    }
  }, [formData.admissionDate]);

  // 生年月日から年齢を自動計算
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(0);
    }
  }, [formData.birthDate]);

  // 医療行為の数を自動計算
  useEffect(() => {
    const medicalActs = [
      formData.tracheostomy,
      formData.suctioning,
      formData.ventilator,
      formData.oxygenTherapy,
      formData.nasalFeeding,
      formData.gastrostomy,
      formData.nephrostomy,
      formData.ivh,
      formData.stoma,
      formData.catheter,
      formData.cystostomy,
      formData.dialysis,
      formData.insulin,
      formData.pressureUlcer,
    ];
    const count = medicalActs.filter((act) => act === 'あり').length;
    setMedicalActCount(count);
  }, [
    formData.tracheostomy,
    formData.suctioning,
    formData.ventilator,
    formData.oxygenTherapy,
    formData.nasalFeeding,
    formData.gastrostomy,
    formData.nephrostomy,
    formData.ivh,
    formData.stoma,
    formData.catheter,
    formData.cystostomy,
    formData.dialysis,
    formData.insulin,
    formData.pressureUlcer,
  ]);

  // 通所利用曜日のチェックボックス変更
  const handleDayCareDaysChange = (day: string) => {
    const currentDays = formData.dayCareDays || [];
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        dayCareDays: currentDays.filter((d) => d !== day),
      });
    } else {
      setFormData({ ...formData, dayCareDays: [...currentDays, day] });
    }
  };

  // 透析利用曜日のチェックボックス変更
  const handleDialysisDaysChange = (day: string) => {
    const currentDays = formData.dialysisDays || [];
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        dialysisDays: currentDays.filter((d) => d !== day),
      });
    } else {
      setFormData({ ...formData, dialysisDays: [...currentDays, day] });
    }
  };

  // 既往歴のチェックボックス変更
  const handleMedicalHistoryChange = (history: string) => {
    const currentHistory = formData.medicalHistory || [];
    if (currentHistory.includes(history)) {
      setFormData({
        ...formData,
        medicalHistory: currentHistory.filter((h) => h !== history),
      });
    } else {
      setFormData({
        ...formData,
        medicalHistory: [...currentHistory, history],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    console.log('更新データ:', formData);
    router.push(`/patients/${patientId}`);
  };

  if (!patient) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">利用者が見つかりません</p>
            <Button
              variant="outline"
              onClick={() => router.push('/patients')}
              className="mt-4"
            >
              一覧に戻る
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/patients/${patientId}`)}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 詳細に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">利用者編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          {/* セクション1: 基本情報 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              基本情報
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* ID（読み取り専用） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID
                </label>
                <input
                  type="text"
                  value={formData.id}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* 状況 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状況
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.status.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 部屋番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  部屋番号
                </label>
                <select
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockRoomData
                    .filter(
                      (room) =>
                        room.status === '空室' ||
                        room.roomNumber === formData.roomNumber
                    )
                    .map((room) => (
                      <option key={room.id} value={room.roomNumber}>
                        {room.roomNumber}
                      </option>
                    ))}
                </select>
              </div>

              {/* フロア */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フロア
                </label>
                <select
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockFloorData.map((floor) => (
                    <option key={floor.id} value={floor.name}>
                      {floor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 氏名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  氏名
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* フリガナ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フリガナ
                </label>
                <input
                  type="text"
                  value={formData.furigana}
                  onChange={(e) =>
                    setFormData({ ...formData, furigana: e.target.value })
                  }
                  placeholder="半角カナ（スペースなし）"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 性別 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性別
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.gender.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 介護度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  介護度
                </label>
                <select
                  value={formData.careLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, careLevel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.careLevel.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 別表7 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  別表7
                </label>
                <select
                  value={formData.schedule7}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule7: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.schedule7.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 生活保護 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生活保護
                </label>
                <select
                  value={formData.publicAssistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publicAssistance: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.publicAssistance.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 在所日数（自動計算） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  在所日数（自動計算）
                </label>
                <input
                  type="text"
                  value={`${daysOfStay}日`}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* 紹介業者確認欄 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  紹介業者確認欄
                </label>
                <select
                  value={formData.referralConfirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referralConfirmation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.referralConfirmation.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 紹介業者or接触経路 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  紹介業者or接触経路
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referralSource: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.referralSource.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 利用開始日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利用開始日
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 最終利用日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最終利用日
                </label>
                <input
                  type="date"
                  value={formData.lastUsageDate}
                  onChange={(e) =>
                    setFormData({ ...formData, lastUsageDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 利用再開日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利用再開日
                </label>
                <input
                  type="date"
                  value={formData.resumptionDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resumptionDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 退去日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  退去日
                </label>
                <input
                  type="date"
                  value={formData.moveOutDate}
                  onChange={(e) =>
                    setFormData({ ...formData, moveOutDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 退去理由 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  退去理由
                </label>
                <select
                  value={formData.moveOutReason}
                  onChange={(e) =>
                    setFormData({ ...formData, moveOutReason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.moveOutReason.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 誕生月 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  誕生月
                </label>
                <input
                  type="text"
                  value={formData.birthMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, birthMonth: e.target.value })
                  }
                  placeholder="例: 4月"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 生年月日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生年月日
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 年齢（自動計算） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年齢（自動計算）
                </label>
                <input
                  type="text"
                  value={`${age}歳`}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* セクション2: 医療・プライマリー */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              医療・プライマリー
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* プライマリー① */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プライマリー①
                </label>
                <select
                  value={formData.primary1}
                  onChange={(e) =>
                    setFormData({ ...formData, primary1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.primary.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* プライマリー② */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プライマリー②
                </label>
                <select
                  value={formData.primary2}
                  onChange={(e) =>
                    setFormData({ ...formData, primary2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.primary.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 入居前状況 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入居前状況
                </label>
                <select
                  value={formData.priorSituation}
                  onChange={(e) =>
                    setFormData({ ...formData, priorSituation: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.priorSituation.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* かかりつけ病院 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  かかりつけ病院
                </label>
                <input
                  type="text"
                  value={formData.primaryHospital}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryHospital: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 主治医 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主治医
                </label>
                <select
                  value={formData.primaryDoctor}
                  onChange={(e) =>
                    setFormData({ ...formData, primaryDoctor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockDoctorData
                    .filter((doctor) => doctor.status === '稼働中')
                    .map((doctor) => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* 主治医TEL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  主治医TEL
                </label>
                <input
                  type="tel"
                  value={formData.primaryDoctorTel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryDoctorTel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* セクション3: 居宅・ケアマネ */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              居宅・ケアマネ
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 居宅 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  居宅
                </label>
                <select
                  value={formData.homeCareFacility}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeCareFacility: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockCareManagerData
                    .filter((cm) => cm.status === '稼働中')
                    .map((cm) => (
                      <option key={cm.id} value={cm.office}>
                        {cm.office}
                      </option>
                    ))}
                </select>
              </div>

              {/* 担当 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  担当
                </label>
                <input
                  type="text"
                  value={formData.homeCareStaff}
                  onChange={(e) =>
                    setFormData({ ...formData, homeCareStaff: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ケアマネ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ケアマネ
                </label>
                <select
                  value={formData.careManager1}
                  onChange={(e) =>
                    setFormData({ ...formData, careManager1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockCareManagerData
                    .filter((cm) => cm.status === '稼働中')
                    .map((cm) => (
                      <option key={cm.id} value={cm.name}>
                        {cm.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* TEL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TEL
                </label>
                <input
                  type="tel"
                  value={formData.careManagerTel}
                  onChange={(e) =>
                    setFormData({ ...formData, careManagerTel: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ケアマネ(2) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ケアマネ(2)
                </label>
                <select
                  value={formData.careManager2}
                  onChange={(e) =>
                    setFormData({ ...formData, careManager2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockCareManagerData
                    .filter((cm) => cm.status === '稼働中')
                    .map((cm) => (
                      <option key={cm.id} value={cm.name}>
                        {cm.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* FAX */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FAX
                </label>
                <input
                  type="tel"
                  value={formData.careManagerFax}
                  onChange={(e) =>
                    setFormData({ ...formData, careManagerFax: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* セクション4: 緊急連絡先 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              緊急連絡先
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 緊急連絡先① */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  緊急連絡先①
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ①（氏名/続柄） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ①（氏名/続柄）
                </label>
                <input
                  type="text"
                  value={formData.emergencyName1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyName1: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* TEL① */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TEL①
                </label>
                <input
                  type="tel"
                  value={formData.emergencyTel1}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyTel1: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 緊急連絡先② */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  緊急連絡先②
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ②（氏名/続柄） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ②（氏名/続柄）
                </label>
                <input
                  type="text"
                  value={formData.emergencyName2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyName2: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* TEL② */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TEL②
                </label>
                <input
                  type="tel"
                  value={formData.emergencyTel2}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyTel2: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 緊急時の特記事項 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  緊急時の特記事項
                </label>
                <textarea
                  value={formData.emergencyNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 面会注意事項 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  面会注意事項
                </label>
                <textarea
                  value={formData.visitNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, visitNotes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* セクション5: サービス利用 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              サービス利用
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 通所利用先 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通所利用先
                </label>
                <input
                  type="text"
                  value={formData.dayCareProvider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dayCareProvider: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 通所利用曜日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  通所利用曜日
                </label>
                <div className="flex flex-wrap gap-2">
                  {patientOptions.weekdays.map((day) => (
                    <label
                      key={day}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(formData.dayCareDays || []).includes(day)}
                        onChange={() => handleDayCareDaysChange(day)}
                        className="mr-1"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 透析先 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  透析先
                </label>
                <input
                  type="text"
                  value={formData.dialysisProvider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dialysisProvider: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 透析利用曜日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  透析利用曜日
                </label>
                <div className="flex flex-wrap gap-2">
                  {patientOptions.weekdays.map((day) => (
                    <label
                      key={day}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(formData.dialysisDays || []).includes(day)}
                        onChange={() => handleDialysisDaysChange(day)}
                        className="mr-1"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 訪問サービス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問サービス
                </label>
                <input
                  type="text"
                  value={formData.homeVisitService}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeVisitService: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 訪問リハ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問リハ
                </label>
                <input
                  type="text"
                  value={formData.homeVisitRehab}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeVisitRehab: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 訪問診療 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問診療
                </label>
                <input
                  type="text"
                  value={formData.homeVisitMedical}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeVisitMedical: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 訪問歯科 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問歯科
                </label>
                <input
                  type="text"
                  value={formData.homeVisitDental}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      homeVisitDental: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 薬局 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  薬局
                </label>
                <select
                  value={formData.pharmacy}
                  onChange={(e) =>
                    setFormData({ ...formData, pharmacy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {mockPharmacyData
                    .filter((pharmacy) => pharmacy.status === '稼働中')
                    .map((pharmacy) => (
                      <option key={pharmacy.id} value={pharmacy.name}>
                        {pharmacy.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* 福祉用具 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  福祉用具
                </label>
                <input
                  type="text"
                  value={formData.welfareEquipment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welfareEquipment: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 福祉用具連絡先 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  福祉用具連絡先
                </label>
                <input
                  type="text"
                  value={formData.welfareEquipmentContact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welfareEquipmentContact: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* おむつ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  おむつ
                </label>
                <input
                  type="text"
                  value={formData.diaper}
                  onChange={(e) =>
                    setFormData({ ...formData, diaper: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 医療機器メーカー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医療機器メーカー
                </label>
                <input
                  type="text"
                  value={formData.medicalEquipmentMaker}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalEquipmentMaker: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* セクション6: 疾患・医療行為 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              疾患・医療行為
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 疾患 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  疾患
                </label>
                <select
                  value={formData.disease}
                  onChange={(e) =>
                    setFormData({ ...formData, disease: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.disease.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 診断名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診断名
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 既往歴 */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  既往歴
                </label>
                <div className="flex flex-wrap gap-2">
                  {patientOptions.medicalHistory.map((history) => (
                    <label
                      key={history}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(formData.medicalHistory || []).includes(
                          history
                        )}
                        onChange={() => handleMedicalHistoryChange(history)}
                        className="mr-1"
                      />
                      <span className="text-sm">{history}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 医療行為（自動計算） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医療行為（自動計算）
                </label>
                <input
                  type="text"
                  value={`${medicalActCount}件`}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                />
              </div>

              <div></div>

              {/* 気切 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  気切
                </label>
                <select
                  value={formData.tracheostomy}
                  onChange={(e) =>
                    setFormData({ ...formData, tracheostomy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 痰吸引 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  痰吸引
                </label>
                <select
                  value={formData.suctioning}
                  onChange={(e) =>
                    setFormData({ ...formData, suctioning: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 人工呼吸器 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  人工呼吸器
                </label>
                <select
                  value={formData.ventilator}
                  onChange={(e) =>
                    setFormData({ ...formData, ventilator: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 在宅酸素 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  在宅酸素
                </label>
                <select
                  value={formData.oxygenTherapy}
                  onChange={(e) =>
                    setFormData({ ...formData, oxygenTherapy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 経鼻 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  経鼻
                </label>
                <select
                  value={formData.nasalFeeding}
                  onChange={(e) =>
                    setFormData({ ...formData, nasalFeeding: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 胃ろう */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  胃ろう
                </label>
                <select
                  value={formData.gastrostomy}
                  onChange={(e) =>
                    setFormData({ ...formData, gastrostomy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 腎ろう */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  腎ろう
                </label>
                <select
                  value={formData.nephrostomy}
                  onChange={(e) =>
                    setFormData({ ...formData, nephrostomy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* IVH */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IVH
                </label>
                <select
                  value={formData.ivh}
                  onChange={(e) =>
                    setFormData({ ...formData, ivh: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* ストマ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ストマ
                </label>
                <select
                  value={formData.stoma}
                  onChange={(e) =>
                    setFormData({ ...formData, stoma: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* バルーン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  バルーン
                </label>
                <select
                  value={formData.catheter}
                  onChange={(e) =>
                    setFormData({ ...formData, catheter: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 膀胱ろう */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  膀胱ろう
                </label>
                <select
                  value={formData.cystostomy}
                  onChange={(e) =>
                    setFormData({ ...formData, cystostomy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 透析 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  透析
                </label>
                <select
                  value={formData.dialysis}
                  onChange={(e) =>
                    setFormData({ ...formData, dialysis: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* インスリン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  インスリン
                </label>
                <select
                  value={formData.insulin}
                  onChange={(e) =>
                    setFormData({ ...formData, insulin: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 褥瘡 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  褥瘡
                </label>
                <select
                  value={formData.pressureUlcer}
                  onChange={(e) =>
                    setFormData({ ...formData, pressureUlcer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* セクション7: ADL・ケア */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              ADL・ケア
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 日常生活自立度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  日常生活自立度
                </label>
                <select
                  value={formData.dailyLivingIndependence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyLivingIndependence: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.dailyLivingIndependence.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 認知症高齢者の日常生活自立度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  認知症高齢者の日常生活自立度
                </label>
                <select
                  value={formData.dementiaIndependence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dementiaIndependence: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.dementiaIndependence.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 移動状況 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  移動状況
                </label>
                <select
                  value={formData.mobilityStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mobilityStatus: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.mobilityStatus.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 移乗 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  移乗
                </label>
                <select
                  value={formData.transfer}
                  onChange={(e) =>
                    setFormData({ ...formData, transfer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.transfer.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 食介 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食介
                </label>
                <select
                  value={formData.mealAssistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealAssistance: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.mealAssistance.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 居室でお食事をされている方 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  居室でお食事をされている方
                </label>
                <select
                  value={formData.roomMeal}
                  onChange={(e) =>
                    setFormData({ ...formData, roomMeal: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.roomMeal.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 入浴介助時間 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入浴介助時間
                </label>
                <select
                  value={formData.bathAssistTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathAssistTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.bathAssistTime.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 入浴介助量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入浴介助量
                </label>
                <select
                  value={formData.bathAssistLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bathAssistLevel: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.bathAssistLevel.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 転倒歴の有無 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  転倒歴の有無
                </label>
                <select
                  value={formData.fallHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, fallHistory: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.fallHistory.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 利用者評価 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利用者評価
                </label>
                <select
                  value={formData.userEvaluation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userEvaluation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.evaluation.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 家族評価 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  家族評価
                </label>
                <select
                  value={formData.familyEvaluation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      familyEvaluation: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.evaluation.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 食形態（主食） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食形態（主食）
                </label>
                <select
                  value={formData.mealTextureMain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealTextureMain: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.mealTexture.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 食形態（副食） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  食形態（副食）
                </label>
                <select
                  value={formData.mealTextureSide}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealTextureSide: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.mealTexture.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* とろみ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  とろみ
                </label>
                <select
                  value={formData.thickener}
                  onChange={(e) =>
                    setFormData({ ...formData, thickener: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.thickener.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 義歯の有無 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  義歯の有無
                </label>
                <select
                  value={formData.dentures}
                  onChange={(e) =>
                    setFormData({ ...formData, dentures: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.yesNo.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 禁忌 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  禁忌
                </label>
                <input
                  type="text"
                  value={formData.contraindication}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contraindication: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* アレルギー */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アレルギー
                </label>
                <input
                  type="text"
                  value={formData.allergy}
                  onChange={(e) =>
                    setFormData({ ...formData, allergy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* セクション8: 急変・終末期 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              急変・終末期
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 急変時 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  急変時
                </label>
                <select
                  value={formData.emergencyResponse}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyResponse: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.emergencyResponse.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 急変時-備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  急変時-備考
                </label>
                <textarea
                  value={formData.emergencyResponseNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyResponseNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 終末期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  終末期
                </label>
                <select
                  value={formData.endOfLife}
                  onChange={(e) =>
                    setFormData({ ...formData, endOfLife: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.endOfLife.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 終末期-備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  終末期-備考
                </label>
                <textarea
                  value={formData.endOfLifeNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endOfLifeNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 慢性的な病態の悪化時 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  慢性的な病態の悪化時
                </label>
                <input
                  type="text"
                  value={formData.chronicDeteriorationResponse}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chronicDeteriorationResponse: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 慢性的な病態の悪化時-備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  慢性的な病態の悪化時-備考
                </label>
                <textarea
                  value={formData.chronicDeteriorationNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chronicDeteriorationNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 救急搬送希望 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  救急搬送希望
                </label>
                <select
                  value={formData.emergencyTransportRequest}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyTransportRequest: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.emergencyTransportRequest.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* セクション9: 契約・その他 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              契約・その他
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* 契約書 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  契約書
                </label>
                <select
                  value={formData.contract}
                  onChange={(e) =>
                    setFormData({ ...formData, contract: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.contract.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 個人賠償保険期限 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  個人賠償保険期限
                </label>
                <input
                  type="date"
                  value={formData.personalLiabilityInsuranceExpiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personalLiabilityInsuranceExpiry: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 保険者 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  保険者
                </label>
                <select
                  value={formData.insurer}
                  onChange={(e) =>
                    setFormData({ ...formData, insurer: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.insurer.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 住所地特例確認 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所地特例確認
                </label>
                <select
                  value={formData.residenceSpecialException}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      residenceSpecialException: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.residenceSpecialException.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 郵便物 開封許可 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  郵便物 開封許可
                </label>
                <select
                  value={formData.mailOpeningPermission}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mailOpeningPermission: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.consent.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 郵便物 開封許可-備考 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  郵便物 開封許可-備考
                </label>
                <input
                  type="text"
                  value={formData.mailOpeningPermissionNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mailOpeningPermissionNotes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* HitomeQケアサポート同意 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HitomeQケアサポート同意
                </label>
                <select
                  value={formData.hitomeQConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hitomeQConsent: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.consent.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* ご家族の公式LINE使用 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ご家族の公式LINE使用
                </label>
                <select
                  value={formData.familyLineUsage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      familyLineUsage: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.consent.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* 肖像権の同意 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  肖像権の同意
                </label>
                <select
                  value={formData.portraitRightsConsent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      portraitRightsConsent: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください</option>
                  {patientOptions.consent.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push(`/patients/${patientId}`)}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              更新
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
