'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockRoomData } from '@/data/mockRooms';

export default function RoomsPage() {
  const router = useRouter();

  // フィルター状態
  const [selectedFacility, setSelectedFacility] = useState('');

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return mockRoomData.filter((record) => {
      // 施設名フィルター
      if (selectedFacility && !record.facility.includes(selectedFacility)) {
        return false;
      }

      return true;
    });
  }, [selectedFacility]);

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">部屋番号管理</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/rooms/create')}
            >
              部屋番号作成
            </Button>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 施設名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                施設名
              </label>
              <input
                type="text"
                placeholder="施設名"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
              <div className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {record.roomNumber}
                    </h3>
                    <p className="text-sm text-gray-600">{record.facility}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      {record.status}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/rooms/${record.id}/edit`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">作成日</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.createdAt}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <button
                    onClick={() => {
                      alert(
                        `QRコードを生成します: 部屋番号 ${record.roomNumber}`
                      );
                    }}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    QRコード生成
                  </button>
                </div>
              </div>
            </div>
          ))}
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
                  作成日
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  部屋番号
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  施設名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用ステータス
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  編集
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  QRコード
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.createdAt}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.roomNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.facility}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.status}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => router.push(`/rooms/${record.id}/edit`)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => {
                        // QRコード生成処理（今後実装）
                        alert(
                          `QRコードを生成します: 部屋番号 ${record.roomNumber}`
                        );
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      QRコード
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
      </div>
    </MainLayout>
  );
}
