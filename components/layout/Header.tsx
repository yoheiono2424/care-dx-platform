'use client';

import { useRouter } from 'next/navigation';
import { APP_INFO } from '@/lib/constants';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* 左側: ハンバーガーメニュー（スマホのみ） + ロゴ */}
        <div className="flex items-center gap-4">
          {/* ハンバーガーメニューボタン（lg:未満で表示） */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="メニューを開く"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* ロゴ */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 hidden md:block">
              {APP_INFO.name}
            </h1>
            {/* スマホ用の短縮版 */}
            <h1 className="text-lg font-semibold text-gray-900 md:hidden">
              ケアDX
            </h1>
          </div>
        </div>

        {/* 右側: ユーザー情報 */}
        <div className="flex items-center gap-4">
          {/* ユーザー情報（クリック可能） */}
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">山</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">山田太郎</p>
              <p className="text-xs text-gray-500">管理者</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
