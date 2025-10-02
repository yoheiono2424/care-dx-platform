'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';

export default function AccountCreatePage() {
  const router = useRouter();

  // フォームデータ
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '',
    role: '',
    facility: '',
    floors: [] as string[],
    emergencyContact: '',
    notes: '',
  });

  // 保有資格
  const [qualifications, setQualifications] = useState({
    careWorkerInitial: false,
    careWorkerPractical: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 保存処理（今後実装）
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
          <h1 className="text-2xl font-bold text-gray-800">
            アカウント管理＞作成
          </h1>
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

            {/* 施設 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                施設
              </label>
              <select
                value={formData.facility}
                onChange={(e) =>
                  setFormData({ ...formData, facility: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value=""></option>
                <option value="ケアホーム熊本">ケアホーム熊本</option>
                <option value="ケアホーム福岡">ケアホーム福岡</option>
                <option value="ケアホーム鹿児島">ケアホーム鹿児島</option>
              </select>
            </div>

            {/* フロア (複数選択) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                フロア
              </label>
              <select
                multiple
                value={formData.floors}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormData({ ...formData, floors: selected });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                size={4}
              >
                <option value="1階">1階</option>
                <option value="2階">2階</option>
                <option value="3階">3階</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Ctrl/Cmdキーを押しながら複数選択できます
              </p>
            </div>

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
