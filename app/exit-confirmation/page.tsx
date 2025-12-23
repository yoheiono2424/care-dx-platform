'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

interface InterventionRecord {
  id: string;
  roomNumber: string;
  patientName: string;
  staffName: string;
  startDateTime: string;
  interventionType: string;
}

function ExitConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interventionId = searchParams.get('interventionId');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [stayDuration, setStayDuration] = useState('');

  // モックデータ（実際にはAPIから取得）
  const [interventionData, setInterventionData] =
    useState<InterventionRecord | null>(null);

  useEffect(() => {
    // 現在時刻を更新
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // モックデータをセット（実際にはAPIから取得）
    if (interventionId) {
      // 介入実績IDからデータを取得
      setInterventionData({
        id: interventionId,
        roomNumber: '101',
        patientName: '山田 太郎',
        staffName: '佐藤 花子',
        startDateTime: '2025/12/23 09:30',
        interventionType: '訪問介護',
      });
    } else {
      // デモ用のデフォルトデータ
      setInterventionData({
        id: 'demo-1',
        roomNumber: '101',
        patientName: '山田 太郎',
        staffName: '佐藤 花子',
        startDateTime: new Date(Date.now() - 30 * 60 * 1000).toLocaleString(
          'ja-JP',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }
        ),
        interventionType: '訪問介護',
      });
    }
  }, [interventionId]);

  useEffect(() => {
    // 滞在時間を計算
    if (interventionData?.startDateTime) {
      const calculateDuration = () => {
        const startParts = interventionData.startDateTime.match(
          /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/
        );
        if (startParts) {
          const start = new Date(
            parseInt(startParts[1]),
            parseInt(startParts[2]) - 1,
            parseInt(startParts[3]),
            parseInt(startParts[4]),
            parseInt(startParts[5])
          );
          const now = new Date();
          const diffMs = now.getTime() - start.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const hours = Math.floor(diffMins / 60);
          const mins = diffMins % 60;

          if (hours > 0) {
            setStayDuration(`${hours}時間${mins}分`);
          } else {
            setStayDuration(`${mins}分`);
          }
        }
      };
      calculateDuration();
      const interval = setInterval(calculateDuration, 60000);
      return () => clearInterval(interval);
    }
  }, [interventionData?.startDateTime]);

  const handleExitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmExit = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    // 実際のバックエンド実装時はここでAPIコール
    // 介入実績の終了日時を更新
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // 介入実績一覧または入室確認画面に戻る
    router.push('/interventions');
  };

  const handleCancel = () => {
    router.back();
  };

  if (!interventionData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* メインカード */}
      <div className="max-w-md mx-auto">
        {/* 部屋番号表示 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl font-bold text-blue-600">
                {interventionData.roomNumber}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">退室確認</h1>
          </div>

          {/* 訪問情報 */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">利用者名</span>
              <span className="text-base font-semibold text-gray-900">
                {interventionData.patientName}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">担当スタッフ</span>
              <span className="text-base font-semibold text-gray-900">
                {interventionData.staffName}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">介入区分</span>
              <span className="text-base font-semibold text-blue-600">
                {interventionData.interventionType}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">入室日時</span>
              <span className="text-base font-semibold text-gray-900">
                {interventionData.startDateTime}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">現在時刻</span>
              <span className="text-base font-semibold text-gray-900">
                {currentTime}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">滞在時間</span>
              <span className="text-lg font-bold text-green-600">
                {stayDuration}
              </span>
            </div>
          </div>

          {/* 確認メッセージ */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-center text-yellow-800">
              <span className="font-semibold">
                {interventionData.roomNumber}号室
              </span>
              の訪問を終了しますか？
            </p>
            <p className="text-center text-sm text-yellow-700 mt-1">
              退室ボタンを押すと介入実績の終了日時が記録されます
            </p>
          </div>

          {/* ボタン */}
          <div className="space-y-3">
            <button
              onClick={handleExitClick}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl text-white text-lg font-bold transition-all ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  処理中...
                </span>
              ) : (
                '退室する'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-700 text-lg font-bold hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>

        {/* フッター */}
        <p className="text-center text-xs text-gray-500">
          問題がある場合は管理者にお問い合わせください
        </p>
      </div>

      {/* 確認モーダル */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="退室確認"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {interventionData.roomNumber}号室の訪問を終了しますか？
            </p>
            <p className="text-sm text-gray-600">
              終了時刻: {currentTime}
              <br />
              滞在時間: {stayDuration}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1"
            >
              戻る
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmExit}
              className="flex-1 !bg-red-500 hover:!bg-red-600"
            >
              退室する
            </Button>
          </div>
        </div>
      </Modal>

      {/* 成功モーダル */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="退室完了"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              退室が記録されました
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">部屋番号:</span>
                  <span className="font-medium">
                    {interventionData.roomNumber}号室
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">利用者:</span>
                  <span className="font-medium">
                    {interventionData.patientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">退室時刻:</span>
                  <span className="font-medium">{currentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">滞在時間:</span>
                  <span className="font-medium text-green-600">
                    {stayDuration}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSuccessClose}
            className="w-full"
          >
            閉じる
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}

export default function ExitConfirmationPage() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        <ExitConfirmationContent />
      </Suspense>
    </MainLayout>
  );
}
