'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function MealEditPage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    registeredAt: '2025-10-01 08:00',
    patientName: '田中 太郎',
    floor: '1階',
    mealContentPattern: '通常食',
    preMealAmount: '500',
    foodResidue: '80',
    mainDishIntake: '85',
    sideDishIntake: '90',
    intakePercentage: '87',
    waterAmount: '300',
    waterIntake: '280',
    remarks: '完食',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/meals');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/meals')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">食事記録編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* 登録日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                登録日時
              </label>
              <input
                type="datetime-local"
                value={formData.registeredAt.replace(' ', 'T')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registeredAt: e.target.value.replace('T', ' '),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者名
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <option value="1階">1階</option>
                <option value="2階">2階</option>
                <option value="3階">3階</option>
              </select>
            </div>

            {/* 食事内容パターン */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事内容パターン
              </label>
              <select
                value={formData.mealContentPattern}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mealContentPattern: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="通常食">通常食</option>
                <option value="軟菜食">軟菜食</option>
                <option value="きざみ食">きざみ食</option>
                <option value="ミキサー食">ミキサー食</option>
                <option value="治療食">治療食</option>
              </select>
            </div>

            {/* 食前の食事量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食前の食事量（g）
              </label>
              <input
                type="number"
                value={formData.preMealAmount}
                onChange={(e) =>
                  setFormData({ ...formData, preMealAmount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 食事残渣量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事残渣量（g）
              </label>
              <input
                type="number"
                value={formData.foodResidue}
                onChange={(e) =>
                  setFormData({ ...formData, foodResidue: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 食事摂取量-主食 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事摂取量-主食（%）
              </label>
              <input
                type="number"
                value={formData.mainDishIntake}
                onChange={(e) =>
                  setFormData({ ...formData, mainDishIntake: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 食事摂取量-副食 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事摂取量-副食（%）
              </label>
              <input
                type="number"
                value={formData.sideDishIntake}
                onChange={(e) =>
                  setFormData({ ...formData, sideDishIntake: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 食事摂取割合 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                食事摂取割合（%）
              </label>
              <input
                type="number"
                value={formData.intakePercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    intakePercentage: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 水分量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                水分量（ml）
              </label>
              <input
                type="number"
                value={formData.waterAmount}
                onChange={(e) =>
                  setFormData({ ...formData, waterAmount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 水分摂取量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                水分摂取量（ml）
              </label>
              <input
                type="number"
                value={formData.waterIntake}
                onChange={(e) =>
                  setFormData({ ...formData, waterIntake: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="備考を入力してください"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push('/meals')}
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
