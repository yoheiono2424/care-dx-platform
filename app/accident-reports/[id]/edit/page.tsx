'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import {
  mockAccidentReports,
  facilityNames,
  accidentLocations,
  accidentTypes,
  consultationMethods,
  diagnosisDetails,
} from '@/data/mockAccidentReports';

export default function AccidentReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  // 既存データの取得
  const existingReport = mockAccidentReports.find(
    (report) => report.id === reportId
  );

  // フォームデータの初期値（既存データ）
  const [formData, setFormData] = useState({
    patientName: existingReport?.patientName || '',
    facilityName: existingReport?.facilityName || '',
    reporterName: existingReport?.reporterName || '',
    incidentDate: existingReport?.incidentDate || '',
    incidentTime: existingReport?.incidentTime || '',
    location: existingReport?.location || '',
    incidentType: existingReport?.incidentType || '',
    incidentDescription: existingReport?.incidentDescription || '',
    supplementaryNote: existingReport?.supplementaryNote || '',
    consultationMethod: existingReport?.consultationMethod || '',
    hospitalName: existingReport?.hospitalName || '',
    diagnosis: existingReport?.diagnosis || '',
    diagnosisDetail: existingReport?.diagnosisDetail || '',
    treatmentSummary: existingReport?.treatmentSummary || '',
    careLevel: existingReport?.careLevel || '',
  });

  // ファイルアップロード状態
  const [incidentFile, setIncidentFile] = useState<File | null>(null);
  const [supplementaryFile, setSupplementaryFile] = useState<File | null>(null);

  // 保存状態
  const [isSaving, setIsSaving] = useState(false);

  if (!existingReport) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">事故報告が見つかりません</p>
            <button
              onClick={() => router.push('/accident-reports')}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              ← 一覧に戻る
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ファイル変更ハンドラ
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'incident' | 'supplementary'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'incident') {
        setIncidentFile(file);
      } else {
        setSupplementaryFile(file);
      }
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
      !formData.incidentDate ||
      !formData.incidentTime ||
      !formData.location ||
      !formData.incidentType
    ) {
      alert('必須項目を入力してください');
      setIsSaving(false);
      return;
    }

    // 実際のバックエンド実装時はここでAPIコール
    setTimeout(() => {
      alert('事故報告を更新しました');
      setIsSaving(false);
      router.push('/accident-reports');
    }, 500);
  };

  // キャンセル処理
  const handleCancel = () => {
    if (confirm('編集を中止しますか?')) {
      router.push('/accident-reports');
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/accident-reports')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            事故報告編集 (ID: {reportId})
          </h1>
          <p className="text-sm text-gray-600 mt-1">事故報告を編集します</p>
        </div>

        {/* 編集フォーム */}
        <div className="bg-white rounded-lg shadow p-6">
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

            {/* 事故発生日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事故発生日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 事故発生時刻 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事故発生時刻 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 発生場所 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                発生場所 <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {accidentLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* 事故の種類 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事故の種類 <span className="text-red-500">*</span>
              </label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {accidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                name="careLevel"
                value={formData.careLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                <option value="自立">自立</option>
                <option value="要支援1">要支援1</option>
                <option value="要支援2">要支援2</option>
                <option value="要介護1">要介護1</option>
                <option value="要介護2">要介護2</option>
                <option value="要介護3">要介護3</option>
                <option value="要介護4">要介護4</option>
                <option value="要介護5">要介護5</option>
              </select>
            </div>

            {/* 事故内容＆発生時の状況 (ファイルアップロード) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事故内容＆発生時の状況
              </label>
              <div className="mb-2 text-sm text-gray-600">
                現在の内容: {formData.incidentDescription}
              </div>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'incident')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              {incidentFile && (
                <p className="text-sm text-gray-600 mt-1">
                  選択中: {incidentFile.name}
                </p>
              )}
            </div>

            {/* 補足説明 */}
            <div className="md:col-span-2">
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

            {/* 受診方法 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                受診方法
              </label>
              <select
                name="consultationMethod"
                value={formData.consultationMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {consultationMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* 受診先(医療機関名) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                受診先(医療機関名)
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

            {/* 診断名 */}
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

            {/* 診断内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                診断内容
              </label>
              <select
                name="diagnosisDetail"
                value={formData.diagnosisDetail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {diagnosisDetails.map((detail) => (
                  <option key={detail} value={detail}>
                    {detail}
                  </option>
                ))}
              </select>
            </div>

            {/* 検査処置の概要 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検査処置の概要
              </label>
              <textarea
                name="treatmentSummary"
                value={formData.treatmentSummary}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検査処置の概要を入力してください"
              />
            </div>

            {/* 追加補足資料セクション */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                追加補足資料
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'supplementary')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              {supplementaryFile && (
                <p className="text-sm text-gray-600 mt-1">
                  選択中: {supplementaryFile.name}
                </p>
              )}
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
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
