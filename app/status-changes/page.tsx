'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function StatusChangesPage() {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">状態変化管理</h1>
          <p className="text-sm text-gray-600 mt-1">
            状態変化に関する機能は現在準備中です
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            機能準備中
          </h2>
          <p className="text-gray-600">
            状態変化管理機能は現在要件を調整中です。
            <br />
            近日中に公開予定です。
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
