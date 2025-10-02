'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockTaskData, TaskData } from '@/data/mockTasks';

export default function TasksPage() {
  const router = useRouter();
  const [data] = useState<TaskData[]>(mockTaskData);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleViewDetail = (id: number) => {
    router.push(`/tasks/${id}`);
  };

  const handleDownloadCSV = () => {
    const headers = [
      '利用者名',
      '性別',
      '年齢',
      '入院スコア',
      '未完了タスク数',
      '部屋番号',
    ];
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        [
          row.patientName,
          row.gender,
          row.age,
          row.admissionScore,
          row.incompleteTasks,
          row.roomNumber,
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
      `行動タスク_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 60) return 'text-orange-600 font-semibold';
    return 'text-gray-900';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">行動タスク管理</h1>
          {!isMobile && (
            <Button variant="primary" onClick={handleDownloadCSV}>
              CSVダウンロード
            </Button>
          )}
        </div>

        {/* PC表示: テーブル形式 */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部屋番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    利用者名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    性別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    年齢
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    入院スコア
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    未完了タスク
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetail(row.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.age}歳
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${getScoreColor(row.admissionScore)}`}
                    >
                      {row.admissionScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.incompleteTasks}件
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {data.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-lg shadow p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewDetail(row.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">部屋 {row.roomNumber}</p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {row.patientName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {row.gender} / {row.age}歳
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">入院スコア</p>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(row.admissionScore)}`}
                  >
                    {row.admissionScore}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">未完了タスク</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {row.incompleteTasks}件
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
