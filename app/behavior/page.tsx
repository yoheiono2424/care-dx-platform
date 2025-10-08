'use client';

import { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockBehaviorData } from '@/data/mockBehaviorData';

export default function BehaviorPage() {
  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
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
    return mockBehaviorData.filter((record) => {
      // 期間フィルター
      if (startDate) {
        const recordDate = new Date(record.date);
        const filterStartDate = new Date(startDate);
        if (recordDate < filterStartDate) return false;
      }
      if (endDate) {
        const recordDate = new Date(record.date);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        if (recordDate > filterEndDate) return false;
      }

      // 利用者名フィルター
      if (selectedPatient && record.patientName !== selectedPatient) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedPatient]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      '利用者名',
      '居室番号',
      '臥床時間(平均)',
      '立ち上がり回数-ベッド(平均)',
      '立ち上がり回数-ベッド外(平均)',
      '立ち上がり回数-合計',
      '居室外滞在時間(平均)',
      '職員の来室回数(平均)',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          record.patientName,
          record.roomName,
          record.bedTimeAvg,
          record.standUpBedAvg,
          record.standUpOutsideAvg,
          record.standUpTotal,
          record.outsideRoomTimeAvg,
          record.buildingExitCountAvg,
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
      `行動データ_${new Date().toISOString().split('T')[0]}.csv`
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
            <h1 className="text-2xl font-bold text-gray-800">行動データ管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              利用者の行動データを管理します
            </p>
          </div>
          {!isMobile && (
            <Button variant="primary" onClick={handleDownloadCSV}>
              CSVダウンロード
            </Button>
          )}
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {/* 利用者情報 */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">
                  {record.patientName}
                </h3>
                <p className="text-sm text-gray-600">{record.roomName}</p>
              </div>

              {/* 臥床・基本動作 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 bg-blue-50 px-3 py-2 rounded">
                  臥床・基本動作（1日あたり）
                </h4>
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      臥床時間(平均)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.bedTimeAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      立ち上がり回数-ベッド(平均)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.standUpBedAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      立ち上がり回数-ベッド外(平均)
                    </span>
                    <input
                      type="number"
                      defaultValue={record.standUpOutsideAvg}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">合計</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.standUpTotal}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 日々の過ごし方 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 bg-green-50 px-3 py-2 rounded">
                  日々の過ごし方等（1日あたり）
                </h4>
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      居室外滞在時間(平均)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.outsideRoomTimeAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      職員の来室回数(平均)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {record.buildingExitCountAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
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
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {/* グループヘッダー行 */}
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b-2 border-gray-200"
                >
                  利用者名
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b-2 border-gray-200"
                >
                  居室番号
                </th>
                <th
                  colSpan={4}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b border-gray-200"
                >
                  臥床・基本動作（1日あたり）
                </th>
                <th
                  colSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-b border-gray-200"
                >
                  日々の過ごし方等（1日あたり）
                </th>
              </tr>
              <tr>
                {/* 臥床・基本動作 */}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  臥床時間
                  <br />
                  (平均)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  立ち上がり回数
                  <br />
                  (平均)
                  <br />
                  (ベッド)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  立ち上がり回数
                  <br />
                  (平均)
                  <br />
                  (ベッド外)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  合計
                </th>
                {/* 日々の過ごし方等 */}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  居室外滞在時間
                  <br />
                  (平均)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-b-2 border-gray-200 whitespace-nowrap">
                  職員の来室回数
                  <br />
                  (平均)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-medium text-gray-900 border-r border-gray-200">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.roomName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <span className="flex-1 text-center">
                        {record.bedTimeAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="ml-2"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <span className="flex-1 text-center">
                        {record.standUpBedAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="ml-2"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    <input
                      type="number"
                      defaultValue={record.standUpOutsideAvg}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <span className="flex-1 text-center">
                        {record.standUpTotal}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="ml-2"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    <div className="flex items-center justify-center">
                      <span className="flex-1 text-center">
                        {record.outsideRoomTimeAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="ml-2"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center justify-center">
                      <span className="flex-1 text-center">
                        {record.buildingExitCountAvg}
                      </span>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="ml-2"
                      />
                    </div>
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
