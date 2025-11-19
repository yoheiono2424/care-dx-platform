'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { mockVitalRecords, availableFloors } from '@/data/mockVitals';
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

export default function VitalOverviewTeamPage() {
  const router = useRouter();

  // タブ状態
  const [activeTab, setActiveTab] = useState<'list' | 'individual' | 'floor'>(
    'floor'
  );

  // フィルター状態
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedFloor, setSelectedFloor] = useState(availableFloors[0]);

  // グラフタブ状態
  const [activeVitalTab, setActiveVitalTab] =
    useState<VitalType>('bloodPressure');

  // タブ切り替え
  const handleTabChange = (tab: 'list' | 'individual' | 'floor') => {
    if (tab === 'list') {
      router.push('/vitals');
    } else if (tab === 'individual') {
      router.push('/vitals/overview/individual');
    }
    // フロアタブは何もしない（現在のページのまま）
  };

  // フィルタリングされたデータ（当日から5日前まで、選択フロアのみ）
  const filteredRecords = useMemo(() => {
    const selectedDateObj = new Date(selectedDate);
    const fiveDaysAgo = new Date(selectedDateObj);
    fiveDaysAgo.setDate(selectedDateObj.getDate() - 5);

    return mockVitalRecords
      .filter((record) => {
        const recordDate = new Date(record.registeredAt);
        return (
          record.floor === selectedFloor &&
          recordDate >= fiveDaysAgo &&
          recordDate <= selectedDateObj
        );
      })
      .sort(
        (a, b) =>
          new Date(a.registeredAt).getTime() -
          new Date(b.registeredAt).getTime()
      );
  }, [selectedDate, selectedFloor]);

  // 利用者ごとにグループ化
  const groupedByPatient = useMemo(() => {
    const groups: { [key: string]: typeof mockVitalRecords } = {};
    filteredRecords.forEach((record) => {
      if (!groups[record.patientName]) {
        groups[record.patientName] = [];
      }
      groups[record.patientName].push(record);
    });
    return groups;
  }, [filteredRecords]);

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

  // グラフデータ生成（各利用者の平均値）
  const getChartData = () => {
    const patientNames = Object.keys(groupedByPatient).sort();

    let data: number[] = [];
    let label = '';

    switch (activeVitalTab) {
      case 'bloodPressure':
        data = patientNames.map((name) => {
          const records = groupedByPatient[name];
          const avgHigh =
            records.reduce((sum, r) => {
              const [high] = r.bloodPressure.split('/');
              return sum + parseInt(high);
            }, 0) / records.length;
          return Math.round(avgHigh);
        });
        label = '血圧（最高）平均';
        break;
      case 'pulse':
        data = patientNames.map((name) => {
          const records = groupedByPatient[name];
          return Math.round(
            records.reduce((sum, r) => sum + r.pulse, 0) / records.length
          );
        });
        label = '脈拍（bpm）平均';
        break;
      case 'oxygenSaturation':
        data = patientNames.map((name) => {
          const records = groupedByPatient[name];
          return Math.round(
            records.reduce((sum, r) => sum + r.oxygenSaturation, 0) /
              records.length
          );
        });
        label = '酸素飽和度（%）平均';
        break;
      case 'temperature':
        data = patientNames.map((name) => {
          const records = groupedByPatient[name];
          return (
            Math.round(
              (records.reduce((sum, r) => sum + r.temperature, 0) /
                records.length) *
                10
            ) / 10
          );
        });
        label = '体温（°C）平均';
        break;
      case 'respiratoryRate':
        data = patientNames.map((name) => {
          const records = groupedByPatient[name];
          return Math.round(
            records.reduce((sum, r) => sum + r.respiratoryRate, 0) /
              records.length
          );
        });
        label = '呼吸数（回/分）平均';
        break;
    }

    return {
      labels: patientNames,
      datasets: [
        {
          label,
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          pointBackgroundColor: 'rgb(59, 130, 246)',
          pointBorderColor: 'rgb(59, 130, 246)',
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

  // 最新のレコードのみを取得（各利用者ごと）
  const latestRecordsByPatient = useMemo(() => {
    return Object.keys(groupedByPatient)
      .map((patientName) => {
        const records = groupedByPatient[patientName];
        return records[records.length - 1]; // 最新のレコード
      })
      .sort((a, b) => a.patientName.localeCompare(b.patientName, 'ja'));
  }, [groupedByPatient]);

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            バイタル管理 - フロアオーバービュー
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            フロア単位でバイタルデータの推移を確認します
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
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                個人
              </button>
              <button
                onClick={() => handleTabChange('floor')}
                className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm"
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

            {/* フロア検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                フロア
              </label>
              <select
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableFloors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
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
          {Object.keys(groupedByPatient).length > 0 ? (
            <div className="h-80">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              データがありません
            </div>
          )}
        </div>

        {/* データ詳細テーブル（最新データのみ） */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  利用者名
                </th>
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
              {latestRecordsByPatient.map((record) => {
                const alertCount = getAlertCount(record);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {record.patientName}
                    </td>
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

          {latestRecordsByPatient.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              データがありません
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
