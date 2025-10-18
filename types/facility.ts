// 施設・フロア管理の型定義（3階層構造）

// 施設レコード（最上位）
export interface FacilityRecord {
  id: number;
  name: string; // 施設名
  openDate: string; // 稼働日
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

// 親フロアレコード（第2階層）
export interface ParentFloorRecord {
  id: number;
  facilityId: number; // 所属する施設のID
  name: string; // フロア名（例: 1階、2階、3階）
  type: '親フロア'; // 種別（固定値）
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

// 子フロアレコード（第3階層）
export interface ChildFloorRecord {
  id: number;
  facilityId: number; // 所属する施設のID
  parentFloorId: number; // 所属する親フロアのID
  name: string; // フロア名（例: 1階A、1階B）
  type: '子フロア'; // 種別（固定値）
  status: string; // 利用ステータス
  createdAt: string; // 作成日
}

// ツリー表示用の統合型
export interface TreeNode {
  level: 'facility' | 'parentFloor' | 'childFloor';
  data: FacilityRecord | ParentFloorRecord | ChildFloorRecord;
  children?: TreeNode[];
  isExpanded?: boolean;
}

// 選択肢の定義
export const facilityOptions = {
  status: ['利用中', '休止中'],
  floorType: ['親フロア', '子フロア'],
};
