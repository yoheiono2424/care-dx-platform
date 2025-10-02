'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { mockUrineTestData } from '@/data/mockUrineTests';
import type { UrineTestData } from '@/data/mockUrineTests';

export default function UrineTestEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // 編集データの状態
  const [urineTestData, setUrineTestData] = useState<UrineTestData | null>(
    null
  );
  const [formData, setFormData] = useState({
    registeredAt: '',
    patientName: '',
    whiteBloodCells: '',
    urobilinogen: '',
    occultBlood: '',
    bilirubin: '',
    glucose: '',
    albuminMainDish: '',
    protein: '',
    nitrite: '',
    uricAcid: '',
    fatBurningScore: '',
    carbScore: '',
    vegetableScore: '',
    waterScore: '',
    saltScore: '',
    vitaminCScore: '',
    magnesiumScore: '',
    calciumScore: '',
    oxidativeStressScore: '',
    zincScore: '',
  });

  // 保存状態
  const [isSaving, setIsSaving] = useState(false);

  // データ読み込み
  useEffect(() => {
    const record = mockUrineTestData.find((r) => r.id === id);
    if (record) {
      setUrineTestData(record);

      // 日時をフォーマット（yyyy-MM-ddTHH:mm形式）
      const date = new Date(record.registeredAt);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        registeredAt: formattedDate,
        patientName: record.patientName,
        whiteBloodCells: record.whiteBloodCells,
        urobilinogen: record.urobilinogen,
        occultBlood: record.occultBlood,
        bilirubin: record.bilirubin,
        glucose: record.glucose,
        albuminMainDish: record.albuminMainDish,
        protein: record.protein,
        nitrite: record.nitrite,
        uricAcid: record.uricAcid,
        fatBurningScore: String(record.fatBurningScore),
        carbScore: String(record.carbScore),
        vegetableScore: String(record.vegetableScore),
        waterScore: String(record.waterScore),
        saltScore: String(record.saltScore),
        vitaminCScore: String(record.vitaminCScore),
        magnesiumScore: String(record.magnesiumScore),
        calciumScore: String(record.calciumScore),
        oxidativeStressScore: String(record.oxidativeStressScore),
        zincScore: String(record.zincScore),
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
    if (!formData.patientName) {
      alert('利用者名は必須項目です');
      setIsSaving(false);
      return;
    }

    // 実際のバックエンド実装時はここでAPIコール
    setTimeout(() => {
      alert('尿検査データを更新しました');
      setIsSaving(false);
      router.push('/urine-tests');
    }, 500);
  };

  // キャンセル処理
  const handleCancel = () => {
    if (confirm('編集を中止しますか?')) {
      router.push('/urine-tests');
    }
  };

  if (!urineTestData) {
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
          <h1 className="text-2xl font-bold text-gray-800">尿検査編集</h1>
          <p className="text-sm text-gray-600 mt-1">尿検査データを編集します</p>
        </div>

        {/* 編集フォーム */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* 基本情報 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              基本情報
            </h2>
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
            </div>
          </div>

          {/* 基本検査項目 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b bg-blue-50 px-3 py-2 rounded">
              基本検査項目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 白血球 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  白血球
                </label>
                <select
                  name="whiteBloodCells"
                  value={formData.whiteBloodCells}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* ウロビリノーゲン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ウロビリノーゲン
                </label>
                <select
                  name="urobilinogen"
                  value={formData.urobilinogen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="正常">正常</option>
                  <option value="低値">低値</option>
                  <option value="高値">高値</option>
                </select>
              </div>

              {/* 潜血 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  潜血
                </label>
                <select
                  name="occultBlood"
                  value={formData.occultBlood}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* ビリルビン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ビリルビン
                </label>
                <select
                  name="bilirubin"
                  value={formData.bilirubin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* 尿糖 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  尿糖
                </label>
                <select
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* アルブミン-主食 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  アルブミン-主食
                </label>
                <select
                  name="albuminMainDish"
                  value={formData.albuminMainDish}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* 尿蛋白 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  尿蛋白
                </label>
                <select
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* 亜硝酸塩 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  亜硝酸塩
                </label>
                <select
                  name="nitrite"
                  value={formData.nitrite}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="陰性">陰性</option>
                  <option value="微量">微量</option>
                  <option value="陽性">陽性</option>
                </select>
              </div>

              {/* 尿酸 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  尿酸
                </label>
                <select
                  name="uricAcid"
                  value={formData.uricAcid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="正常">正常</option>
                  <option value="低値">低値</option>
                  <option value="高値">高値</option>
                </select>
              </div>
            </div>
          </div>

          {/* スコア項目 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b bg-green-50 px-3 py-2 rounded">
              スコア項目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 脂肪燃焼-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  脂肪燃焼-score
                </label>
                <input
                  type="number"
                  name="fatBurningScore"
                  value={formData.fatBurningScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 糖質-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  糖質-score
                </label>
                <input
                  type="number"
                  name="carbScore"
                  value={formData.carbScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 野菜-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  野菜-score
                </label>
                <input
                  type="number"
                  name="vegetableScore"
                  value={formData.vegetableScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 水分-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  水分-score
                </label>
                <input
                  type="number"
                  name="waterScore"
                  value={formData.waterScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 塩分-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  塩分-score
                </label>
                <input
                  type="number"
                  name="saltScore"
                  value={formData.saltScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* ビタミンC-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ビタミンC-score
                </label>
                <input
                  type="number"
                  name="vitaminCScore"
                  value={formData.vitaminCScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* マグネシウム-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  マグネシウム-score
                </label>
                <input
                  type="number"
                  name="magnesiumScore"
                  value={formData.magnesiumScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* カルシウム-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カルシウム-score
                </label>
                <input
                  type="number"
                  name="calciumScore"
                  value={formData.calciumScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 酸化ストレスレベル-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  酸化ストレスレベル-score
                </label>
                <input
                  type="number"
                  name="oxidativeStressScore"
                  value={formData.oxidativeStressScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              {/* 亜鉛-score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  亜鉛-score
                </label>
                <input
                  type="number"
                  name="zincScore"
                  value={formData.zincScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-100"
                  min="0"
                  max="100"
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
              {isSaving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
