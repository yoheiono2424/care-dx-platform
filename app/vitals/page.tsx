'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockVitalRecords } from '@/data/mockVitals';

export default function VitalsPage() {
  const router = useRouter();

  // タブ状態（一覧タブは押下しても反応しない仕様のため、activeTabのみ保持）
  const [activeTab] = useState<'list' | 'individual' | 'floor'>('list');

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
      '呼吸数',
      '酸素飽和度',
      '体温',
      '心電図',
      '身長',
      '体重',
      '咳嗽',
      '痰の量',
      '痰の色',
      '痰の性状',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          new Date(record.registeredAt).toLocaleString('ja-JP'),
          record.patientName,
          record.bloodPressure,
          record.pulse,
          record.respiratoryRate,
          record.oxygenSaturation,
          record.temperature,
          record.ecg,
          record.height,
          record.weight,
          record.cough,
          record.sputumAmount,
          record.sputumColor,
          record.sputumConsistency,
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

  // タブ切り替え
  const handleTabChange = (tab: 'list' | 'individual' | 'floor') => {
    if (tab === 'individual') {
      router.push('/vitals/overview/individual');
    } else if (tab === 'floor') {
      router.push('/vitals/overview/team');
    }
    // 一覧タブは何もしない（現在のページのまま）
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
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push('/vitals/create')}
              >
                新規登録
              </Button>
              <Button variant="primary" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            </div>
          )}
        </div>

        {/* タブ */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                一覧
              </button>
              <button
                onClick={() => handleTabChange('individual')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'individual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                個人
              </button>
              <button
                onClick={() => handleTabChange('floor')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'floor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                フロア
              </button>
            </nav>
          </div>
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

        {/* モバイル: ボタン群 */}
        {isMobile && (
          <div className="mb-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/vitals/create')}
              className="flex-1"
            >
              新規登録
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
                  <div className="bg-purple-50 p-3 rounded">
                    <span className="text-xs text-gray-600 block mb-1">
                      呼吸数
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {record.respiratoryRate}回/分
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
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">体重</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.weight}kg
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">咳嗽</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.cough}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">痰の量</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.sputumAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">痰の色</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.sputumColor}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">痰の性状</span>
                  <span className="text-sm font-medium text-gray-900">
                    {record.sputumConsistency}
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  利用者名
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  血圧
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  脈拍
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  呼吸数
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  酸素飽和度
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  体温
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  心電図
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  身長
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  体重
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  咳嗽
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  痰の量
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  痰の色
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  痰の性状
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.patientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.bloodPressure}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.pulse}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.respiratoryRate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.oxygenSaturation}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.temperature}°C
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
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
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.height}cm
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.weight}kg
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.cough}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.sputumAmount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.sputumColor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                    {record.sputumConsistency}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
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
