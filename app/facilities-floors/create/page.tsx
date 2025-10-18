'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

// 親フロアの入力データ型
interface ParentFloorInput {
  id: string; // 一時ID（フロント側での管理用）
  name: string;
  status: string;
}

// 子フロアの入力データ型
interface ChildFloorInput {
  id: string; // 一時ID（フロント側での管理用）
  parentFloorId: string; // 親フロアの一時ID
  name: string;
  status: string;
}

export default function FacilitiesFloorsCreatePage() {
  const router = useRouter();

  // 施設情報
  const [facilityName, setFacilityName] = useState('');
  const [facilityOpenDate, setFacilityOpenDate] = useState('');
  const [facilityStatus, setFacilityStatus] = useState('利用中');

  // 親フロア情報
  const [parentFloors, setParentFloors] = useState<ParentFloorInput[]>([]);

  // 子フロア情報
  const [childFloors, setChildFloors] = useState<ChildFloorInput[]>([]);

  // バリデーションエラー
  const [errors, setErrors] = useState<{
    facilityName?: string;
    facilityOpenDate?: string;
  }>({});

  // 親フロアを追加
  const addParentFloor = () => {
    const newId = `parent-${Date.now()}`;
    setParentFloors([
      ...parentFloors,
      {
        id: newId,
        name: '',
        status: '利用中',
      },
    ]);
  };

  // 親フロアを削除
  const removeParentFloor = (id: string) => {
    setParentFloors(parentFloors.filter((pf) => pf.id !== id));
    // 関連する子フロアも削除
    setChildFloors(childFloors.filter((cf) => cf.parentFloorId !== id));
  };

  // 親フロアを更新
  const updateParentFloor = (
    id: string,
    field: keyof ParentFloorInput,
    value: string
  ) => {
    setParentFloors(
      parentFloors.map((pf) => (pf.id === id ? { ...pf, [field]: value } : pf))
    );
  };

  // 子フロアを追加
  const addChildFloor = () => {
    const newId = `child-${Date.now()}`;
    setChildFloors([
      ...childFloors,
      {
        id: newId,
        parentFloorId: parentFloors.length > 0 ? parentFloors[0].id : '',
        name: '',
        status: '利用中',
      },
    ]);
  };

  // 子フロアを削除
  const removeChildFloor = (id: string) => {
    setChildFloors(childFloors.filter((cf) => cf.id !== id));
  };

  // 子フロアを更新
  const updateChildFloor = (
    id: string,
    field: keyof ChildFloorInput,
    value: string
  ) => {
    setChildFloors(
      childFloors.map((cf) => (cf.id === id ? { ...cf, [field]: value } : cf))
    );
  };

  // バリデーション
  const validate = (): boolean => {
    const newErrors: { facilityName?: string; facilityOpenDate?: string } = {};

    if (!facilityName.trim()) {
      newErrors.facilityName = '施設名は必須です';
    }

    if (!facilityOpenDate) {
      newErrors.facilityOpenDate = '稼働日は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 登録処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // TODO: 実際のDB登録処理
    // ここでは登録成功とみなして一覧画面へ遷移
    console.log('施設情報:', {
      name: facilityName,
      openDate: facilityOpenDate,
      status: facilityStatus,
    });
    console.log('親フロア:', parentFloors);
    console.log('子フロア:', childFloors);

    alert('登録しました（ダミー処理）');
    router.push('/facilities-floors');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.push('/facilities-floors')}
              className="text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              施設・フロア新規作成
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            施設、親フロア、子フロアを1画面で同時に作成できます
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* セクション1: 施設情報 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              施設情報（必須）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  施設名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.facilityName ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="例: ケアホーム熊本"
                />
                {errors.facilityName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.facilityName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  稼働日 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={facilityOpenDate}
                  onChange={(e) => setFacilityOpenDate(e.target.value)}
                  className={`w-full px-3 py-2 border ${
                    errors.facilityOpenDate
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.facilityOpenDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.facilityOpenDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  利用ステータス
                </label>
                <select
                  value={facilityStatus}
                  onChange={(e) => setFacilityStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="利用中">利用中</option>
                  <option value="休止中">休止中</option>
                </select>
              </div>
            </div>
          </div>

          {/* セクション2: 親フロア情報 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
              <h2 className="text-xl font-bold text-gray-800">
                親フロア情報（任意）
              </h2>
              <Button type="button" variant="outline" onClick={addParentFloor}>
                + 親フロアを追加
              </Button>
            </div>

            {parentFloors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                親フロアは登録されていません
              </p>
            ) : (
              <div className="space-y-4">
                {parentFloors.map((parentFloor, index) => (
                  <div
                    key={parentFloor.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">
                        親フロア {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeParentFloor(parentFloor.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          フロア名
                        </label>
                        <input
                          type="text"
                          value={parentFloor.name}
                          onChange={(e) =>
                            updateParentFloor(
                              parentFloor.id,
                              'name',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例: 1階、2階、3階"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          利用ステータス
                        </label>
                        <select
                          value={parentFloor.status}
                          onChange={(e) =>
                            updateParentFloor(
                              parentFloor.id,
                              'status',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="利用中">利用中</option>
                          <option value="休止中">休止中</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* セクション3: 子フロア情報 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
              <h2 className="text-xl font-bold text-gray-800">
                子フロア情報（任意）
              </h2>
              <Button
                type="button"
                variant="outline"
                onClick={addChildFloor}
                disabled={parentFloors.length === 0}
              >
                + 子フロアを追加
              </Button>
            </div>

            {parentFloors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                子フロアを追加するには、先に親フロアを追加してください
              </p>
            ) : childFloors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                子フロアは登録されていません
              </p>
            ) : (
              <div className="space-y-4">
                {childFloors.map((childFloor, index) => (
                  <div
                    key={childFloor.id}
                    className="border border-gray-200 rounded-lg p-4 bg-blue-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-700">
                        子フロア {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeChildFloor(childFloor.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          所属する親フロア
                        </label>
                        <select
                          value={childFloor.parentFloorId}
                          onChange={(e) =>
                            updateChildFloor(
                              childFloor.id,
                              'parentFloorId',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {parentFloors.map((pf) => (
                            <option key={pf.id} value={pf.id}>
                              {pf.name || `親フロア ${pf.id}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          フロア名
                        </label>
                        <input
                          type="text"
                          value={childFloor.name}
                          onChange={(e) =>
                            updateChildFloor(
                              childFloor.id,
                              'name',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="例: 1階A、1階B"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          利用ステータス
                        </label>
                        <select
                          value={childFloor.status}
                          onChange={(e) =>
                            updateChildFloor(
                              childFloor.id,
                              'status',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="利用中">利用中</option>
                          <option value="休止中">休止中</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 登録ボタン */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/facilities-floors')}
            >
              キャンセル
            </Button>
            <Button type="submit" variant="primary">
              登録
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
