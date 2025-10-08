'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* サイドバー */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-y-auto bg-gray-50 lg:ml-64">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>

      {/* フッター */}
      <Footer />
    </div>
  );
}
