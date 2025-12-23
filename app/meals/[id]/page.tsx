'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockMealData } from '@/data/mockMeals';
import type { MealRecord } from '@/data/mockMeals';

export default function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const mealId = parseInt(resolvedParams.id);

  const [mealData, setMealData] = useState<MealRecord | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const record = mockMealData.find((r) => r.id === mealId);
    if (record) {
      setMealData(record);
    }
  }, [mealId]);

  // 同じ利用者の直近の記録を取得
  const relatedRecords = mealData
    ? mockMealData
        .filter(
          (r) => r.patientName === mealData.patientName && r.id !== mealData.id
        )
        .slice(0, 5)
    : [];

  // 摂取量に応じた色を取得
  const getIntakeColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!mealData) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">データを読み込んでいます...</p>
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
            onClick={() => router.push('/meals')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">食事記録詳細</h1>
              <p className="text-sm text-gray-600 mt-1">
                食事記録の詳細を確認できます
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => router.push(`/meals/${mealId}/edit`)}
            >
              編集
            </Button>
          </div>
        </div>

        {/* 利用者情報カード */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            利用者情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">利用者名</p>
              <p className="text-lg font-semibold text-gray-900">
                {mealData.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">フロア</p>
              <p className="text-lg font-semibold text-gray-900">
                {mealData.floor}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">登録日時</p>
              <p className="text-lg font-semibold text-gray-900">
                {mealData.registeredAt}
              </p>
            </div>
          </div>
        </div>

        {/* 摂取状況サマリー */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            摂取状況サマリー
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-2">食事摂取割合</p>
              <p
                className={`text-2xl font-bold ${getIntakeColor(mealData.intakePercentage).split(' ')[0]}`}
              >
                {mealData.intakePercentage}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-2">主食摂取</p>
              <p
                className={`text-2xl font-bold ${getIntakeColor(mealData.mainDishIntake).split(' ')[0]}`}
              >
                {mealData.mainDishIntake}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-2">副食摂取</p>
              <p
                className={`text-2xl font-bold ${getIntakeColor(mealData.sideDishIntake).split(' ')[0]}`}
              >
                {mealData.sideDishIntake}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500 mb-2">水分摂取</p>
              <p className="text-2xl font-bold text-blue-600">
                {mealData.waterIntake}ml
              </p>
            </div>
          </div>
        </div>

        {/* 詳細情報 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            詳細情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 食事情報 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                食事情報
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    食事内容パターン
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {mealData.mealContentPattern}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">食前の食事量</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {mealData.preMealAmount}g
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">食事残渣量</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {mealData.foodResidue}g
                  </span>
                </div>
              </div>
            </div>

            {/* 摂取情報 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                摂取情報
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">食事摂取量-主食</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getIntakeColor(mealData.mainDishIntake)}`}
                  >
                    {mealData.mainDishIntake}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-副食</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getIntakeColor(mealData.sideDishIntake)}`}
                  >
                    {mealData.sideDishIntake}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取割合</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getIntakeColor(mealData.intakePercentage)}`}
                  >
                    {mealData.intakePercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* 水分情報 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                水分情報
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">水分量</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {mealData.waterAmount}ml
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">水分摂取量</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {mealData.waterIntake}ml
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">水分摂取率</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Math.round(
                      (mealData.waterIntake / mealData.waterAmount) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* 備考 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-200">
                備考
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[80px]">
                <p className="text-sm text-gray-700">
                  {mealData.remarks || '備考なし'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 直近の記録 */}
        {relatedRecords.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {mealData.patientName}さんの直近の記録
            </h2>

            {/* スマホ表示: カード形式 */}
            <div className="md:hidden space-y-3">
              {relatedRecords.map((record) => (
                <div
                  key={record.id}
                  onClick={() => router.push(`/meals/${record.id}`)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {record.registeredAt}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getIntakeColor(record.intakePercentage)}`}
                    >
                      {record.intakePercentage}%
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>主食: {record.mainDishIntake}%</span>
                    <span>副食: {record.sideDishIntake}%</span>
                    <span>水分: {record.waterIntake}ml</span>
                  </div>
                </div>
              ))}
            </div>

            {/* PC表示: テーブル */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      登録日時
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      食事内容
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      主食
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      副食
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      摂取割合
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      水分
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {relatedRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {record.registeredAt}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {record.mealContentPattern}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getIntakeColor(record.mainDishIntake)}`}
                        >
                          {record.mainDishIntake}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getIntakeColor(record.sideDishIntake)}`}
                        >
                          {record.sideDishIntake}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getIntakeColor(record.intakePercentage)}`}
                        >
                          {record.intakePercentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                        {record.waterIntake}ml
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <button
                          onClick={() => router.push(`/meals/${record.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
