'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockInterventionData } from '@/data/mockInterventions';

export default function InterventionsPage() {
  const router = useRouter();

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
    return mockInterventionData.filter((record) => {
      // 期間フィルター
      if (startDate) {
        const recordDate = new Date(record.recordDateTime);
        const filterStartDate = new Date(startDate);
        if (recordDate < filterStartDate) return false;
      }
      if (endDate) {
        const recordDate = new Date(record.recordDateTime);
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
      '居室番号',
      '記録日時',
      '開始日時',
      '終了日時',
      'スタッフ名',
      '利用者名',
      '介入区分',
      '介入内容',
      '医師',
      '医師からの指示内容',
      '備考',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          record.facilityNumber,
          record.recordDateTime,
          record.startDateTime,
          record.endDateTime,
          record.staffName,
          record.patientName,
          record.interventionType,
          `"${record.interventionContent}"`,
          record.doctorName,
          `"${record.doctorInstructions}"`,
          `"${record.notes}"`,
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
      `介入実績_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ケアカルテ用CSVダウンロード
  const handleDownloadCareCarteCSV = () => {
    const headers = [
      '居室番号',
      '記録日時',
      '開始日時',
      '終了日時',
      'スタッフ名',
      '利用者名',
      '介入区分',
      '介入内容',
      '医師',
      '医師からの指示内容',
      '備考',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          record.facilityNumber,
          record.recordDateTime,
          record.startDateTime,
          record.endDateTime,
          record.staffName,
          record.patientName,
          record.interventionType,
          `"${record.interventionContent}"`,
          record.doctorName,
          `"${record.doctorInstructions}"`,
          `"${record.notes}"`,
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
      `ケアカルテ用_介入実績_${new Date().toISOString().split('T')[0]}.csv`
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
            <h1 className="text-2xl font-bold text-gray-800">介入実績管理</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/interventions/create')}
            >
              介入実績作成
            </Button>
            {!isMobile && (
              <>
                <Button variant="outline" onClick={handleDownloadCareCarteCSV}>
                  CSVダウンロード（ケアカルテ用）
                </Button>
                <Button variant="primary" onClick={handleDownloadCSV}>
                  CSVダウンロード
                </Button>
              </>
            )}
          </div>
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
              {/* ヘッダー */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {record.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      居室番号: {record.facilityNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {record.recordDateTime}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/interventions/${record.id}/edit`)
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>

              {/* 介入情報 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">介入区分</span>
                  <span className="text-sm font-medium text-blue-600">
                    {record.interventionType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">スタッフ名</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.staffName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">開始日時</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.startDateTime}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">終了日時</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.endDateTime}
                  </span>
                </div>
                <div className="py-2">
                  <span className="text-sm text-gray-600 block mb-2">
                    介入内容
                  </span>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                    {record.interventionContent}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">医師</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.doctorName || '-'}
                  </span>
                </div>
                {record.doctorInstructions && (
                  <div className="py-2">
                    <span className="text-sm text-gray-600 block mb-2">
                      医師からの指示内容
                    </span>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {record.doctorInstructions}
                    </p>
                  </div>
                )}
                {record.notes && (
                  <div className="py-2">
                    <span className="text-sm text-gray-600 block mb-2">
                      備考
                    </span>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {record.notes}
                    </p>
                  </div>
                )}
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
                  居室番号
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  記録日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  開始日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  終了日時
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  スタッフ名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用者名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  介入区分
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  介入内容
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  医師
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  医師からの指示内容
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  備考
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
                    {record.facilityNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.recordDateTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.startDateTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.endDateTime}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.staffName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.interventionType}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {record.interventionContent}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.doctorName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {record.doctorInstructions || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {record.notes || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() =>
                        router.push(`/interventions/${record.id}/edit`)
                      }
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
