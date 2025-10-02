'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function PatientEditPage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    id: '001',
    status: '健康',
    roomNumber: '101',
    floor: '1階',
    name: '山田太郎',
    nameKana: 'ヤマダタロウ',
    usageStatus: '利用中',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/patients');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/patients')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">利用者＞編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 状況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状況
              </label>
              <textarea
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 部屋番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部屋番号
              </label>
              <input
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* フロア */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フロア
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) =>
                  setFormData({ ...formData, floor: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 氏名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                氏名
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

            {/* 氏名（フリガナ） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                氏名（フリガナ）
              </label>
              <input
                type="text"
                value={formData.nameKana}
                onChange={(e) =>
                  setFormData({ ...formData, nameKana: e.target.value })
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
                value={formData.usageStatus}
                onChange={(e) =>
                  setFormData({ ...formData, usageStatus: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="利用中">利用中</option>
                <option value="休止中">休止中</option>
                <option value="退所">退所</option>
              </select>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push('/patients')}
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
