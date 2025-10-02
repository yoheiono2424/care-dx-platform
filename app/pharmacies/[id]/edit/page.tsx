'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function PharmacyEditPage() {
  const router = useRouter();

  // フォームデータ（編集時は既存データで初期化）
  const [formData, setFormData] = useState({
    name: '福岡薬局',
    status: '利用中',
    pharmacist: '山田太郎',
    appSupport: '対応',
    phone: '000-0000-0000',
    fax: '00-0000-0000',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/pharmacies');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/pharmacies')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">薬局＞編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* 薬局名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                薬局名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用ステータス
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="利用中">利用中</option>
                <option value="休止中">休止中</option>
              </select>
            </div>

            {/* 薬剤師 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                薬剤師
              </label>
              <input
                type="text"
                value={formData.pharmacist}
                onChange={(e) =>
                  setFormData({ ...formData, pharmacist: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 服薬アプリ対応 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                服薬アプリ対応
              </label>
              <input
                type="text"
                value={formData.appSupport}
                onChange={(e) =>
                  setFormData({ ...formData, appSupport: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 電話番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* FAX番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAX番号
              </label>
              <input
                type="text"
                value={formData.fax}
                onChange={(e) =>
                  setFormData({ ...formData, fax: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push('/pharmacies')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              変更
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
