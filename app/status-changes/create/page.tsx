'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import {
  facilityNames,
  statusOptions,
  primaryCareOptions,
  statusChangeTypes,
  initialResponseTypes,
  transportHospitals,
  aozoraClinicMedicationOptions,
  aozoraClinicOxygenOptions,
  musashigaokaMedicationOptions,
  musashigaokaOxygenOptions,
  PrimaryCareType,
  StatusChangeType,
  InitialResponseType,
  TransportHospitalType,
} from '@/data/mockStatusChanges';

export default function StatusChangeCreatePage() {
  const router = useRouter();

  // フォームデータの初期値
  const [formData, setFormData] = useState({
    // 基本情報
    patientName: '',
    changeDate: '',

    // かかりつけ（設計書仕様）
    primaryCare: '' as PrimaryCareType | '',

    // 状態変化の種類（かかりつけ別）
    statusChangeType: '' as StatusChangeType | '',
    changeDescription: '',
    supplementaryNote: '',

    // 初回対応
    initialResponse: '' as InitialResponseType | '',

    // 初回対応別の詳細
    observationDetails: '', // 経過観察詳細
    medicationDetails: '', // 内服詳細
    ivDetails: '', // 点滴詳細
    medicationIvDetails: '', // 内服・点滴詳細
    oxygenDetails: '', // 酸素投与詳細
    outpatientDetails: '', // 外来受診詳細
    transportHospital: '' as TransportHospitalType | '', // 搬送先病院
    transportOther: '', // 搬送先（その他の場合）

    // ステータス
    status: '対応中',
  });

  // 保存状態
  const [isSaving, setIsSaving] = useState(false);

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 保存処理
  const handleSave = () => {
    setIsSaving(true);

    // バリデーション
    if (
      !formData.patientName ||
      !formData.changeDate ||
      !formData.primaryCare ||
      !formData.statusChangeType ||
      !formData.initialResponse
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

  // 内服選択肢を取得（かかりつけ別）
  const getMedicationOptions = () => {
    switch (formData.primaryCare) {
      case 'あおぞらクリニック':
        return aozoraClinicMedicationOptions;
      case '武蔵ヶ丘病院':
        return musashigaokaMedicationOptions;
      default:
        return null; // 選択肢なし（自由入力）
    }
  };

  // 酸素投与選択肢を取得（かかりつけ別）
  const getOxygenOptions = () => {
    switch (formData.primaryCare) {
      case 'あおぞらクリニック':
        return aozoraClinicOxygenOptions;
      case '武蔵ヶ丘病院':
        return musashigaokaOxygenOptions;
      default:
        return null; // 選択肢なし（自由入力）
    }
  };

  // 初回対応に応じた詳細フォームをレンダリング
  const renderInitialResponseDetails = () => {
    if (!formData.initialResponse) return null;

    const medicationOptions = getMedicationOptions();
    const oxygenOptions = getOxygenOptions();

    switch (formData.initialResponse) {
      case '経過観察':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              経過観察詳細
            </label>
            <textarea
              name="observationDetails"
              value={formData.observationDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="経過観察の詳細を入力してください"
            />
          </div>
        );

      case '内服':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内服詳細
            </label>
            {medicationOptions ? (
              <select
                name="medicationDetails"
                value={formData.medicationDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {medicationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                name="medicationDetails"
                value={formData.medicationDetails}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="内服の詳細を入力してください"
              />
            )}
          </div>
        );

      case '点滴':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              点滴詳細
            </label>
            <textarea
              name="ivDetails"
              value={formData.ivDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="点滴の詳細を入力してください"
            />
          </div>
        );

      case '内服・点滴':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内服・点滴詳細
            </label>
            <textarea
              name="medicationIvDetails"
              value={formData.medicationIvDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="内服・点滴の詳細を入力してください"
            />
          </div>
        );

      case '酸素投与':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              酸素投与詳細
            </label>
            {oxygenOptions ? (
              <select
                name="oxygenDetails"
                value={formData.oxygenDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {oxygenOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                name="oxygenDetails"
                value={formData.oxygenDetails}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="酸素投与の詳細を入力してください"
              />
            )}
          </div>
        );

      case '外来受診':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              外来受診詳細
            </label>
            <textarea
              name="outpatientDetails"
              value={formData.outpatientDetails}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="外来受診の詳細を入力してください"
            />
          </div>
        );

      case '搬送':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搬送先病院
              </label>
              <select
                name="transportHospital"
                value={formData.transportHospital}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {transportHospitals.map((hospital) => (
                  <option key={hospital} value={hospital}>
                    {hospital}
                  </option>
                ))}
              </select>
            </div>
            {formData.transportHospital === 'その他' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  搬送先病院名（その他）
                </label>
                <input
                  type="text"
                  name="transportOther"
                  value={formData.transportOther}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="搬送先病院名を入力してください"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // かかりつけ別のセクションタイトルを取得
  const getPrimaryCareLabel = () => {
    if (!formData.primaryCare) return '';
    return formData.primaryCare;
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
          {/* 共通セクション */}
          <h3 className="text-lg font-semibold text-gray-800 mb-4">共通</h3>
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

            {/* 状態変化日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状態変化日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="changeDate"
                value={formData.changeDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* かかりつけ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                かかりつけ <span className="text-red-500">*</span>
              </label>
              <select
                name="primaryCare"
                value={formData.primaryCare}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {primaryCareOptions.map((care) => (
                  <option key={care} value={care}>
                    {care}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* かかりつけ別セクション */}
          {formData.primaryCare && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {getPrimaryCareLabel()}ルート
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 状態変化 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getPrimaryCareLabel()}　状態変化{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="statusChangeType"
                    value={formData.statusChangeType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {statusChangeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 初回対応 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getPrimaryCareLabel()}　初回対応{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="initialResponse"
                    value={formData.initialResponse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {initialResponseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 初回対応別の詳細 */}
                <div className="md:col-span-2">
                  {renderInitialResponseDetails()}
                </div>
              </div>
            </div>
          )}

          {/* 補足情報 */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              補足情報
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
