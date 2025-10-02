'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function MealCreatePage() {
  const router = useRouter();
  const [showBulkModal, setShowBulkModal] = useState(false);

  // フォームデータ
  const [formData, setFormData] = useState({
    patientName: '',
    floor: '',
    mealContentPattern: '',
    foodBefore: '',
    preMealAmount: '',
    foodResidue: '',
    mainDishIntake: '',
    sideDishIntake: '',
    intakePercentage: '',
    waterAmount: '',
    waterIntake: '',
  });

  // 一括登録用のデータ
  const [bulkData, setBulkData] = useState({
    patientName: '',
    patientId: '',
    floor: '',
  });

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // ダミーの利用者リスト
  const dummyUsers = [
    { id: '1', name: '田中 太郎' },
    { id: '2', name: '佐藤 花子' },
    { id: '3', name: '鈴木 一郎' },
    { id: '4', name: '高橋 美咲' },
    { id: '5', name: '渡辺 健太' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/meals');
  };

  const handleBulkSubmit = () => {
    // 一括登録処理（今後実装）
    setShowBulkModal(false);
    router.push('/meals');
  };

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
                placeholder="施設名"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
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
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
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
        <div className="md:hidden">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">田中 太郎</h3>
                <p className="text-sm text-gray-600">
                  登録日時: 2025-10-01 08:00
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    食事内容パターン
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value=""></option>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事残渣量</span>
                  <span className="text-sm font-medium text-gray-900">80g</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-主食</span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取量-副食</span>
                  <span className="text-sm font-medium text-gray-900">90%</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">食事摂取割合</span>
                  <span className="text-sm font-medium text-gray-900">87%</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">水分量</span>
                  <span className="text-sm font-medium text-gray-900">
                    300ml
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">水分摂取量</span>
                  <span className="text-sm font-medium text-gray-900">
                    280ml
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/meals/1/edit')}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* PC表示: テーブル */}
        <form
          onSubmit={handleSubmit}
          className="hidden md:block bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* テーブル形式の入力 */}
            <div className="overflow-x-auto">
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
                      編集
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      2025-10-01 08:00
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      田中 太郎
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      <select className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm">
                        <option value=""></option>
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
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      80g
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      85%
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      90%
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      87%
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      300ml
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      280ml
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        type="button"
                        onClick={() => router.push('/meals/1/edit')}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        編集
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </form>

        {/* 一括登録モーダル */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              {/* ヘッダー */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">フロア</h2>
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
                {/* 利用者名 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    利用者名
                  </label>
                  <input
                    type="text"
                    placeholder="施設名"
                    value={bulkData.patientName}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, patientName: e.target.value })
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
                    value={bulkData.floor}
                    onChange={(e) =>
                      setBulkData({ ...bulkData, floor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    <option value="1階">1階</option>
                    <option value="2階">2階</option>
                    <option value="3階">3階</option>
                  </select>
                </div>

                {/* 利用者リスト */}
                <div>
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
                          {user.name}（{user.id}）
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
