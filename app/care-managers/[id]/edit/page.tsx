'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function CareManagerEditPage() {
  const router = useRouter();

  // フォームデータ（編集時は既存データで初期化）
  const [formData, setFormData] = useState({
    name: '山田太郎',
    status: '利用中',
    office: '熊本事業所',
    officeNumber: '12345678',
    personalPhone: '090-1234-5678',
    officePhone: '00-0000-0000',
    fax: '00-0000-0000',
    emergencyContact: '00-0000-0000',
    address: '熊本県〜〜〜〜',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/care-managers');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/care-managers')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">ケアマネ編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* ケアマネ名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ケアマネ名
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

            {/* 事業所名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事業所名
              </label>
              <input
                type="text"
                value={formData.office}
                onChange={(e) =>
                  setFormData({ ...formData, office: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 事業所番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事業所番号
              </label>
              <input
                type="text"
                value={formData.officeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, officeNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 個人電話番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                個人電話番号
              </label>
              <input
                type="text"
                value={formData.personalPhone}
                onChange={(e) =>
                  setFormData({ ...formData, personalPhone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 事業所電話番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事業所電話番号
              </label>
              <input
                type="text"
                value={formData.officePhone}
                onChange={(e) =>
                  setFormData({ ...formData, officePhone: e.target.value })
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

            {/* 緊急連絡先 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                緊急連絡先
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 所在地 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在地
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
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
              onClick={() => router.push('/care-managers')}
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
