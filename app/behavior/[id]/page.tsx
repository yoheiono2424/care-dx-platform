'use client';

import { useState, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockBehaviorData } from '@/data/mockBehaviorData';

export default function BehaviorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 利用者名でフィルタリング（IDは利用者のインデックスとして使用）
  const patientRecords = useMemo(() => {
    const patientNames = [
      '田中 太郎',
      '佐藤 花子',
      '鈴木 一郎',
      '高橋 美咲',
      '渡辺 健太',
      '伊藤 由美',
      '山本 博',
      '中村 さくら',
      '小林 誠',
      '加藤 愛子',
    ];
    const patientIndex = parseInt(patientId) - 1;
    const patientName = patientNames[patientIndex] || patientNames[0];

    return mockBehaviorData.filter(
      (record) => record.patientName === patientName
    );
  }, [patientId]);

  // 期間でフィルタリング
  const filteredRecords = useMemo(() => {
    return patientRecords.filter((record) => {
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
      return true;
    });
  }, [patientRecords, startDate, endDate]);

  // 平均値を計算
  const averages = useMemo(() => {
    if (filteredRecords.length === 0) return null;

    const parseTime = (timeStr: string): number => {
      const match = timeStr.match(/(\d+)時間(\d+)分/);
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return 0;
    };

    const formatTime = (minutes: number): string => {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}時間${mins}分`;
    };

    const totalBedTime = filteredRecords.reduce(
      (sum, r) => sum + parseTime(r.bedTimeAvg),
      0
    );
    const totalOutsideTime = filteredRecords.reduce(
      (sum, r) => sum + parseTime(r.outsideRoomTimeAvg),
      0
    );
    const totalStandUpBed = filteredRecords.reduce(
      (sum, r) => sum + r.standUpBedAvg,
      0
    );
    const totalStandUpOutside = filteredRecords.reduce(
      (sum, r) => sum + r.standUpOutsideAvg,
      0
    );
    const totalBuildingExit = filteredRecords.reduce(
      (sum, r) => sum + r.buildingExitCountAvg,
      0
    );

    const count = filteredRecords.length;
    return {
      bedTimeAvg: formatTime(totalBedTime / count),
      outsideRoomTimeAvg: formatTime(totalOutsideTime / count),
      standUpBedAvg: (totalStandUpBed / count).toFixed(1),
      standUpOutsideAvg: (totalStandUpOutside / count).toFixed(1),
      standUpTotal: ((totalStandUpBed + totalStandUpOutside) / count).toFixed(
        1
      ),
      buildingExitCountAvg: (totalBuildingExit / count).toFixed(1),
    };
  }, [filteredRecords]);

  const patientInfo = patientRecords[0];

  if (!patientInfo) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">利用者が見つかりません</p>
            <Button
              variant="primary"
              onClick={() => router.push('/behavior')}
              className="mt-4"
            >
              一覧に戻る
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/behavior')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-800">行動データ詳細</h1>
          <p className="text-sm text-gray-600 mt-1">
            利用者の行動データを詳しく確認できます
          </p>
        </div>

        {/* 利用者情報カード */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            利用者情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">利用者名</p>
              <p className="text-lg font-semibold text-gray-900">
                {patientInfo.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">居室番号</p>
              <p className="text-lg font-semibold text-gray-900">
                {patientInfo.roomName}
              </p>
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* 期間平均サマリー */}
        {averages && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              期間平均（{filteredRecords.length}日間）
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">臥床時間</p>
                <p className="text-lg font-bold text-blue-600">
                  {averages.bedTimeAvg}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  立ち上がり(ベッド)
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {averages.standUpBedAvg}回
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  立ち上がり(ベッド外)
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {averages.standUpOutsideAvg}回
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">
                  立ち上がり(合計)
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {averages.standUpTotal}回
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">居室外滞在時間</p>
                <p className="text-lg font-bold text-green-600">
                  {averages.outsideRoomTimeAvg}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">職員の来室回数</p>
                <p className="text-lg font-bold text-green-600">
                  {averages.buildingExitCountAvg}回
                </p>
              </div>
            </div>
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
              <div className="mb-3 pb-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-blue-600">
                  {record.date}
                </p>
              </div>

              {/* 臥床・基本動作 */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 bg-blue-50 px-3 py-2 rounded">
                  臥床・基本動作（1日あたり）
                </h4>
                <div className="space-y-2 px-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">臥床時間</span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.bedTimeAvg}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      立ち上がり(ベッド)
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.standUpBedAvg}回
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">
                      立ち上がり(ベッド外)
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.standUpOutsideAvg}回
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">合計</span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.standUpTotal}回
                    </span>
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
                      居室外滞在時間
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.outsideRoomTimeAvg}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">
                      職員の来室回数
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {record.buildingExitCountAvg}回
                    </span>
                  </div>
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
          <table className="min-w-full divide-y divide-gray-200 border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th
                  rowSpan={2}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b-2 border-gray-200"
                >
                  日付
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  臥床時間
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  立ち上がり
                  <br />
                  (ベッド)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  立ち上がり
                  <br />
                  (ベッド外)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  合計
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-r border-b-2 border-gray-200 whitespace-nowrap">
                  居室外
                  <br />
                  滞在時間
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-b-2 border-gray-200 whitespace-nowrap">
                  職員の
                  <br />
                  来室回数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record, idx) => (
                <tr
                  key={record.id}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-medium text-blue-600 border-r border-gray-200">
                    {record.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.bedTimeAvg}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.standUpBedAvg}回
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.standUpOutsideAvg}回
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.standUpTotal}回
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900 border-r border-gray-200">
                    {record.outsideRoomTimeAvg}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">
                    {record.buildingExitCountAvg}回
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
