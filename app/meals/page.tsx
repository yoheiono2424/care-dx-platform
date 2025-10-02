'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockMealData } from '@/data/mockMeals';
import type { MealRecord } from '@/data/mockMeals';

export default function MealsPage() {
  const router = useRouter();

  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 本日の食事内容モーダル
  const [showMealPatternModal, setShowMealPatternModal] = useState(false);
  const [selectedMealPattern, setSelectedMealPattern] = useState('通常食');

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return mockMealData.filter((record) => {
      // 期間フィルター
      if (startDate) {
        const recordDate = new Date(record.registeredAt);
        const filterStartDate = new Date(startDate);
        if (recordDate < filterStartDate) return false;
      }
      if (endDate) {
        const recordDate = new Date(record.registeredAt);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        if (recordDate > filterEndDate) return false;
      }

      // 利用者名フィルター
      if (selectedPatient && record.patientName !== selectedPatient) {
        return false;
      }

      // フロアフィルター
      if (selectedFloor && record.floor !== selectedFloor) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedPatient, selectedFloor]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      '登録日時',
      '利用者名',
      'フロア',
      '食事内容パターン',
      '食前の食事量',
      '食事残渣量',
      '食事摂取量-主食',
      '食事摂取量-副食',
      '食事摂取割合',
      '水分量',
      '水分摂取量',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          record.registeredAt,
          record.patientName,
          record.floor,
          record.mealContentPattern,
          record.preMealAmount,
          record.foodResidue,
          record.mainDishIntake,
          record.sideDishIntake,
          record.intakePercentage,
          record.waterAmount,
          record.waterIntake,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `食事記録_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">食事記録管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              利用者の食事記録を管理します
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/meals/create')}
            >
              記録作成
            </Button>
            {!isMobile && (
              <Button variant="primary" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            )}
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 期間（開始日） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期間（開始日）
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 期間（終了日） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期間（終了日）
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                利用者名
              </label>
              <input
                type="text"
                placeholder="利用者名"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* フロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                フロア
              </label>
              <input
                type="text"
                placeholder="フロア"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 本日の食事内容 */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => setShowMealPatternModal(true)}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            本日の食事内容
          </button>
          <span className="text-sm text-gray-700">
            選択中の食事内容：
            <span className="text-gray-900 font-bold">
              {selectedMealPattern || '選択中の食事内容'}
            </span>
          </span>
        </div>

        {/* データ件数表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredRecords.length}件のデータが見つかりました
          </p>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow p-4">
              {/* ヘッダー */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {record.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">{record.floor}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {record.registeredAt}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/meals/${record.id}/edit`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>

              {/* 食事情報 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">
                    食事内容パターン
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.mealContentPattern}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食前の食事量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.preMealAmount}g
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事残渣量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.foodResidue}g
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-主食</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.mainDishIntake}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-副食</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.sideDishIntake}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取割合</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.intakePercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">水分量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.waterAmount}ml
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">水分摂取量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.waterIntake}ml
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* データなしメッセージ */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">データがありません</p>
            </div>
          )}
        </div>

        {/* PC表示: テーブル */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  登録日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用者名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  フロア
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食事内容パターン
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食前の食事量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食事残渣量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食事摂取量-主食
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食事摂取量-副食
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  食事摂取割合
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  水分量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  水分摂取量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  編集
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.registeredAt}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.floor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.mealContentPattern}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.preMealAmount}g
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.foodResidue}g
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.mainDishIntake}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.sideDishIntake}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.intakePercentage}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.waterAmount}ml
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.waterIntake}ml
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => router.push(`/meals/${record.id}/edit`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* データなしメッセージ */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">データがありません</p>
            </div>
          )}
        </div>

        {/* 本日の食事内容モーダル */}
        {showMealPatternModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              {/* ヘッダー */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  本日の食事内容
                </h2>
                <button
                  onClick={() => setShowMealPatternModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* コンテンツ */}
              <div className="p-6 space-y-4">
                {/* 食事内容パターン選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    食事内容パターン
                  </label>
                  <select
                    value={selectedMealPattern}
                    onChange={(e) => setSelectedMealPattern(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="通常食">通常食</option>
                    <option value="軟菜食">軟菜食</option>
                    <option value="きざみ食">きざみ食</option>
                    <option value="ミキサー食">ミキサー食</option>
                    <option value="治療食">治療食</option>
                  </select>
                </div>

                {/* 選択中の食事内容表示 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    選択中の食事内容
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                    {selectedMealPattern ? (
                      <span className="text-gray-900">
                        {selectedMealPattern}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        （選択中の食事内容）
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* フッター */}
              <div className="flex justify-end gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMealPatternModal(false);
                    setSelectedMealPattern('');
                  }}
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // 確定処理（今後実装）
                    setShowMealPatternModal(false);
                  }}
                >
                  確定
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
