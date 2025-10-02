'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function SettingsPage() {
  // スタッフ情報
  const [staffName, setStaffName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // パスワード変更
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleStaffUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // スタッフ情報更新処理（今後実装）
    alert('スタッフ情報を更新しました');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // パスワード変更処理（今後実装）
    if (newPassword !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    alert('パスワードを変更しました');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 max-w-4xl">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">設定</h1>
        </div>

        {/* スタッフ情報セクション */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            スタッフ情報
          </h2>
          <form onSubmit={handleStaffUpdate}>
            <div className="space-y-5">
              {/* ID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">ID</label>
                <div className="md:col-span-2 text-gray-900">0000001</div>
              </div>

              {/* スタッフ名 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  スタッフ名
                </label>
                <input
                  type="text"
                  placeholder="スタッフ名"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* メールアドレス */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  メールアドレス
                </label>
                <div className="md:col-span-2 text-gray-900">
                  test@example.com
                </div>
              </div>

              {/* 緊急連絡先 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  緊急連絡先
                </label>
                <input
                  type="text"
                  placeholder="連絡先"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 更新ボタン */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full md:w-auto px-8"
                >
                  更新
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* パスワード変更セクション */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            パスワード変更
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div className="space-y-5">
              {/* 現在のパスワード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  現在のパスワード
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 変更後のパスワード */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  変更後のパスワード
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 変更後のパスワード（確認用） */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <label className="text-sm font-medium text-gray-700">
                  変更後のパスワード（確認用）
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 変更ボタン */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full md:w-auto px-8"
                >
                  変更
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
