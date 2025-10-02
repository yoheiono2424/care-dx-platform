'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function FacilityCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    openDate: '',
    status: '',
    floors: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/facilities');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/facilities')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">施設＞作成</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* 施設名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                施設名
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

            {/* 稼働日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                稼働日
              </label>
              <input
                type="date"
                value={formData.openDate}
                onChange={(e) =>
                  setFormData({ ...formData, openDate: e.target.value })
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
                <option value=""></option>
                <option value="利用中">利用中</option>
                <option value="休止中">休止中</option>
              </select>
            </div>

            {/* フロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フロア
              </label>
              <input
                type="text"
                value={formData.floors}
                onChange={(e) =>
                  setFormData({ ...formData, floors: e.target.value })
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
              onClick={() => router.push('/facilities')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              作成
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
