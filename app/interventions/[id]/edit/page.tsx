'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function InterventionEditPage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    facilityNumber: '101',
    recordDateTime: '2025-08-10 11:05',
    startDateTime: '2025-08-10 11:05',
    endDateTime: '2025-08-10 11:05',
    staffName: '田中太郎',
    patientName: '鈴木花子',
    interventionType: 'バイタルチェック',
    interventionContent: '血圧測定を実施。問題なし。',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    router.push('/interventions');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">介入実績編集</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* 居室番号 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                居室番号
              </label>
              <input
                type="text"
                value={formData.facilityNumber}
                onChange={(e) =>
                  setFormData({ ...formData, facilityNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 記録日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記録日時
              </label>
              <input
                type="datetime-local"
                value={formData.recordDateTime.replace(' ', 'T')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recordDateTime: e.target.value.replace('T', ' '),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 開始日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日時
              </label>
              <input
                type="datetime-local"
                value={formData.startDateTime.replace(' ', 'T')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDateTime: e.target.value.replace('T', ' '),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 終了日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日時
              </label>
              <input
                type="datetime-local"
                value={formData.endDateTime.replace(' ', 'T')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDateTime: e.target.value.replace('T', ' '),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* スタッフ名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スタッフ名
              </label>
              <input
                type="text"
                value={formData.staffName}
                onChange={(e) =>
                  setFormData({ ...formData, staffName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者名
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) =>
                  setFormData({ ...formData, patientName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 介入区分 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                介入区分
              </label>
              <select
                value={formData.interventionType}
                onChange={(e) =>
                  setFormData({ ...formData, interventionType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="バイタルチェック">バイタルチェック</option>
                <option value="服薬介助">服薬介助</option>
                <option value="食事介助">食事介助</option>
                <option value="排泄介助">排泄介助</option>
                <option value="入浴介助">入浴介助</option>
                <option value="リハビリ">リハビリ</option>
                <option value="見守り">見守り</option>
                <option value="相談・助言">相談・助言</option>
              </select>
            </div>

            {/* 介入内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                介入内容
              </label>
              <textarea
                value={formData.interventionContent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interventionContent: e.target.value,
                  })
                }
                rows={4}
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
              onClick={() => router.push('/interventions')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              更新
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
