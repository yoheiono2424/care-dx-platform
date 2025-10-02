'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function FloorCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: '',
    facility: '',
    parentFloor: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/floors');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/floors')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">フロア＞作成</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* フロア名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フロア名
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

            {/* 種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                種別
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value=""></option>
                <option value="親フロア">親フロア</option>
                <option value="子フロア">子フロア</option>
              </select>
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

            {/* 所属する施設 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属する施設
              </label>
              <input
                type="text"
                value={formData.facility}
                onChange={(e) =>
                  setFormData({ ...formData, facility: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 所属するフロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属するフロア
              </label>
              <input
                type="text"
                value={formData.parentFloor}
                onChange={(e) =>
                  setFormData({ ...formData, parentFloor: e.target.value })
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
              onClick={() => router.push('/floors')}
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
