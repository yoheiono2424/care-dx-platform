'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Alert from '@/components/common/Alert';
import { APP_INFO } from '@/lib/constants';

export default function PasswordResetConfirmPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = '確認用パスワードを入力してください';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
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
              <p className="font-semibold mb-1">パスワードを変更しました</p>
              <p className="text-sm">
                新しいパスワードでログインしてください。
              </p>
            </Alert>

            <div className="mt-6">
              <Button
                variant="primary"
                fullWidth
                onClick={() => router.push('/login')}
              >
                ログイン画面へ
              </Button>
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
            新しいパスワード設定
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            新しいパスワードを入力してください。
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="新しいパスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              error={errors.password}
              helperText="8文字以上で入力してください"
              fullWidth
              required
            />

            <Input
              label="新しいパスワード（確認）"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="もう一度入力してください"
              error={errors.confirmPassword}
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
              パスワードを変更
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
