'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* カード1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              本日のタスク
            </h3>
            <p className="text-3xl font-bold text-primary">12件</p>
            <p className="text-sm text-gray-600 mt-2">未完了タスク</p>
          </div>

          {/* カード2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              入院リスク
            </h3>
            <p className="text-3xl font-bold text-danger">3名</p>
            <p className="text-sm text-gray-600 mt-2">要注意患者</p>
          </div>

          {/* カード3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              本日の記録
            </h3>
            <p className="text-3xl font-bold text-accent">25件</p>
            <p className="text-sm text-gray-600 mt-2">記録済み</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            最近のアクティビティ
          </h2>
          <p className="text-gray-600">ダミーコンテンツ - 開発中</p>
        </div>
      </div>
    </MainLayout>
  );
}
