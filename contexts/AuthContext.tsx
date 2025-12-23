'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 役職の階層（上から順に権限が高い）
export const POSITION_HIERARCHY = [
  '取締役',
  '施設長',
  '部長',
  'フロア長',
  '主任',
  'チーフ',
  'スタッフ',
] as const;

export type Position = (typeof POSITION_HIERARCHY)[number];

export interface User {
  id: string;
  name: string;
  position: Position;
  facilityId: string;
  facilityName: string;
  floorId: string;
  floor: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (requiredPosition: Position) => boolean;
  canViewData: (targetPosition: Position) => boolean;
  getVisiblePositions: () => Position[];
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// モックユーザー（開発用）
const mockUser: User = {
  id: 'U001',
  name: '山田 太郎',
  position: '施設長',
  facilityId: 'F001',
  facilityName: 'メディケア癒しDX京町台',
  floorId: 'FL001',
  floor: '1F',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading] = useState(false);

  // 指定された役職以上の権限を持っているか確認
  const hasPermission = (requiredPosition: Position): boolean => {
    if (!user) return false;
    const userIndex = POSITION_HIERARCHY.indexOf(user.position);
    const requiredIndex = POSITION_HIERARCHY.indexOf(requiredPosition);
    return userIndex <= requiredIndex;
  };

  // 対象の役職のデータを閲覧できるか確認
  const canViewData = (targetPosition: Position): boolean => {
    if (!user) return false;
    const userIndex = POSITION_HIERARCHY.indexOf(user.position);
    const targetIndex = POSITION_HIERARCHY.indexOf(targetPosition);
    // 自分と同等以下の役職のデータのみ閲覧可能
    return userIndex <= targetIndex;
  };

  // 閲覧可能な役職リストを取得
  const getVisiblePositions = (): Position[] => {
    if (!user) return [];
    const userIndex = POSITION_HIERARCHY.indexOf(user.position);
    return POSITION_HIERARCHY.slice(userIndex) as Position[];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        hasPermission,
        canViewData,
        getVisiblePositions,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// メニュー項目に対する必要権限の定義
export const MENU_PERMISSIONS: Record<string, Position> = {
  // 全員がアクセス可能
  tasks: 'スタッフ',
  vital: 'スタッフ',
  urine: 'スタッフ',
  behavior: 'スタッフ',
  meal: 'スタッフ',
  intervention: 'スタッフ',
  entry: 'スタッフ',
  reports: 'スタッフ',
  'accident-report': 'スタッフ',
  'status-change': 'スタッフ',

  // チーフ以上
  patient: 'チーフ',

  // 主任以上
  doctor: '主任',
  pharmacy: '主任',
  'care-manager': '主任',

  // フロア長以上
  room: 'フロア長',
  'facilities-floors': 'フロア長',

  // 部長以上
  staff: '部長',
  'staff-evaluation': '部長',

  // 施設長以上
  settings: '施設長',
};
