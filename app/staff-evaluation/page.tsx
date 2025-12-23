'use client';

import { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import {
  mockStaffEvaluations,
  positionOrder,
  facilityNames,
} from '@/data/mockStaffEvaluation';

type Position =
  | '取締役'
  | '施設長'
  | '部長'
  | 'フロア長'
  | '主任'
  | 'チーフ'
  | 'スタッフ';

export default function StaffEvaluationPage() {
  // 現在のログインユーザーの役職（モック）
  const [currentUserPosition] = useState<Position>('施設長');

  // フィルター状態
  const [selectedPeriod, setSelectedPeriod] = useState('2025年12月');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 役職に基づくデータフィルタリング
  const getVisiblePositions = (userPosition: Position): Position[] => {
    const userIndex = positionOrder.indexOf(userPosition);
    // 自分より下位の役職のデータのみ表示可能（自分と同じ役職も含む）
    return positionOrder.slice(userIndex) as Position[];
  };

  // フィルタリングされたデータ
  const filteredData = useMemo(() => {
    const visiblePositions = getVisiblePositions(currentUserPosition);

    return mockStaffEvaluations.filter((staff) => {
      // 役職による表示制御
      if (!visiblePositions.includes(staff.position)) {
        return false;
      }

      // 期間フィルター
      if (selectedPeriod && staff.period !== selectedPeriod) {
        return false;
      }

      // 施設フィルター
      if (selectedFacility && staff.facilityName !== selectedFacility) {
        return false;
      }

      // 役職フィルター
      if (selectedPosition && staff.position !== selectedPosition) {
        return false;
      }

      return true;
    });
  }, [currentUserPosition, selectedPeriod, selectedFacility, selectedPosition]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      'スタッフ名',
      '役職',
      '施設名',
      'フロア',
      'タスク件数',
      '介入件数',
      'おむつ交換件数',
      '文字数',
      '対象期間',
      '最終更新日',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredData.map((staff) =>
        [
          staff.id,
          staff.staffName,
          staff.position,
          staff.facilityName,
          staff.floor,
          staff.taskCount,
          staff.interventionCount,
          staff.diaperChangeCount,
          staff.characterCount,
          staff.period,
          staff.lastUpdated,
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
      `スタッフ評価データ_${selectedPeriod.replace('年', '').replace('月', '')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 役職バッジの色
  const getPositionColor = (position: string) => {
    switch (position) {
      case '取締役':
        return 'bg-purple-100 text-purple-800';
      case '施設長':
        return 'bg-indigo-100 text-indigo-800';
      case '部長':
        return 'bg-blue-100 text-blue-800';
      case 'フロア長':
        return 'bg-cyan-100 text-cyan-800';
      case '主任':
        return 'bg-green-100 text-green-800';
      case 'チーフ':
        return 'bg-yellow-100 text-yellow-800';
      case 'スタッフ':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 期間リスト生成
  const periodOptions = [
    '2025年12月',
    '2025年11月',
    '2025年10月',
    '2025年9月',
    '2025年8月',
  ];

  // 表示可能な役職リスト
  const visiblePositions = getVisiblePositions(currentUserPosition);

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">スタッフ評価</h1>
            <p className="text-sm text-gray-600 mt-1">
              スタッフの業務実績を確認します（役職: {currentUserPosition}）
            </p>
          </div>
          {!isMobile && (
            <Button variant="primary" onClick={handleDownloadCSV}>
              CSVダウンロード
            </Button>
          )}
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 期間選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                対象期間
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periodOptions.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            {/* 施設フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                施設
              </label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {facilityNames.map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
            </div>

            {/* 役職フィルター */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {visiblePositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* モバイル: CSVボタン */}
        {isMobile && (
          <div className="mb-4">
            <Button
              variant="primary"
              onClick={handleDownloadCSV}
              className="w-full"
            >
              CSVダウンロード
            </Button>
          </div>
        )}

        {/* データ件数表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredData.length}名のスタッフデータが表示されています
          </p>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {filteredData.map((staff) => (
            <div key={staff.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {staff.staffName}
                  </h3>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${getPositionColor(
                      staff.position
                    )}`}
                  >
                    {staff.position}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                {staff.facilityName} / {staff.floor}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600 text-xs">タスク件数</p>
                  <p className="font-bold text-lg">{staff.taskCount}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600 text-xs">介入件数</p>
                  <p className="font-bold text-lg">{staff.interventionCount}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600 text-xs">おむつ交換</p>
                  <p className="font-bold text-lg">{staff.diaperChangeCount}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-gray-600 text-xs">文字数</p>
                  <p className="font-bold text-lg">
                    {staff.characterCount.toLocaleString()}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    スタッフ名
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    役職
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    施設
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    フロア
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    タスク件数
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    介入件数
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    おむつ交換件数
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    文字数
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {staff.staffName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getPositionColor(
                          staff.position
                        )}`}
                      >
                        {staff.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {staff.facilityName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {staff.floor}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {staff.taskCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {staff.interventionCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {staff.diaperChangeCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                      {staff.characterCount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">データがありません</p>
              </div>
            )}
          </div>
        </div>

        {/* 権限についての説明 */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            表示データについて
          </h4>
          <p className="text-sm text-blue-700">
            あなたの役職（{currentUserPosition}
            ）に基づき、同じ役職およびそれ以下の役職のスタッフデータが表示されています。
            上位役職のスタッフデータは表示されません。
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
