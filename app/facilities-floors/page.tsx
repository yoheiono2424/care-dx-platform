'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import {
  mockFacilityData,
  mockParentFloorData,
  mockChildFloorData,
} from '@/data/mockFacilities';
import {
  FacilityRecord,
  ParentFloorRecord,
  ChildFloorRecord,
} from '@/types/facility';

export default function FacilitiesFloorsPage() {
  const router = useRouter();

  // 展開状態の管理（施設ID と 親フロアID のセット）
  const [expandedFacilities, setExpandedFacilities] = useState<Set<number>>(
    new Set()
  );
  const [expandedParentFloors, setExpandedParentFloors] = useState<Set<number>>(
    new Set()
  );

  // 編集モーダルの状態管理
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    type: 'facility' | 'parentFloor' | 'childFloor';
    data: FacilityRecord | ParentFloorRecord | ChildFloorRecord;
  } | null>(null);

  // 施設の展開/折りたたみ切り替え
  const toggleFacility = (facilityId: number) => {
    const newExpanded = new Set(expandedFacilities);
    if (newExpanded.has(facilityId)) {
      newExpanded.delete(facilityId);
    } else {
      newExpanded.add(facilityId);
    }
    setExpandedFacilities(newExpanded);
  };

  // 親フロアの展開/折りたたみ切り替え
  const toggleParentFloor = (parentFloorId: number) => {
    const newExpanded = new Set(expandedParentFloors);
    if (newExpanded.has(parentFloorId)) {
      newExpanded.delete(parentFloorId);
    } else {
      newExpanded.add(parentFloorId);
    }
    setExpandedParentFloors(newExpanded);
  };

  // 編集ボタンクリック
  const handleEdit = (
    type: 'facility' | 'parentFloor' | 'childFloor',
    data: FacilityRecord | ParentFloorRecord | ChildFloorRecord
  ) => {
    setEditTarget({ type, data });
    setEditModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setEditModalOpen(false);
    setEditTarget(null);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">施設・フロア管理</h1>
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push('/facilities-floors/create')}
          >
            新規作成
          </Button>
        </div>

        {/* ツリー表示 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {/* PC用テーブル表示 */}
            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    階層構造
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種別
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockFacilityData.map((facility) => {
                  const isExpanded = expandedFacilities.has(facility.id);
                  const parentFloors = mockParentFloorData.filter(
                    (pf) => pf.facilityId === facility.id
                  );

                  return (
                    <>
                      {/* 施設レベル */}
                      <tr
                        key={`facility-${facility.id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {parentFloors.length > 0 && (
                              <button
                                onClick={() => toggleFacility(facility.id)}
                                className="mr-2 text-gray-400 hover:text-gray-600"
                              >
                                {isExpanded ? '▼' : '▶'}
                              </button>
                            )}
                            <span className="font-bold text-gray-900">
                              {facility.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              (稼働日: {facility.openDate})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          施設
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              facility.status === '利用中'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {facility.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {facility.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit('facility', facility)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            編集
                          </button>
                        </td>
                      </tr>

                      {/* 親フロアレベル */}
                      {isExpanded &&
                        parentFloors.map((parentFloor) => {
                          const isParentExpanded = expandedParentFloors.has(
                            parentFloor.id
                          );
                          const childFloors = mockChildFloorData.filter(
                            (cf) => cf.parentFloorId === parentFloor.id
                          );

                          return (
                            <>
                              <tr
                                key={`parent-${parentFloor.id}`}
                                className="hover:bg-gray-50 bg-gray-50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center pl-8">
                                    {childFloors.length > 0 && (
                                      <button
                                        onClick={() =>
                                          toggleParentFloor(parentFloor.id)
                                        }
                                        className="mr-2 text-gray-400 hover:text-gray-600"
                                      >
                                        {isParentExpanded ? '▼' : '▶'}
                                      </button>
                                    )}
                                    <span className="text-gray-700 font-medium">
                                      {parentFloor.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {parentFloor.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      parentFloor.status === '利用中'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {parentFloor.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {parentFloor.createdAt}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() =>
                                      handleEdit('parentFloor', parentFloor)
                                    }
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    編集
                                  </button>
                                </td>
                              </tr>

                              {/* 子フロアレベル */}
                              {isParentExpanded &&
                                childFloors.map((childFloor) => (
                                  <tr
                                    key={`child-${childFloor.id}`}
                                    className="hover:bg-gray-50 bg-blue-50"
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center pl-16">
                                        <span className="text-gray-600">
                                          {childFloor.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {childFloor.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          childFloor.status === '利用中'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {childFloor.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {childFloor.createdAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <button
                                        onClick={() =>
                                          handleEdit('childFloor', childFloor)
                                        }
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        編集
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </>
                          );
                        })}
                    </>
                  );
                })}
              </tbody>
            </table>

            {/* スマホ用カード表示 */}
            <div className="md:hidden">
              {mockFacilityData.map((facility) => {
                const isExpanded = expandedFacilities.has(facility.id);
                const parentFloors = mockParentFloorData.filter(
                  (pf) => pf.facilityId === facility.id
                );

                return (
                  <div
                    key={`facility-card-${facility.id}`}
                    className="border-b border-gray-200"
                  >
                    {/* 施設カード */}
                    <div className="p-4 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {parentFloors.length > 0 && (
                              <button
                                onClick={() => toggleFacility(facility.id)}
                                className="mr-2 text-gray-400"
                              >
                                {isExpanded ? '▼' : '▶'}
                              </button>
                            )}
                            <span className="font-bold text-gray-900">
                              {facility.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">種別: 施設</p>
                          <p className="text-sm text-gray-600">
                            稼働日: {facility.openDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            ステータス:{' '}
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                facility.status === '利用中'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {facility.status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            作成日: {facility.createdAt}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleEdit('facility', facility)}
                        className="w-full"
                      >
                        編集
                      </Button>
                    </div>

                    {/* 親フロアカード */}
                    {isExpanded &&
                      parentFloors.map((parentFloor) => {
                        const isParentExpanded = expandedParentFloors.has(
                          parentFloor.id
                        );
                        const childFloors = mockChildFloorData.filter(
                          (cf) => cf.parentFloorId === parentFloor.id
                        );

                        return (
                          <div key={`parent-card-${parentFloor.id}`}>
                            <div className="p-4 bg-gray-50 ml-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    {childFloors.length > 0 && (
                                      <button
                                        onClick={() =>
                                          toggleParentFloor(parentFloor.id)
                                        }
                                        className="mr-2 text-gray-400"
                                      >
                                        {isParentExpanded ? '▼' : '▶'}
                                      </button>
                                    )}
                                    <span className="font-medium text-gray-700">
                                      {parentFloor.name}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    種別: {parentFloor.type}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    ステータス:{' '}
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        parentFloor.status === '利用中'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      {parentFloor.status}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    作成日: {parentFloor.createdAt}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  handleEdit('parentFloor', parentFloor)
                                }
                                className="w-full"
                              >
                                編集
                              </Button>
                            </div>

                            {/* 子フロアカード */}
                            {isParentExpanded &&
                              childFloors.map((childFloor) => (
                                <div
                                  key={`child-card-${childFloor.id}`}
                                  className="p-4 bg-blue-50 ml-8"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center mb-2">
                                        <span className="font-medium text-gray-600">
                                          {childFloor.name}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        種別: {childFloor.type}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        ステータス:{' '}
                                        <span
                                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            childFloor.status === '利用中'
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-gray-100 text-gray-800'
                                          }`}
                                        >
                                          {childFloor.status}
                                        </span>
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        作成日: {childFloor.createdAt}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      handleEdit('childFloor', childFloor)
                                    }
                                    className="w-full"
                                  >
                                    編集
                                  </Button>
                                </div>
                              ))}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 編集モーダル（簡易版） */}
        {editModalOpen && editTarget && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {editTarget.type === 'facility'
                    ? '施設編集'
                    : editTarget.type === 'parentFloor'
                      ? '親フロア編集'
                      : '子フロア編集'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  編集機能は実装予定です。現在は表示のみです。
                </p>
                <div className="bg-gray-50 p-4 rounded mb-4">
                  <pre className="text-xs">
                    {JSON.stringify(editTarget.data, null, 2)}
                  </pre>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
