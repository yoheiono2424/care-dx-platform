'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import {
  mockVitalRecords,
  availablePatientNames,
  availableFloors,
} from '@/data/mockVitals';
import type { VitalRecord } from '@/data/mockVitals';

export default function VitalsPage() {
  const router = useRouter();

  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [isMobile, setIsMobile] = useState(true);

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
    return mockVitalRecords.filter((record) => {
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
      '血圧',
      '脈拍',
      '酸素飽和度',
      '体温',
      '心電図',
      '身長',
      '体重',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          new Date(record.registeredAt).toLocaleString('ja-JP'),
          record.patientName,
          record.bloodPressure,
          record.pulse,
          record.oxygenSaturation,
          record.temperature,
          record.ecg,
          record.height,
          record.weight,
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
      `バイタルデータ_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 日時フォーマット
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 編集画面へ遷移
  const handleEdit = (id: string) => {
    router.push(`/vitals/${id}/edit`);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">バイタル管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              利用者のバイタルデータを管理します
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
                placeholder="フロア名"
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
                    onClick={() => handleEdit(record.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>

              {/* バイタル情報 */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-50 p-3 rounded">
                    <span className="text-xs text-gray-600 block mb-1">
                      血圧
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {record.bloodPressure}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <span className="text-xs text-gray-600 block mb-1">
                      脈拍
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {record.pulse}bpm
                    </span>
                  </div>
                  <div className="bg-cyan-50 p-3 rounded">
                    <span className="text-xs text-gray-600 block mb-1">
                      酸素飽和度
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {record.oxygenSaturation}%
                    </span>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <span className="text-xs text-gray-600 block mb-1">
                      体温
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {record.temperature}°C
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-600">心電図</span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded ${
                      record.ecg === '正常'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.ecg}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">身長</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.height}cm
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">体重</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.weight}kg
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  登録日時
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用者名
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  血圧
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  脈拍
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  酸素飽和度
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  体温
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  心電図
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  身長
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  体重
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  編集
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(record.registeredAt)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.bloodPressure}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.pulse}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.oxygenSaturation}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.temperature}°C
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.ecg === '正常'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.ecg}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.height}cm
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {record.weight}kg
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(record.id)}
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
