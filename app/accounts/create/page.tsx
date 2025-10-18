'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import {
  mockFacilityData,
  mockParentFloorData,
  mockChildFloorData,
} from '@/data/mockFacilities';

export default function AccountCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    role: '',
    facilities: [] as number[], // 施設IDの配列
    floors: [] as number[], // フロアIDの配列（親フロア・子フロア両方を含む）
    emergencyContact: '',
    notes: '',
  });

  // 保有資格
  const [qualifications, setQualifications] = useState({
    careWorkerInitial: false,
    careWorkerPractical: false,
  });

  // 選択された施設に紐づくフロアを取得
  const availableFloors = useMemo(() => {
    if (formData.facilities.length === 0) {
      return { parentFloors: [], childFloors: [] };
    }

    const parentFloors = mockParentFloorData.filter((pf) =>
      formData.facilities.includes(pf.facilityId)
    );
    const childFloors = mockChildFloorData.filter((cf) =>
      formData.facilities.includes(cf.facilityId)
    );

    return { parentFloors, childFloors };
  }, [formData.facilities]);

  // 施設選択の切り替え
  const handleFacilityToggle = (facilityId: number) => {
    if (formData.facilities.includes(facilityId)) {
      // 施設の選択を解除する場合、その施設に紐づくフロアも解除
      const removedFacilityFloors = [
        ...mockParentFloorData
          .filter((pf) => pf.facilityId === facilityId)
          .map((pf) => pf.id),
        ...mockChildFloorData
          .filter((cf) => cf.facilityId === facilityId)
          .map((cf) => cf.id + 1000), // 子フロアIDは+1000
      ];

      setFormData({
        ...formData,
        facilities: formData.facilities.filter((id) => id !== facilityId),
        floors: formData.floors.filter(
          (floorId) => !removedFacilityFloors.includes(floorId)
        ),
      });
    } else {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityId],
      });
    }
  };

  // 親フロア選択の切り替え
  const handleParentFloorToggle = (floorId: number) => {
    if (formData.floors.includes(floorId)) {
      // 親フロアの選択を解除する場合、その子フロアも解除
      const childFloorIds = mockChildFloorData
        .filter((cf) => cf.parentFloorId === floorId)
        .map((cf) => cf.id + 1000);

      setFormData({
        ...formData,
        floors: formData.floors.filter(
          (id) => id !== floorId && !childFloorIds.includes(id)
        ),
      });
    } else {
      setFormData({
        ...formData,
        floors: [...formData.floors, floorId],
      });
    }
  };

  // 子フロア選択の切り替え
  const handleChildFloorToggle = (floorId: number) => {
    if (formData.floors.includes(floorId)) {
      setFormData({
        ...formData,
        floors: formData.floors.filter((id) => id !== floorId),
      });
    } else {
      setFormData({
        ...formData,
        floors: [...formData.floors, floorId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
    console.log('保存データ:', {
      ...formData,
      qualifications,
    });
    router.push('/accounts');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/accounts')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">スタッフ作成</h1>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="space-y-6">
            {/* スタッフ名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                スタッフ名
              </label>
              <input
                type="text"
                placeholder="スタッフ名"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                placeholder="メールアドレス"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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

            {/* 役職 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                役職
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value=""></option>
                <option value="スタッフ">スタッフ</option>
                <option value="管理者">管理者</option>
                <option value="看護師">看護師</option>
                <option value="介護士">介護士</option>
              </select>
            </div>

            {/* 施設 (複数選択) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                施設
              </label>
              <div className="space-y-2">
                {mockFacilityData.map((facility) => (
                  <label key={facility.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility.id)}
                      onChange={() => handleFacilityToggle(facility.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      {facility.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* フロア (階層的選択) */}
            {formData.facilities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  フロア
                </label>
                <div className="space-y-3">
                  {availableFloors.parentFloors.map((parentFloor) => {
                    // この親フロアに紐づく子フロアを取得
                    const childFloors = availableFloors.childFloors.filter(
                      (cf) => cf.parentFloorId === parentFloor.id
                    );

                    return (
                      <div
                        key={parentFloor.id}
                        className="border-l-2 border-gray-300 pl-4"
                      >
                        {/* 親フロア */}
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.floors.includes(parentFloor.id)}
                            onChange={() =>
                              handleParentFloorToggle(parentFloor.id)
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 font-medium">
                            {parentFloor.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            (
                            {
                              mockFacilityData.find(
                                (f) => f.id === parentFloor.facilityId
                              )?.name
                            }
                            )
                          </span>
                        </label>

                        {/* 子フロア */}
                        {childFloors.length > 0 && (
                          <div className="ml-6 mt-2 space-y-2">
                            {childFloors.map((childFloor) => {
                              // 親フロアが選択されているかチェック
                              const isParentSelected = formData.floors.includes(
                                childFloor.parentFloorId
                              );
                              return (
                                <label
                                  key={childFloor.id}
                                  className={`flex items-center ${
                                    !isParentSelected ? 'opacity-50' : ''
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={formData.floors.includes(
                                      childFloor.id + 1000
                                    )}
                                    onChange={() =>
                                      handleChildFloorToggle(
                                        childFloor.id + 1000
                                      )
                                    }
                                    disabled={!isParentSelected}
                                    className="mr-2"
                                  />
                                  <span
                                    className={`text-sm ${
                                      !isParentSelected
                                        ? 'text-gray-400'
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    {childFloor.name}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 保有資格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                保有資格
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={qualifications.careWorkerInitial}
                    onChange={(e) =>
                      setQualifications({
                        ...qualifications,
                        careWorkerInitial: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    介護職員初任者研修
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={qualifications.careWorkerPractical}
                    onChange={(e) =>
                      setQualifications({
                        ...qualifications,
                        careWorkerPractical: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    介護福祉士実務者研修
                  </span>
                </label>
              </div>
            </div>

            {/* 緊急連絡先 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                緊急連絡先
              </label>
              <input
                type="text"
                placeholder="連絡先"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                placeholder="備考"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
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
              onClick={() => router.push('/accounts')}
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
