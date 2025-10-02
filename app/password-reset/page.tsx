'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { APP_INFO } from '@/lib/constants';

export default function PasswordResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError('メールアドレスを入力してください');
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('正しいメールアドレスを入力してください');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // ダミー処理：2秒後に成功表示
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {APP_INFO.name}
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <Alert variant="success">
              <p className="font-semibold mb-1">送信完了</p>
              <p className="text-sm">
                パスワード再設定用のメールを送信しました。メールに記載されたリンクからパスワードを再設定してください。
              </p>
            </Alert>

            <div className="mt-6">
              <Link href="/login">
                <Button variant="primary" fullWidth>
                  ログイン画面に戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {APP_INFO.name}
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            パスワードリセット
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            ご登録のメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              error={error}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              送信
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
              >
                ログイン画面に戻る
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
