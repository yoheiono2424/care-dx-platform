'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockPatientData } from '@/data/mockPatients';

interface MealInput {
  mealContentPattern: string;
  preMealAmount: number;
  mealRemainder: number;
  mainDishIntake: number;
  sideDishIntake: number;
  mealIntakeRatio: number;
  waterAmount: number;
  waterIntake: number;
}

export default function MealCreatePage() {
  const router = useRouter();
  const [showPatientSelectModal, setShowPatientSelectModal] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState<number[]>([]);
  const [mealInputs, setMealInputs] = useState<Record<number, MealInput>>({});

  // 選択された利用者データを取得
  const selectedPatients = mockPatientData.filter((patient) =>
    selectedPatientIds.includes(patient.id)
  );

  // 利用者選択のトグル
  const togglePatientSelection = (patientId: number) => {
    if (selectedPatientIds.includes(patientId)) {
      setSelectedPatientIds((prev) => prev.filter((id) => id !== patientId));
      // 選択解除時に入力データも削除
      setMealInputs((prev) => {
        const newInputs = { ...prev };
        delete newInputs[patientId];
        return newInputs;
      });
    } else {
      setSelectedPatientIds((prev) => [...prev, patientId]);
      // 初期値を設定
      setMealInputs((prev) => ({
        ...prev,
        [patientId]: {
          mealContentPattern: '',
          preMealAmount: 0,
          mealRemainder: 0,
          mainDishIntake: 0,
          sideDishIntake: 0,
          mealIntakeRatio: 0,
          waterAmount: 0,
          waterIntake: 0,
        },
      }));
    }
  };

  // 利用者選択を確定
  const handleConfirmSelection = () => {
    setShowPatientSelectModal(false);
  };

  // 食事内容パターン変更
  const handleMealPatternChange = (patientId: number, value: string) => {
    setMealInputs((prev) => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        mealContentPattern: value,
      },
    }));
  };

  // 食前の食事量変更
  const handlePreMealAmountChange = (patientId: number, value: number) => {
    setMealInputs((prev) => {
      const updated = {
        ...prev,
        [patientId]: {
          ...prev[patientId],
          preMealAmount: value,
        },
      };
      // 食事摂取割合を自動計算
      updated[patientId].mealIntakeRatio = calculateMealIntakeRatio(
        updated[patientId].preMealAmount,
        updated[patientId].mealRemainder
      );
      return updated;
    });
  };

  // 汎用的な入力フィールド変更ハンドラー
  const handleInputChange = (
    patientId: number,
    field: keyof MealInput,
    value: number
  ) => {
    setMealInputs((prev) => {
      const updated = {
        ...prev,
        [patientId]: {
          ...prev[patientId],
          [field]: value,
        },
      };
      // 食事残渣量が変更された場合、食事摂取割合を再計算
      if (field === 'mealRemainder') {
        updated[patientId].mealIntakeRatio = calculateMealIntakeRatio(
          updated[patientId].preMealAmount,
          updated[patientId].mealRemainder
        );
      }
      return updated;
    });
  };

  // 食事摂取割合の自動計算
  const calculateMealIntakeRatio = (
    preMealAmount: number,
    mealRemainder: number
  ): number => {
    if (preMealAmount === 0) return 0;
    return Math.round(((preMealAmount - mealRemainder) / preMealAmount) * 100);
  };

  // 一括登録
  const handleBulkRegister = () => {
    // 登録処理（現在はアラート表示のみ）
    alert(
      `${selectedPatients.length}件の食事記録を登録しました。\n一覧画面へ遷移します。`
    );

    // 一覧画面へ遷移
    router.push('/meals');
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => router.push('/meals')}
            className="text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">食事記録作成</h1>
        </div>

        {/* ボタン */}
        <div className="flex gap-3 mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowPatientSelectModal(true)}
          >
            利用者追加
          </Button>
          {selectedPatients.length > 0 && (
            <Button
              type="button"
              variant="primary"
              onClick={handleBulkRegister}
            >
              一括登録
            </Button>
          )}
        </div>

        {/* 選択された利用者がいない場合 */}
        {selectedPatients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              「利用者追加」ボタンから利用者を選択してください
            </p>
          </div>
        )}

        {/* スマホ表示: カード形式 */}
        {selectedPatients.length > 0 && (
          <div className="md:hidden space-y-4">
            {selectedPatients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-lg shadow p-4">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600">{patient.roomNumber}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食事内容パターン
                    </label>
                    <select
                      value={mealInputs[patient.id]?.mealContentPattern || ''}
                      onChange={(e) =>
                        handleMealPatternChange(patient.id, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="朝A_(小鉢あり)">朝A_(小鉢あり)</option>
                      <option value="朝B_(小鉢なし)">朝B_(小鉢なし)</option>
                      <option value="昼A">昼A</option>
                      <option value="昼B">昼B</option>
                      <option value="昼C">昼C</option>
                      <option value="夕A_(小鉢あり)">夕A_(小鉢あり)</option>
                      <option value="夕B_(小鉢なし)">夕B_(小鉢なし)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食前の食事量（g）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.preMealAmount || 0}
                      onChange={(e) =>
                        handlePreMealAmountChange(
                          patient.id,
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食事残渣量（g）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.mealRemainder || 0}
                      onChange={(e) =>
                        handleInputChange(
                          patient.id,
                          'mealRemainder',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食事摂取量 (主食)（g）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.mainDishIntake || 0}
                      onChange={(e) =>
                        handleInputChange(
                          patient.id,
                          'mainDishIntake',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食事摂取量 (副食)（g）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.sideDishIntake || 0}
                      onChange={(e) =>
                        handleInputChange(
                          patient.id,
                          'sideDishIntake',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      食事摂取割合（%）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.mealIntakeRatio || 0}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      水分量（ml）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.waterAmount || 0}
                      onChange={(e) =>
                        handleInputChange(
                          patient.id,
                          'waterAmount',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      水分摂取量（ml）
                    </label>
                    <input
                      type="number"
                      value={mealInputs[patient.id]?.waterIntake || 0}
                      onChange={(e) =>
                        handleInputChange(
                          patient.id,
                          'waterIntake',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PC表示: テーブル */}
        {selectedPatients.length > 0 && (
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    居室番号
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    利用者名
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食事内容パターン
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食前の食事量（g）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食事残渣量（g）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食事摂取量(主食)（g）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食事摂取量(副食)（g）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    食事摂取割合（%）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">
                    水分量（ml）
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    水分摂取量（ml）
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-2 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      {patient.roomNumber}
                    </td>
                    <td className="px-2 py-3 text-sm text-center text-gray-900 border-r border-gray-200">
                      {patient.name}
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <select
                        value={mealInputs[patient.id]?.mealContentPattern || ''}
                        onChange={(e) =>
                          handleMealPatternChange(patient.id, e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      >
                        <option value="">選択してください</option>
                        <option value="朝A_(小鉢あり)">朝A_(小鉢あり)</option>
                        <option value="朝B_(小鉢なし)">朝B_(小鉢なし)</option>
                        <option value="昼A">昼A</option>
                        <option value="昼B">昼B</option>
                        <option value="昼C">昼C</option>
                        <option value="夕A_(小鉢あり)">夕A_(小鉢あり)</option>
                        <option value="夕B_(小鉢なし)">夕B_(小鉢なし)</option>
                      </select>
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.preMealAmount || 0}
                        onChange={(e) =>
                          handlePreMealAmountChange(
                            patient.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.mealRemainder || 0}
                        onChange={(e) =>
                          handleInputChange(
                            patient.id,
                            'mealRemainder',
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.mainDishIntake || 0}
                        onChange={(e) =>
                          handleInputChange(
                            patient.id,
                            'mainDishIntake',
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.sideDishIntake || 0}
                        onChange={(e) =>
                          handleInputChange(
                            patient.id,
                            'sideDishIntake',
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.mealIntakeRatio || 0}
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm bg-gray-100 cursor-not-allowed"
                      />
                    </td>
                    <td className="px-2 py-3 border-r border-gray-200">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.waterAmount || 0}
                        onChange={(e) =>
                          handleInputChange(
                            patient.id,
                            'waterAmount',
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input
                        type="number"
                        value={mealInputs[patient.id]?.waterIntake || 0}
                        onChange={(e) =>
                          handleInputChange(
                            patient.id,
                            'waterIntake',
                            Number(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 利用者選択モーダル */}
        {showPatientSelectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
              {/* ヘッダー */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  利用者選択
                </h2>
                <button
                  onClick={() => setShowPatientSelectModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* コンテンツ */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-2">
                  {mockPatientData.map((patient) => (
                    <label
                      key={patient.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPatientIds.includes(patient.id)}
                        onChange={() => togglePatientSelection(patient.id)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {patient.roomNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600">
                            {patient.gender} / {patient.age}歳
                          </span>
                          <span className="text-xs text-gray-600">
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* フッター */}
              <div className="flex gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPatientSelectModal(false)}
                >
                  キャンセル
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleConfirmSelection}
                >
                  選択を確定（{selectedPatientIds.length}名）
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
