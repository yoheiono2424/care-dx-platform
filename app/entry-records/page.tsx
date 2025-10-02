'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockRoomEntryData } from '@/data/mockRoomEntries';
import type { RoomEntryRecord } from '@/data/mockRoomEntries';

export default function RoomEntriesPage() {
  const router = useRouter();

  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
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

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return mockRoomEntryData.filter((record) => {
      // 期間フィルター
      if (startDate) {
        const recordDate = new Date(record.entryDateTime);
        const filterStartDate = new Date(startDate);
        if (recordDate < filterStartDate) return false;
      }
      if (endDate) {
        const recordDate = new Date(record.entryDateTime);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        if (recordDate > filterEndDate) return false;
      }

      // 利用者名フィルター
      if (selectedPatient && record.patientName !== selectedPatient) {
        return false;
      }

      // スタッフ名フィルター
      if (selectedStaff && record.staffName !== selectedStaff) {
        return false;
      }

      // フロアフィルター
      if (
        selectedFloor &&
        !record.roomNumber.startsWith(selectedFloor.charAt(0))
      ) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedPatient, selectedStaff, selectedFloor]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      '居室番号',
      '利用者名',
      'スタッフ名',
      '入室日時',
      '退室日時',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          record.roomNumber,
          record.patientName,
          record.staffName,
          record.entryDateTime,
          record.exitDateTime,
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
      `入室記録_${new Date().toISOString().split('T')[0]}.csv`
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
            <h1 className="text-2xl font-bold text-gray-800">入室記録</h1>
          </div>
          <div className="flex gap-2">
            {!isMobile && (
              <Button variant="primary" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            )}
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* スタッフ名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                スタッフ名
              </label>
              <input
                type="text"
                placeholder="スタッフ名"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* フロア（2行目） */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
                <h3 className="text-lg font-bold text-gray-900">
                  {record.patientName}
                </h3>
                <p className="text-sm text-gray-600">
                  居室番号: {record.roomNumber}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">スタッフ名</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.staffName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">入室日時</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.entryDateTime}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">退室日時</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.exitDateTime}
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
                  居室番号
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用者名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  スタッフ名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  入室日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  退室日時
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.roomNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.staffName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.entryDateTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.exitDateTime}
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
