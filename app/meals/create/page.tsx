'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockMealData } from '@/data/mockMeals';

export default function MealCreatePage() {
  const router = useRouter();
  const [showBulkModal, setShowBulkModal] = useState(false);

  // フィルター状態
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    // 最新の食事記録のみを取得（各利用者の最新1件）
    const latestRecords = new Map();
    mockMealData.forEach((record) => {
      if (!latestRecords.has(record.patientName)) {
        latestRecords.set(record.patientName, record);
      }
    });

    return Array.from(latestRecords.values()).filter((record) => {
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
  }, [selectedPatient, selectedFloor]);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // ダミーの利用者リスト
  const dummyUsers = [
    { id: '1', name: '田中 太郎' },
    { id: '2', name: '佐藤 花子' },
    { id: '3', name: '鈴木 一郎' },
    { id: '4', name: '高橋 美咲' },
    { id: '5', name: '渡辺 健太' },
  ];

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
          <h1 className="text-2xl font-bold text-gray-800">食事記録作成</h1>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* ボタン */}
        <div className="flex gap-3 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowBulkModal(true)}
          >
            一括登録
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/patients')}
          >
            利用者追加
          </Button>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-lg shadow p-4">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {record.patientName}
                </h3>
                <p className="text-sm text-gray-600">{record.floor}</p>
                <p className="text-xs text-gray-500 mt-1">
                  登録日時: {record.registeredAt}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    食事内容パターン
                  </label>
                  <select
                    defaultValue={record.mealContentPattern}
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

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    食前の食事量
                  </label>
                  <input
                    type="number"
                    defaultValue={record.preMealAmount}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事残渣量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.foodResidue}g
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-主食</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.mainDishIntake}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-副食</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.sideDishIntake}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取割合</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.intakePercentage}%
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">水分量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.waterAmount}ml
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">水分摂取量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.waterIntake}ml
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">備考</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.remarks || '—'}
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
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  登録日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  利用者名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食事内容パターン
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食前の食事量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食事残渣量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食事摂取量-主食
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食事摂取量-副食
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  食事摂取割合
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  水分量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                  水分摂取量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  備考
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.registeredAt}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <select
                      defaultValue={record.mealContentPattern}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    >
                      <option value="">選択してください</option>
                      <option value="通常食">通常食</option>
                      <option value="軟菜食">軟菜食</option>
                      <option value="きざみ食">きざみ食</option>
                      <option value="ミキサー食">ミキサー食</option>
                      <option value="治療食">治療食</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 border-r border-gray-200">
                    <input
                      type="number"
                      defaultValue={record.preMealAmount}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.foodResidue}g
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.mainDishIntake}%
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.sideDishIntake}%
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.intakePercentage}%
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.waterAmount}ml
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.waterIntake}ml
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {record.remarks || '—'}
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

        {/* 一括登録モーダル */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              {/* ヘッダー */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  一括登録
                </h2>
                <button
                  onClick={() => setShowBulkModal(false)}
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
                {/* 利用者リスト */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    利用者を選択
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3">
                    {dummyUsers.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-900">
                          {user.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* フッター */}
              <div className="flex gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowBulkModal(false)}
                >
                  一括選択追加
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowBulkModal(false)}
                >
                  一括削除
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
