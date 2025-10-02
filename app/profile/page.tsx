'use client';

import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function ProfilePage() {
  const router = useRouter();

  // ダミーのアカウント情報
  const accountInfo = {
    staffId: 'ST-001',
    name: '山田太郎',
    email: 'yamada.taro@care-dx.com',
    role: '管理者',
    facility: 'ケアDX施設A',
    floor: '2階',
    emergencyContact: '090-1234-5678',
    qualifications: ['介護福祉士', '介護支援専門員'],
    createdAt: '2024-01-15',
    status: '利用中',
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">アカウント情報</h1>
          <p className="text-sm text-gray-600 mt-1">
            ログイン中のアカウント情報を表示しています
          </p>
        </div>

        {/* PC表示: 3カラムグリッド */}
        <div className="hidden md:block bg-white rounded-lg shadow">
          <div className="p-6 max-w-4xl">
            {/* 基本情報セクション */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-200 mb-6">
                基本情報
              </h2>

              <div className="space-y-5">
                {/* スタッフID */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    スタッフID
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">
                      {accountInfo.staffId}
                    </p>
                  </div>
                </div>

                {/* スタッフ名 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    スタッフ名
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">{accountInfo.name}</p>
                  </div>
                </div>

                {/* メールアドレス */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    メールアドレス
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">{accountInfo.email}</p>
                  </div>
                </div>

                {/* 役職 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    役職
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">{accountInfo.role}</p>
                  </div>
                </div>

                {/* 施設 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    施設
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">
                      {accountInfo.facility}
                    </p>
                  </div>
                </div>

                {/* フロア */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    フロア
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">{accountInfo.floor}</p>
                  </div>
                </div>

                {/* 緊急連絡先 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    緊急連絡先
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">
                      {accountInfo.emergencyContact}
                    </p>
                  </div>
                </div>

                {/* 保有資格 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    保有資格
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">
                      {accountInfo.qualifications.join(', ')}
                    </p>
                  </div>
                </div>

                {/* アカウント作成日 */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    アカウント作成日
                  </label>
                  <div className="col-span-2 pt-2">
                    <p className="text-sm text-gray-900">
                      {accountInfo.createdAt}
                    </p>
                  </div>
                </div>

                {/* 利用ステータス */}
                <div className="grid grid-cols-3 gap-4">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    利用ステータス
                  </label>
                  <div className="col-span-2 pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {accountInfo.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => router.push('/settings')}
              >
                設定を変更
              </Button>
              <Button variant="secondary" onClick={() => router.back()}>
                戻る
              </Button>
            </div>
          </div>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg shadow p-4">
            {/* プロフィールヘッダー */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-medium">山</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {accountInfo.name}
                </h2>
                <p className="text-sm text-gray-600">{accountInfo.role}</p>
              </div>
            </div>

            {/* 基本情報 */}
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">スタッフID</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.staffId}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">メールアドレス</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">施設</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.facility}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">フロア</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.floor}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">緊急連絡先</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.emergencyContact}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">保有資格</p>
                <div className="flex flex-wrap gap-2">
                  {accountInfo.qualifications.map((qual) => (
                    <span
                      key={qual}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {qual}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">アカウント作成日</p>
                <p className="text-sm font-medium text-gray-900">
                  {accountInfo.createdAt}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">利用ステータス</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {accountInfo.status}
                </span>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                fullWidth
                onClick={() => router.push('/settings')}
              >
                設定を変更
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => router.back()}
              >
                戻る
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
