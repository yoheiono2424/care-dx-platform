'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { mockVitalRecords, availablePatientNames } from '@/data/mockVitals';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type VitalType =
  | 'bloodPressure'
  | 'pulse'
  | 'oxygenSaturation'
  | 'temperature'
  | 'respiratoryRate';

export default function VitalOverviewIndividualPage() {
  const router = useRouter();

  // タブ状態
  const [activeTab, setActiveTab] = useState<'list' | 'individual' | 'floor'>(
    'individual'
  );

  // フィルター状態
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedPatient, setSelectedPatient] = useState(
    availablePatientNames[0]
  );

  // グラフタブ状態
  const [activeVitalTab, setActiveVitalTab] =
    useState<VitalType>('bloodPressure');

  // タブ切り替え
  const handleTabChange = (tab: 'list' | 'individual' | 'floor') => {
    if (tab === 'list') {
      router.push('/vitals');
    } else if (tab === 'floor') {
      router.push('/vitals/overview/team');
    }
    // 個人タブは何もしない（現在のページのまま）
  };

  // フィルタリングされたデータ（当日から5日前まで）
  const filteredRecords = useMemo(() => {
    const selectedDateObj = new Date(selectedDate);
    const fiveDaysAgo = new Date(selectedDateObj);
    fiveDaysAgo.setDate(selectedDateObj.getDate() - 5);

    return mockVitalRecords
      .filter((record) => {
        const recordDate = new Date(record.registeredAt);
        return (
          record.patientName === selectedPatient &&
          recordDate >= fiveDaysAgo &&
          recordDate <= selectedDateObj
        );
      })
      .sort(
        (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime()
      );
  }, [selectedDate, selectedPatient]);

  // アラート判定
  const getAlertCount = (record: (typeof mockVitalRecords)[0]) => {
    let count = 0;
    if (record.pulse >= 100) count++;
    if (record.oxygenSaturation >= 92) count++;
    if (record.temperature >= 37.5) count++;
    if (record.respiratoryRate >= 24) count++;
    if (record.ecg === '異常') count++;
    if (record.cough !== 'なし') count++;
    return count;
  };

  // グラフデータ生成
  const getChartData = () => {
    const labels = filteredRecords.map((r) =>
      new Date(r.registeredAt).toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    let data: number[] = [];
    let label = '';
    let alertThreshold: number | null = null;

    switch (activeVitalTab) {
      case 'bloodPressure':
        data = filteredRecords.map((r) => {
          const [high] = r.bloodPressure.split('/');
          return parseInt(high);
        });
        label = '血圧（最高）';
        break;
      case 'pulse':
        data = filteredRecords.map((r) => r.pulse);
        label = '脈拍（bpm）';
        alertThreshold = 100;
        break;
      case 'oxygenSaturation':
        data = filteredRecords.map((r) => r.oxygenSaturation);
        label = '酸素飽和度（%）';
        alertThreshold = 92;
        break;
      case 'temperature':
        data = filteredRecords.map((r) => r.temperature);
        label = '体温（°C）';
        alertThreshold = 37.5;
        break;
      case 'respiratoryRate':
        data = filteredRecords.map((r) => r.respiratoryRate);
        label = '呼吸数（回/分）';
        alertThreshold = 24;
        break;
    }

    return {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          pointBackgroundColor: data.map((value, idx) => {
            const record = filteredRecords[idx];
            const alertCount = getAlertCount(record);
            return alertCount >= 2
              ? 'rgb(239, 68, 68)'
              : alertCount === 1
                ? 'rgb(234, 179, 8)'
                : 'rgb(59, 130, 246)';
          }),
          pointBorderColor: data.map((value, idx) => {
            const record = filteredRecords[idx];
            const alertCount = getAlertCount(record);
            return alertCount >= 2
              ? 'rgb(239, 68, 68)'
              : alertCount === 1
                ? 'rgb(234, 179, 8)'
                : 'rgb(59, 130, 246)';
          }),
          pointRadius: 6,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            バイタル管理 - 個人オーバービュー
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            個人のバイタルデータの推移を確認します
          </p>
        </div>

        {/* タブ */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('list')}
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                一覧
              </button>
              <button
                onClick={() => handleTabChange('individual')}
                className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
              >
                個人
              </button>
              <button
                onClick={() => handleTabChange('floor')}
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                フロア
              </button>
            </nav>
          </div>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 日付検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                日付
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                ※選択日から5日前までのデータを表示
              </p>
            </div>

            {/* 利用者検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                利用者名
              </label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availablePatientNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* グラフタイトル */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            アカウント指標の推移
          </h2>

          {/* グラフ切替タブ */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-4 overflow-x-auto">
                <button
                  onClick={() => setActiveVitalTab('bloodPressure')}
                  className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeVitalTab === 'bloodPressure'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  血圧
                </button>
                <button
                  onClick={() => setActiveVitalTab('pulse')}
                  className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeVitalTab === 'pulse'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  脈拍
                </button>
                <button
                  onClick={() => setActiveVitalTab('oxygenSaturation')}
                  className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeVitalTab === 'oxygenSaturation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  酸素飽和度
                </button>
                <button
                  onClick={() => setActiveVitalTab('temperature')}
                  className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeVitalTab === 'temperature'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  体温
                </button>
                <button
                  onClick={() => setActiveVitalTab('respiratoryRate')}
                  className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeVitalTab === 'respiratoryRate'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  呼吸数
                </button>
              </nav>
            </div>
          </div>

          {/* グラフ表示 */}
          {filteredRecords.length > 0 ? (
            <div className="h-80">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              データがありません
            </div>
          )}
        </div>

        {/* データ詳細テーブル */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日付
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アラート
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  血圧
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  脈拍
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  酸素飽和度
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  体温
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  呼吸数
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  心電図
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  咳嗽
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const alertCount = getAlertCount(record);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.registeredAt).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {alertCount >= 2 ? (
                        <span
                          className="inline-block w-6 h-6 bg-red-500 rounded-full"
                          title="アラート2つ以上"
                        ></span>
                      ) : alertCount === 1 ? (
                        <span
                          className="inline-block w-6 h-6 bg-yellow-500 rounded-full"
                          title="アラート1つ"
                        ></span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.pulse >= 100 ||
                        record.oxygenSaturation >= 92 ||
                        record.temperature >= 37.5 ||
                        record.respiratoryRate >= 24
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.bloodPressure}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.pulse >= 100
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.pulse}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.oxygenSaturation >= 92
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.oxygenSaturation}%
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.temperature >= 37.5
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.temperature}°C
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.respiratoryRate >= 24
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.respiratoryRate}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.ecg === '異常'
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.ecg}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                        record.cough !== 'なし'
                          ? 'text-red-600 font-bold'
                          : 'text-gray-900'
                      }`}
                    >
                      {record.cough}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              データがありません
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
