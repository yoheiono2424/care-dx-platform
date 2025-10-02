'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { APP_INFO } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // ダミー処理：2秒後に行動タスク管理へ遷移
    setTimeout(() => {
      setLoading(false);
      router.push('/tasks');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* ロゴ・タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {APP_INFO.name}
          </h1>
          <p className="text-sm text-gray-600">{APP_INFO.description}</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">ログイン</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              error={errors.email}
              fullWidth
              required
            />

            {/* パスワード */}
            <Input
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              error={errors.password}
              fullWidth
              required
            />

            {/* パスワードを忘れた方 */}
            <div className="text-right">
              <Link
                href="/password-reset"
                className="text-sm text-primary hover:underline"
              >
                パスワードを忘れた方
              </Link>
            </div>

            {/* ログインボタン */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              ログイン
            </Button>
          </form>
        </div>

        {/* バージョン情報 */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Version {APP_INFO.version}
        </p>
      </div>
    </div>
  );
}
