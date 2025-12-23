'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import {
  facilityNames,
  changeTypes,
  primaryCareTypes,
  statusOptions,
} from '@/data/mockStatusChanges';

export default function StatusChangeCreatePage() {
  const router = useRouter();

  // フォームデータの初期値
  const [formData, setFormData] = useState({
    // 基本情報
    patientName: '',
    facilityName: '',
    reporterName: '',
    changeDate: '',
    changeTime: '',
    primaryCareType: '' as
      | ''
      | '病院'
      | 'クリニック'
      | '訪問診療'
      | '救急搬送'
      | 'なし',
    changeType: '',
    changeDescription: '',
    supplementaryNote: '',
    status: '対応中',

    // バイタル
    temperature: '',
    bloodPressureHigh: '',
    bloodPressureLow: '',
    pulse: '',
    spo2: '',

    // 病院・クリニックルート用
    hospitalName: '',
    hospitalPhone: '',
    consultationDate: '',
    consultationTime: '',
    diagnosis: '',
    treatmentSummary: '',
    prescription: '',
    nextAppointment: '',

    // 訪問診療ルート用
    visitDoctorName: '',
    visitDate: '',
    visitTime: '',
    visitDiagnosis: '',
    visitTreatment: '',
    visitPrescription: '',
    visitNextDate: '',

    // 救急搬送ルート用
    emergencyHospital: '',
    emergencyDate: '',
    emergencyTime: '',
    emergencyReason: '',
    emergencyDiagnosis: '',
    emergencyTreatment: '',
    hospitalizationRequired: false,
    hospitalizedDate: '',
    dischargeDate: '',

    // 連絡状況
    familyContactDate: '',
    familyContactTime: '',
    familyContactPerson: '',
    familyContactContent: '',
    careManagerContactDate: '',
    careManagerContactContent: '',
  });

  // ファイルアップロード状態
  const [changeFile, setChangeFile] = useState<File | null>(null);

  // 保存状態
  const [isSaving, setIsSaving] = useState(false);

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ファイル変更ハンドラ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChangeFile(file);
    }
  };

  // 保存処理
  const handleSave = () => {
    setIsSaving(true);

    // バリデーション
    if (
      !formData.patientName ||
      !formData.facilityName ||
      !formData.reporterName ||
      !formData.changeDate ||
      !formData.changeTime ||
      !formData.primaryCareType ||
      !formData.changeType
    ) {
      alert('必須項目を入力してください');
      setIsSaving(false);
      return;
    }

    // 実際のバックエンド実装時はここでAPIコール
    setTimeout(() => {
      alert('状態変化を作成しました');
      setIsSaving(false);
      router.push('/status-changes');
    }, 500);
  };

  // キャンセル処理
  const handleCancel = () => {
    if (confirm('作成を中止しますか?')) {
      router.push('/status-changes');
    }
  };

  // かかりつけ種別に応じた追加フォームをレンダリング
  const renderPrimaryCareFields = () => {
    switch (formData.primaryCareType) {
      case '病院':
      case 'クリニック':
        return (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {formData.primaryCareType === '病院' ? '病院' : 'クリニック'}
              受診情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医療機関名
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="医療機関名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  name="hospitalPhone"
                  value={formData.hospitalPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="03-1234-5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  受診日
                </label>
                <input
                  type="date"
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  受診時刻
                </label>
                <input
                  type="time"
                  name="consultationTime"
                  value={formData.consultationTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診断名
                </label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="診断名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  次回予約日
                </label>
                <input
                  type="date"
                  name="nextAppointment"
                  value={formData.nextAppointment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  処置内容
                </label>
                <textarea
                  name="treatmentSummary"
                  value={formData.treatmentSummary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="処置内容を入力してください"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  処方
                </label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="処方内容を入力してください"
                />
              </div>
            </div>
          </div>
        );

      case '訪問診療':
        return (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              訪問診療情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  担当医師名
                </label>
                <input
                  type="text"
                  name="visitDoctorName"
                  value={formData.visitDoctorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="担当医師名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問日
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  訪問時刻
                </label>
                <input
                  type="time"
                  name="visitTime"
                  value={formData.visitTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診断名
                </label>
                <input
                  type="text"
                  name="visitDiagnosis"
                  value={formData.visitDiagnosis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="診断名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  次回訪問予定日
                </label>
                <input
                  type="date"
                  name="visitNextDate"
                  value={formData.visitNextDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  処置内容
                </label>
                <textarea
                  name="visitTreatment"
                  value={formData.visitTreatment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="処置内容を入力してください"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  処方
                </label>
                <textarea
                  name="visitPrescription"
                  value={formData.visitPrescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="処方内容を入力してください"
                />
              </div>
            </div>
          </div>
        );

      case '救急搬送':
        return (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              救急搬送情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搬送先病院
                </label>
                <input
                  type="text"
                  name="emergencyHospital"
                  value={formData.emergencyHospital}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="搬送先病院名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搬送日
                </label>
                <input
                  type="date"
                  name="emergencyDate"
                  value={formData.emergencyDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搬送時刻
                </label>
                <input
                  type="time"
                  name="emergencyTime"
                  value={formData.emergencyTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搬送理由
                </label>
                <input
                  type="text"
                  name="emergencyReason"
                  value={formData.emergencyReason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="搬送理由"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診断名
                </label>
                <input
                  type="text"
                  name="emergencyDiagnosis"
                  value={formData.emergencyDiagnosis}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="診断名"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hospitalizationRequired"
                    checked={formData.hospitalizationRequired}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    入院が必要
                  </span>
                </label>
              </div>
              {formData.hospitalizationRequired && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      入院日
                    </label>
                    <input
                      type="date"
                      name="hospitalizedDate"
                      value={formData.hospitalizedDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      退院予定日
                    </label>
                    <input
                      type="date"
                      name="dischargeDate"
                      value={formData.dischargeDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  処置内容
                </label>
                <textarea
                  name="emergencyTreatment"
                  value={formData.emergencyTreatment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="処置内容を入力してください"
                />
              </div>
            </div>
          </div>
        );

      case 'なし':
        return (
          <div className="border-t pt-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                かかりつけ医療機関への対応なし。経過観察または家族・ケアマネへの連絡のみ行います。
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/status-changes')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">状態変化作成</h1>
          <p className="text-sm text-gray-600 mt-1">
            新しい状態変化を記録します
          </p>
        </div>

        {/* 作成フォーム */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* 基本情報セクション */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">基本情報</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 利用者氏名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="利用者氏名"
              />
            </div>

            {/* 事業所名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事業所名 <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {facilityNames.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
            </div>

            {/* 記録者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記録者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="記録者名"
              />
            </div>

            {/* 状態変化発生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状態変化発生日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="changeDate"
                value={formData.changeDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 状態変化発生時刻 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状態変化発生時刻 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="changeTime"
                value={formData.changeTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* かかりつけ種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                かかりつけ種別 <span className="text-red-500">*</span>
              </label>
              <select
                name="primaryCareType"
                value={formData.primaryCareType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {primaryCareTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* 状態変化の種類 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状態変化の種類 <span className="text-red-500">*</span>
              </label>
              <select
                name="changeType"
                value={formData.changeType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {changeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* バイタルセクション */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              バイタル情報
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  体温 (℃)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="36.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  血圧(高)
                </label>
                <input
                  type="number"
                  name="bloodPressureHigh"
                  value={formData.bloodPressureHigh}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  血圧(低)
                </label>
                <input
                  type="number"
                  name="bloodPressureLow"
                  value={formData.bloodPressureLow}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  脈拍
                </label>
                <input
                  type="number"
                  name="pulse"
                  value={formData.pulse}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  name="spo2"
                  value={formData.spo2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="98"
                />
              </div>
            </div>
          </div>

          {/* 状態変化内容 */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              状態変化内容
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状態変化内容＆発生時の状況
                </label>
                <textarea
                  name="changeDescription"
                  value={formData.changeDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="状態変化の詳細を入力してください"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  添付ファイル
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {changeFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    選択中: {changeFile.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  補足説明
                </label>
                <textarea
                  name="supplementaryNote"
                  value={formData.supplementaryNote}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="補足説明を入力してください"
                />
              </div>
            </div>
          </div>

          {/* かかりつけ種別に応じた追加フィールド */}
          {renderPrimaryCareFields()}

          {/* 連絡状況セクション */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              連絡状況
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  家族連絡日
                </label>
                <input
                  type="date"
                  name="familyContactDate"
                  value={formData.familyContactDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  家族連絡時刻
                </label>
                <input
                  type="time"
                  name="familyContactTime"
                  value={formData.familyContactTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  連絡先（続柄・氏名）
                </label>
                <input
                  type="text"
                  name="familyContactPerson"
                  value={formData.familyContactPerson}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: 田中 一郎（長男）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ケアマネ連絡日
                </label>
                <input
                  type="date"
                  name="careManagerContactDate"
                  value={formData.careManagerContactDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  家族連絡内容
                </label>
                <textarea
                  name="familyContactContent"
                  value={formData.familyContactContent}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="家族への連絡内容を入力してください"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ケアマネ連絡内容
                </label>
                <textarea
                  name="careManagerContactContent"
                  value={formData.careManagerContactContent}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ケアマネへの連絡内容を入力してください"
                />
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 rounded-md text-white transition-colors ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSaving ? '作成中...' : '作成'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
