'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { mockVitalRecords } from '@/data/mockVitals';
import type { VitalRecord } from '@/data/mockVitals';

export default function VitalEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // 編集データの状態
  const [vitalData, setVitalData] = useState<VitalRecord | null>(null);
  const [formData, setFormData] = useState({
    registeredAt: '',
    patientName: '',
    floor: '',
    bloodPressureHigh: '',
    bloodPressureLow: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    ecg: '正常',
    height: '',
    weight: '',
  });

  // 保存状態
  const [isSaving, setIsSaving] = useState(false);

  // データ読み込み
  useEffect(() => {
    const record = mockVitalRecords.find((r) => r.id === id);
    if (record) {
      setVitalData(record);

      // 血圧を分解
      const [high, low] = record.bloodPressure.split('/');

      // 日時をフォーマット（yyyy-MM-ddTHH:mm形式）
      const date = new Date(record.registeredAt);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        registeredAt: formattedDate,
        patientName: record.patientName,
        floor: record.floor,
        bloodPressureHigh: high,
        bloodPressureLow: low,
        pulse: String(record.pulse),
        respiratoryRate: String(record.respiratoryRate),
        oxygenSaturation: String(record.oxygenSaturation),
        temperature: String(record.temperature),
        ecg: record.ecg,
        height: String(record.height),
        weight: String(record.weight),
      });
    }
  }, [id]);

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 保存処理
  const handleSave = () => {
    setIsSaving(true);

    // バリデーション
    if (!formData.patientName || !formData.floor) {
      alert('利用者名とフロアは必須項目です');
      setIsSaving(false);
      return;
    }

    // バイタル値のバリデーション
    if (
      !formData.bloodPressureHigh ||
      !formData.bloodPressureLow ||
      !formData.pulse ||
      !formData.respiratoryRate ||
      !formData.oxygenSaturation ||
      !formData.temperature
    ) {
      alert('すべてのバイタル値を入力してください');
      setIsSaving(false);
      return;
    }

    // 実際のバックエンド実装時はここでAPIコール
    setTimeout(() => {
      alert('バイタルデータを更新しました');
      setIsSaving(false);
      router.push('/vitals');
    }, 500);
  };

  // キャンセル処理
  const handleCancel = () => {
    if (confirm('編集を中止しますか?')) {
      router.push('/vitals');
    }
  };

  if (!vitalData) {
    return (
      <MainLayout>
        <div className="p-6">
          <p className="text-gray-600">データを読み込んでいます...</p>
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
            onClick={() => router.push('/vitals')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">バイタル編集</h1>
          <p className="text-sm text-gray-600 mt-1">
            バイタルデータを編集します
          </p>
        </div>

        {/* 編集フォーム */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 登録日時 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                登録日時 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="registeredAt"
                value={formData.registeredAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="利用者名"
              />
            </div>

            {/* フロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フロア <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 1F"
              />
            </div>

            {/* 血圧（最高） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                血圧（最高） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bloodPressureHigh"
                value={formData.bloodPressureHigh}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 120"
              />
            </div>

            {/* 血圧（最低） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                血圧（最低） <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="bloodPressureLow"
                value={formData.bloodPressureLow}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 80"
              />
            </div>

            {/* 脈拍 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                脈拍 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pulse"
                value={formData.pulse}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 72"
              />
            </div>

            {/* 呼吸数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                呼吸数 (回/分) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 16"
              />
            </div>

            {/* 酸素飽和度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酸素飽和度 (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="oxygenSaturation"
                value={formData.oxygenSaturation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 98"
                min="0"
                max="100"
              />
            </div>

            {/* 体温 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                体温 (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 36.5"
              />
            </div>

            {/* 心電図 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                心電図 <span className="text-red-500">*</span>
              </label>
              <select
                name="ecg"
                value={formData.ecg}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="正常">正常</option>
                <option value="異常">異常</option>
              </select>
            </div>

            {/* 身長 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                身長 (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 165"
              />
            </div>

            {/* 体重 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                体重 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 55.5"
              />
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
