'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { mockTaskData } from '@/data/mockTasks';

interface Task {
  id: number;
  title: string;
  category: string;
  status: '未完了' | '完了';
  dueDate: string;
  priority: '高' | '中' | '低';
  assignedTo: string;
  description: string;
}

const mockDetailTasks: Task[] = [
  {
    id: 1,
    title: 'バイタルチェック',
    category: '健康管理',
    status: '未完了',
    dueDate: '2025-09-30 09:00',
    priority: '高',
    assignedTo: '看護師A',
    description: '朝のバイタルサイン測定（血圧、体温、脈拍）',
  },
  {
    id: 2,
    title: '服薬確認',
    category: '投薬管理',
    status: '未完了',
    dueDate: '2025-09-30 10:00',
    priority: '高',
    assignedTo: '看護師B',
    description: '朝食後の処方薬服用確認',
  },
  {
    id: 3,
    title: 'リハビリ実施',
    category: 'リハビリ',
    status: '完了',
    dueDate: '2025-09-30 11:00',
    priority: '中',
    assignedTo: 'PT佐藤',
    description: '歩行訓練30分',
  },
  {
    id: 4,
    title: '入浴介助',
    category: '日常生活支援',
    status: '未完了',
    dueDate: '2025-09-30 14:00',
    priority: '中',
    assignedTo: '介護士C',
    description: '週2回の入浴介助',
  },
  {
    id: 5,
    title: '医師診察',
    category: '医療',
    status: '未完了',
    dueDate: '2025-09-30 15:30',
    priority: '高',
    assignedTo: '田中医師',
    description: '定期診察・処方箋更新',
  },
];

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);

  const patient = mockTaskData.find((p) => p.id === patientId);
  const [tasks, setTasks] = useState<Task[]>(mockDetailTasks);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleStatusClick = (task: Task) => {
    if (task.status === '未完了') {
      setSelectedTask(task);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmComplete = () => {
    if (selectedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask.id
            ? { ...task, status: '完了' as const }
            : task
        )
      );
      setShowConfirmModal(false);
      setSelectedTask(null);
    }
  };

  const handleCancelComplete = () => {
    setShowConfirmModal(false);
    setSelectedTask(null);
  };

  if (!patient) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">利用者が見つかりません</p>
          <Button
            variant="primary"
            onClick={() => router.push('/tasks')}
            className="mt-4"
          >
            一覧に戻る
          </Button>
        </div>
      </MainLayout>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-green-600';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === '高') return 'bg-red-100 text-red-800';
    if (priority === '中') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusColor = (status: string) => {
    if (status === '完了') return 'bg-green-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getStatusButtonStyle = (status: string) => {
    if (status === '完了') {
      return 'bg-green-500 text-white cursor-default';
    }
    return 'bg-gray-500 text-white hover:bg-gray-600 cursor-pointer';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/tasks')}
              className="mb-2"
            >
              ← 一覧に戻る
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">行動タスク詳細</h1>
          </div>
        </div>

        {/* 利用者情報カード */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            利用者情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">部屋番号</p>
              <p className="text-lg font-semibold text-gray-900">
                {patient.roomNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">利用者名</p>
              <p className="text-lg font-semibold text-gray-900">
                {patient.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">性別 / 年齢</p>
              <p className="text-lg font-semibold text-gray-900">
                {patient.gender} / {patient.age}歳
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">入院スコア</p>
              <p
                className={`text-3xl font-bold ${getScoreColor(patient.admissionScore)}`}
              >
                {patient.admissionScore}
              </p>
            </div>
          </div>
        </div>

        {/* タスク一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              行動タスク一覧（
              {tasks.filter((t) => t.status === '未完了').length}件未完了）
            </h2>
          </div>

          {/* PC表示: テーブル */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タスク名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    担当者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleStatusClick(task)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${getStatusButtonStyle(task.status)}`}
                        disabled={task.status === '完了'}
                      >
                        {task.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* スマホ表示: カード */}
          <div className="md:hidden divide-y divide-gray-200">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStatusClick(task)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${getStatusButtonStyle(task.status)}`}
                    disabled={task.status === '完了'}
                  >
                    {task.status}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">カテゴリ</p>
                    <p className="text-gray-900">{task.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">優先度</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500">期限</p>
                    <p className="text-gray-900 text-xs">{task.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">担当者</p>
                    <p className="text-gray-900">{task.assignedTo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 確認モーダル */}
        <Modal
          isOpen={showConfirmModal}
          onClose={handleCancelComplete}
          title="タスク完了確認"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              以下のタスクを完了にしてもよろしいですか？
            </p>
            {selectedTask && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold text-gray-900">
                  {selectedTask.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTask.description}
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancelComplete}>
                キャンセル
              </Button>
              <Button variant="primary" onClick={handleConfirmComplete}>
                完了にする
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
}
