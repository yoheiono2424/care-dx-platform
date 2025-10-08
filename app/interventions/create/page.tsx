'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockDoctorData } from '@/data/mockDoctors';

export default function InterventionCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    facilityNumber: '',
    recordDateTime: '',
    startDateTime: '',
    endDateTime: '',
    staffName: '',
    patientName: '',
    interventionType: '',
    interventionContent: '',
    doctorName: '',
    doctorInstructions: '',
    notes: '',
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
          <h1 className="text-2xl font-bold text-gray-800">介入実績作成</h1>
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
                placeholder="101"
              />
            </div>

            {/* 記録日時 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                記録日時
              </label>
              <input
                type="datetime-local"
                value={formData.recordDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, recordDateTime: e.target.value })
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
                value={formData.startDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, startDateTime: e.target.value })
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
                value={formData.endDateTime}
                onChange={(e) =>
                  setFormData({ ...formData, endDateTime: e.target.value })
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
                placeholder="田中太郎"
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
                placeholder="鈴木花子"
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
                <option value="">選択してください</option>
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
                placeholder="実施内容を入力してください"
              />
            </div>

            {/* 医師 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                医師
              </label>
              <select
                value={formData.doctorName}
                onChange={(e) =>
                  setFormData({ ...formData, doctorName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">選択してください</option>
                {mockDoctorData
                  .filter((doctor) => doctor.status === '利用中')
                  .map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* 医師からの指示内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                医師からの指示内容
              </label>
              <textarea
                value={formData.doctorInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doctorInstructions: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="医師からの指示内容を入力してください"
              />
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="備考を入力してください"
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
              保存
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
