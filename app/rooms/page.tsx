'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockRoomData } from '@/data/mockRooms';
import { mockFacilityData } from '@/data/mockFacilities';

export default function RoomsPage() {
  const router = useRouter();

  // フィルター状態
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(0);

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return mockRoomData.filter((record) => {
      // 施設IDフィルター
      if (
        selectedFacilityId !== 0 &&
        record.facilityId !== selectedFacilityId
      ) {
        return false;
      }

      return true;
    });
  }, [selectedFacilityId]);

  // 施設ごとにグループ化
  const groupedByFacility = useMemo(() => {
    const groups: { [key: number]: typeof mockRoomData } = {};

    filteredRecords.forEach((record) => {
      if (!groups[record.facilityId]) {
        groups[record.facilityId] = [];
      }
      groups[record.facilityId].push(record);
    });

    // 各施設内で部屋番号でソート
    Object.keys(groups).forEach((facilityId) => {
      groups[Number(facilityId)].sort((a, b) =>
        a.roomNumber.localeCompare(b.roomNumber, 'ja', { numeric: true })
      );
    });

    return groups;
  }, [filteredRecords]);

  // 施設IDの配列を施設名順にソート
  const sortedFacilityIds = useMemo(() => {
    return Object.keys(groupedByFacility)
      .map(Number)
      .sort((a, b) => {
        const facilityA = mockFacilityData.find((f) => f.id === a);
        const facilityB = mockFacilityData.find((f) => f.id === b);
        return (facilityA?.name || '').localeCompare(
          facilityB?.name || '',
          'ja'
        );
      });
  }, [groupedByFacility]);

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
            {/* 施設 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                施設
              </label>
              <select
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>すべての施設</option>
                {mockFacilityData.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* データ件数表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredRecords.length}件のデータが見つかりました
          </p>
        </div>

        {/* スマホ表示: カード形式（現状維持） */}
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

        {/* PC表示: 施設ごとにグループ化したリスト表示 */}
        <div className="hidden md:block space-y-6">
          {sortedFacilityIds.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">データがありません</p>
            </div>
          ) : (
            sortedFacilityIds.map((facilityId) => {
              const facility = mockFacilityData.find(
                (f) => f.id === facilityId
              );
              const rooms = groupedByFacility[facilityId];

              return (
                <div
                  key={facilityId}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {/* 施設見出し */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {facility?.name || '不明な施設'} ({rooms.length}部屋)
                    </h2>
                  </div>

                  {/* 部屋リスト */}
                  <div className="divide-y divide-gray-100">
                    {rooms.map((record) => (
                      <div
                        key={record.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        {/* 左側: 部屋番号とステータス */}
                        <div className="flex items-center gap-6">
                          <div className="text-lg font-semibold text-gray-900 w-20">
                            {record.roomNumber}
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                record.status === '利用中'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            作成日: {record.createdAt}
                          </div>
                        </div>

                        {/* 右側: ボタン */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              router.push(`/rooms/${record.id}/edit`)
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => {
                              alert(
                                `QRコードを生成します: 部屋番号 ${record.roomNumber}`
                              );
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            QRコード
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
}
