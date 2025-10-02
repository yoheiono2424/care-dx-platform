'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockFloorData } from '@/data/mockFacilities';

export default function FloorsPage() {
  const router = useRouter();

  // フィルター状態
  const [selectedName, setSelectedName] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return mockFloorData.filter((record) => {
      // フロア名フィルター
      if (selectedName && !record.name.includes(selectedName)) {
        return false;
      }

      // 所属フロアフィルター
      if (selectedFacility && !record.facility.includes(selectedFacility)) {
        return false;
      }

      return true;
    });
  }, [selectedName, selectedFacility]);

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">フロア管理</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/floors/create')}
            >
              フロア作成
            </Button>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* フロア名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                フロア名
              </label>
              <input
                type="text"
                placeholder="フロア名"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 所属フロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                所属フロア
              </label>
              <input
                type="text"
                placeholder="フロア名"
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
                      {record.name}
                    </h3>
                    <p className="text-sm text-gray-600">{record.facility}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      {record.status}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/floors/${record.id}/edit`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">種別</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.type}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">所属するフロア</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.parentFloor}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">作成日</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.createdAt}
                  </span>
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
                  フロア名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  種別
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  所属する施設
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  所属するフロア
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用ステータス
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
                    {record.createdAt}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.facility}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.parentFloor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.status}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => router.push(`/floors/${record.id}/edit`)}
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
      </div>
    </MainLayout>
  );
}
