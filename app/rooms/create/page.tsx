'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockFacilityData } from '@/data/mockFacilities';

export default function RoomCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    facilityId: 0,
    status: '利用中',
  });

  // 部屋番号リスト（配列で管理）
  const [roomNumbers, setRoomNumbers] = useState<string[]>(['']);

  // 部屋番号を追加
  const handleAddRoom = () => {
    setRoomNumbers([...roomNumbers, '']);
  };

  // 部屋番号を削除
  const handleRemoveRoom = (index: number) => {
    if (roomNumbers.length > 1) {
      setRoomNumbers(roomNumbers.filter((_, i) => i !== index));
    }
  };

  // 部屋番号を変更
  const handleRoomNumberChange = (index: number, value: string) => {
    const newRoomNumbers = [...roomNumbers];
    newRoomNumbers[index] = value;
    setRoomNumbers(newRoomNumbers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (formData.facilityId === 0) {
      alert('施設を選択してください');
      return;
    }

    // 空でない部屋番号のみを抽出
    const validRoomNumbers = roomNumbers.filter((room) => room.trim() !== '');

    if (validRoomNumbers.length === 0) {
      alert('少なくとも1つの部屋番号を入力してください');
      return;
    }

    // 重複チェック
    const uniqueRoomNumbers = new Set(validRoomNumbers);
    if (uniqueRoomNumbers.size !== validRoomNumbers.length) {
      alert('部屋番号が重複しています');
      return;
    }

    // 保存処理（今後実装）
    console.log('保存データ:', {
      facilityId: formData.facilityId,
      status: formData.status,
      roomNumbers: validRoomNumbers,
    });

    router.push('/rooms');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/rooms')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">部屋番号作成</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* 施設 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                施設
              </label>
              <select
                value={formData.facilityId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    facilityId: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>施設を選択してください</option>
                {mockFacilityData.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
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
                <option value="利用中">利用中</option>
                <option value="休止中">休止中</option>
              </select>
            </div>

            {/* 部屋番号（動的追加） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部屋番号
              </label>
              <div className="space-y-3">
                {roomNumbers.map((roomNumber, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="部屋番号を入力"
                      value={roomNumber}
                      onChange={(e) =>
                        handleRoomNumberChange(index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {roomNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  + 部屋を追加
                </button>
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => router.push('/rooms')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary" fullWidth>
              一括作成
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
