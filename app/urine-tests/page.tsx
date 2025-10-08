'use client';

import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockUrineTestData } from '@/data/mockUrineTests';

export default function UrineTestsPage() {
  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // CSVアップロード用のref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    return mockUrineTestData.filter((record) => {
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

      return true;
    });
  }, [startDate, endDate, selectedPatient]);

  // 上部スクロールバーの幅をテーブルと同期
  useEffect(() => {
    const syncScrollbarWidth = () => {
      const tableContainer = document.getElementById('table-container');
      const scrollbarContent = document.getElementById('scrollbar-content');
      if (tableContainer && scrollbarContent) {
        const table = tableContainer.querySelector('table');
        if (table) {
          scrollbarContent.style.width = `${table.scrollWidth}px`;
        }
      }
    };

    syncScrollbarWidth();
    window.addEventListener('resize', syncScrollbarWidth);
    return () => window.removeEventListener('resize', syncScrollbarWidth);
  }, [filteredRecords]);

  // CSVアップロード
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // バックエンド実装時はここでファイルをアップロード
      console.log('アップロードファイル:', file.name);
      alert(
        `CSVファイル「${file.name}」を選択しました。\n※バックエンド実装時にデータ取込処理を行います。`
      );
      // input要素をリセット（同じファイルを再選択可能にする）
      event.target.value = '';
    }
  };

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      '登録日時',
      '利用者名',
      '白血球',
      'ウロビリノーゲン',
      '潜血',
      'ビリルビン',
      '尿糖',
      'アルブミン-主食',
      '尿蛋白',
      '亜硝酸塩',
      '尿酸',
      '脂肪燃焼-score',
      '糖質-score',
      '野菜-score',
      '水分-score',
      '塩分-score',
      'ビタミンC-score',
      'マグネシウム-score',
      'カルシウム-score',
      '酸化ストレスレベル-score',
      '亜鉛-score',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRecords.map((record) =>
        [
          new Date(record.registeredAt).toLocaleString('ja-JP'),
          record.patientName,
          record.whiteBloodCells,
          record.urobilinogen,
          record.occultBlood,
          record.bilirubin,
          record.glucose,
          record.albuminMainDish,
          record.protein,
          record.nitrite,
          record.uricAcid,
          record.fatBurningScore,
          record.carbScore,
          record.vegetableScore,
          record.waterScore,
          record.saltScore,
          record.vitaminCScore,
          record.magnesiumScore,
          record.calciumScore,
          record.oxidativeStressScore,
          record.zincScore,
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
      `尿検査データ_${new Date().toISOString().split('T')[0]}.csv`
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

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">尿検査管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              利用者の尿検査データを管理します
            </p>
          </div>
          {!isMobile && (
            <div className="flex gap-3">
              {/* CSVアップロード用の非表示input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button variant="primary" onClick={handleUploadClick}>
                CSVアップロード
              </Button>
              <Button variant="outline" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            </div>
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
              {/* ヘッダー */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {record.patientName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {record.registeredAt}
                  </p>
                </div>
              </div>

              {/* 基本検査項目 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 bg-blue-50 px-3 py-2 rounded">
                  基本検査項目
                </h4>
                <div className="grid grid-cols-2 gap-3 px-2">
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      白血球
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.whiteBloodCells}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      ウロビリノーゲン
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.urobilinogen}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      潜血
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.occultBlood}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      ビリルビン
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.bilirubin}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      尿糖
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.glucose}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      アルブミン
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.albuminMainDish}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      尿蛋白
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.protein}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      亜硝酸塩
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.nitrite}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      尿酸
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.uricAcid}
                    </span>
                  </div>
                </div>
              </div>

              {/* スコア項目 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 bg-green-50 px-3 py-2 rounded">
                  スコア項目
                </h4>
                <div className="grid grid-cols-2 gap-3 px-2">
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      脂肪燃焼
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.fatBurningScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      糖質
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.carbScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      野菜
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.vegetableScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      水分
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.waterScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      塩分
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.saltScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      ビタミンC
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.vitaminCScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      マグネシウム
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.magnesiumScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      カルシウム
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.calciumScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      酸化ストレス
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.oxidativeStressScore}
                    </span>
                  </div>
                  <div className="py-2">
                    <span className="text-xs text-gray-600 block mb-1">
                      亜鉛
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.zincScore}
                    </span>
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
        <div className="hidden md:block bg-white rounded-lg shadow">
          {/* 横スクロールバー（上部） */}
          <div
            id="top-scrollbar"
            className="overflow-x-auto overflow-y-hidden"
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              const tableContainer = document.getElementById('table-container');
              if (tableContainer) {
                tableContainer.scrollLeft = target.scrollLeft;
              }
            }}
          >
            <div id="scrollbar-content" style={{ height: '20px' }}></div>
          </div>

          {/* テーブルコンテナ */}
          <div
            id="table-container"
            className="overflow-x-auto"
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              const topScrollbar = document.getElementById('top-scrollbar');
              if (topScrollbar) {
                topScrollbar.scrollLeft = target.scrollLeft;
              }
            }}
            onWheel={(e) => {
              if (e.shiftKey) {
                e.preventDefault();
                const target = e.currentTarget as HTMLDivElement;
                target.scrollLeft += e.deltaY;
              }
            }}
          >
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">
                    登録日時
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">
                    利用者名
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    白血球
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    ウロビリノーゲン
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    潜血
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    ビリルビン
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    尿糖
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    アルブミン
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    尿蛋白
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    亜硝酸塩
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-blue-50 border-r border-gray-200">
                    尿酸
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    脂肪燃焼
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    糖質
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    野菜
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    水分
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    塩分
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    ビタミンC
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    マグネシウム
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    カルシウム
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    酸化ストレス
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50 border-r border-gray-200">
                    亜鉛
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {formatDateTime(record.registeredAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-medium text-gray-900 border-r border-gray-200">
                      {record.patientName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.whiteBloodCells}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.urobilinogen}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.occultBlood}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.bilirubin}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.glucose}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.albuminMainDish}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.protein}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.nitrite}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                      {record.uricAcid}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.fatBurningScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.carbScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.vegetableScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.waterScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.saltScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.vitaminCScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.magnesiumScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.calciumScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.oxidativeStressScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-semibold text-gray-900 border-r border-gray-200">
                      {record.zincScore}
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
      </div>
    </MainLayout>
  );
}
