'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockAccidentReports } from '@/data/mockAccidentReports';

export default function AccidentReportsPage() {
  const router = useRouter();

  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
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
  const filteredReports = useMemo(() => {
    return mockAccidentReports.filter((report) => {
      // 期間フィルター
      if (startDate) {
        const reportDate = new Date(report.reportDate);
        const filterStartDate = new Date(startDate);
        if (reportDate < filterStartDate) return false;
      }
      if (endDate) {
        const reportDate = new Date(report.reportDate);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        if (reportDate > filterEndDate) return false;
      }

      // 利用者名フィルター
      if (selectedPatient && report.patientName !== selectedPatient) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedPatient]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      '利用者名',
      '生年月日',
      '年齢',
      '発生時年齢',
      '性別',
      'サービス利用開始日',
      '介護度',
      '事業所名',
      '号室',
      '施設名',
      'フロア',
      '報告日',
      '報告者名',
      '事故発生日',
      '事故発生時刻',
      '発生場所',
      '事故の種類',
      '事故内容',
      '補足説明',
      '受診方法',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredReports.map((report) =>
        [
          report.id,
          report.patientName,
          report.birthDate,
          report.age,
          report.ageAtIncident,
          report.gender,
          report.serviceStartDate,
          report.careLevel,
          report.facilityName,
          report.roomNumber,
          report.buildingName,
          report.floor,
          report.reportDate,
          report.reporterName,
          report.incidentDate,
          report.incidentTime,
          report.location,
          report.incidentType,
          `"${report.incidentDescription}"`,
          `"${report.supplementaryNote}"`,
          report.consultationMethod,
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
      `事故報告データ_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 編集画面へ遷移
  const handleEdit = (id: string) => {
    router.push(`/accident-reports/${id}/edit`);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">事故報告管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              事故報告データを管理します
            </p>
          </div>
          {!isMobile && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push('/accident-reports/create')}
              >
                事故報告作成
              </Button>
              <Button variant="primary" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            </div>
          )}
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 期間検索（最小値） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間（開始日）
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 期間検索（最大値） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間（終了日）
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者名
              </label>
              <input
                type="text"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                placeholder="利用者名を入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* モバイル: ボタン群 */}
        {isMobile && (
          <div className="mb-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/accident-reports/create')}
              className="flex-1"
            >
              作成
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadCSV}
              className="flex-1"
            >
              CSV
            </Button>
          </div>
        )}

        {/* データ件数表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredReports.length}件のデータが見つかりました
          </p>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-4">
              {/* ヘッダー */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {report.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {report.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      報告日: {report.reportDate}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(report.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    編集
                  </button>
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600 text-xs">生年月日:</span>
                    <p className="font-medium">{report.birthDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">年齢:</span>
                    <p className="font-medium">
                      {report.age}歳 (発生時: {report.ageAtIncident}歳)
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">性別:</span>
                    <p className="font-medium">{report.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">介護度:</span>
                    <p className="font-medium">{report.careLevel}</p>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs text-gray-600 mb-1">施設情報</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600 text-xs">事業所:</span>
                      <p className="font-medium text-xs">
                        {report.facilityName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">施設名:</span>
                      <p className="font-medium text-xs">
                        {report.buildingName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">号室:</span>
                      <p className="font-medium">{report.roomNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">フロア:</span>
                      <p className="font-medium">{report.floor}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs text-gray-600 mb-1">事故情報</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">報告日:</span>
                      <span className="font-medium">{report.reportDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">報告者:</span>
                      <span className="font-medium">{report.reporterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">
                        事故発生日時:
                      </span>
                      <span className="font-medium">
                        {report.incidentDate} {report.incidentTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">発生場所:</span>
                      <span className="font-medium">{report.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">事故の種類:</span>
                      <span className="font-medium">{report.incidentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-xs">受診方法:</span>
                      <span className="font-medium">
                        {report.consultationMethod}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-gray-600 block mb-1 text-xs">
                    事故内容＆発生時の状況:
                  </span>
                  <p className="text-gray-900 text-xs bg-gray-50 p-2 rounded">
                    {report.incidentDescription}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 block mb-1 text-xs">
                    補足説明:
                  </span>
                  <p className="text-gray-900 text-xs bg-gray-50 p-2 rounded">
                    {report.supplementaryNote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PC表示: テーブル形式 */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    利用者名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    生年月日
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    年齢
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    発生時年齢
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    性別
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    サービス利用開始日
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    介護度
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事業所名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    号室
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    施設名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    フロア
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    報告日
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    報告者名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事故発生日
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事故発生時刻
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    発生場所
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事故の種類
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事故内容＆発生時の状況
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    補足説明
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    受診方法
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.patientName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.birthDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.age}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.ageAtIncident}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.gender}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.serviceStartDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.careLevel}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.facilityName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.roomNumber}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.buildingName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.floor}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.reportDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.reporterName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.incidentDate}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.incidentTime}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.incidentType}
                    </td>
                    <td
                      className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                      title={report.incidentDescription}
                    >
                      {report.incidentDescription}
                    </td>
                    <td
                      className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                      title={report.supplementaryNote}
                    >
                      {report.supplementaryNote}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.consultationMethod}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleEdit(report.id)}
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
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">データがありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
