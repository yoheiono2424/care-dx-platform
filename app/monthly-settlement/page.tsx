'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import {
  mockMonthlySettlementData,
  MonthlySettlementRecord,
} from '@/data/mockMonthlySettlement';

// 選択肢の定義
const FIELD_OPTIONS = {
  currentStatus: [
    '-',
    '新規',
    '退去',
    '入院',
    '退院',
    '当月内入退院',
    '30日以上の入院後退院',
    '全入院',
  ],
  plannedIntervention: [1, 2, 3],
  welfare: ['あり', 'なし'],
  oralCare: ['算定', '-'],
  careBurdenRate: ['1割', '2割', '3割', '公費'],
  medicalBurdenRate: ['1割', '2割', '3割', '公費'],
  thickeningUse: ['15日以上', '15日未満', '利用なし'],
  medicalNotes: [
    '26区ア',
    '27区イ',
    '28区ウ',
    '29区エ',
    '30区オⅠ',
    '30区オⅡ',
    '41区カ',
    '42区キ',
    '無記載',
  ],
  medicalPublicExpense: [
    '医療券',
    '難病指定',
    '身体医療証',
    '原爆',
    '中国在留',
    '水俣病',
    '-',
  ],
  medicalInsurance: [
    '-',
    '特指示',
    '別表7：末期ガン',
    '別表7：多発性硬化症',
    '別表7：重症筋無力症',
    '別表7：スモン',
    '別表7：ALS',
    '別表7：脊髄小脳変性症',
    '別表7：ハンチントン病',
    '別表7：進行性筋ジストロフィー',
    '別表7：パーキンソン関連',
    '別表7：多系統萎縮症',
    '別表7：プリオン病',
    '別表7：亜急性硬化性全脳炎',
    '別表7：ライソゾーム病',
    '別表7：副腎白質ジストロフィー',
    '別表7：脊髄性筋萎縮症',
    '別表7：球脊髄性筋委縮症',
    '別表7：多発神経炎',
    '別表7：後天性免疫不全症候群',
    '別表7：頚髄損傷',
    '別表7：人工呼吸器',
  ],
  specialManagement: [
    '-',
    '在宅麻薬等注射指導管理',
    '在宅腫瘍化学療法注射指導管理',
    '在宅強心剤持続投与指導管理',
    '在宅気管切開患者指導管理',
    '気管カニューレ',
    '留置カテーテル',
    '腹膜指導管理',
    '血液透析指導管理',
    '酸素療法指導管理',
    '中心静脈栄養法指導管理',
    '成分栄養経管栄養法指導',
    '自己導尿指導管理',
    '人工呼吸指導管理',
    '持続腸圧呼吸療法',
    '自己疼痛管理指導',
    '肺高血圧呼吸療法指導管理',
    '人工肛門又は人工膀胱',
    '真皮を超える褥瘡',
    '点滴注射管理指導',
    '留置カテーテル, 真皮を超える褥瘡',
    '気管カニューレ, 真皮を超える褥瘡',
    '留置カテーテル, 点滴注射管理指導',
    '留置カテーテル, 真皮を超える褥瘡, 点滴注射管理指導',
  ],
  dailyRecords: ['●', '■', '▼', '★', '00', '空白'],
};

type FieldType =
  | 'selection'
  | 'searchable'
  | 'dailyRecord'
  | 'text'
  | 'number'
  | 'date';

interface EditModalState {
  isOpen: boolean;
  recordId: number | null;
  fieldName: keyof MonthlySettlementRecord | null;
  fieldType: FieldType | null;
  currentValue: string | number | null;
  dailyRecordKey?: string; // 日次記録の場合のキー（例: "9/1"）
}

export default function MonthlySettlementPage() {
  const router = useRouter();

  // データ管理（モックデータをステートで管理）
  const [records, setRecords] = useState(mockMonthlySettlementData);

  // 年月選択（デフォルトは当月）
  const currentDate = new Date();
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);

  // 検索フィルター
  const [searchPatientName, setSearchPatientName] = useState('');

  // モーダル状態管理
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    recordId: null,
    fieldName: null,
    fieldType: null,
    currentValue: null,
  });

  // 編集中の値
  const [editValue, setEditValue] = useState<string>('');

  // 検索ボックス用の状態（検索機能付き選択肢用）
  const [searchQuery, setSearchQuery] = useState('');

  // 日次記録の「その他」入力モード
  const [showOtherInput, setShowOtherInput] = useState(false);

  // セルクリックハンドラー
  const handleCellClick = (
    recordId: number,
    fieldName: keyof MonthlySettlementRecord,
    fieldType: FieldType,
    currentValue: string | number | { [key: string]: string },
    dailyRecordKey?: string
  ) => {
    let value: string | number | null = null;

    // 日次記録の場合
    if (dailyRecordKey && typeof currentValue === 'object') {
      value = currentValue[dailyRecordKey] || '';
    } else if (
      typeof currentValue === 'string' ||
      typeof currentValue === 'number'
    ) {
      value = currentValue;
    }

    setEditModal({
      isOpen: true,
      recordId,
      fieldName,
      fieldType,
      currentValue: value,
      dailyRecordKey,
    });

    setEditValue(value?.toString() || '');
    setSearchQuery('');
    setShowOtherInput(false);
  };

  // モーダルを閉じる
  const handleCloseModal = () => {
    setEditModal({
      isOpen: false,
      recordId: null,
      fieldName: null,
      fieldType: null,
      currentValue: null,
    });
    setEditValue('');
    setSearchQuery('');
    setShowOtherInput(false);
  };

  // 保存処理
  const handleSave = () => {
    if (!editModal.recordId || !editModal.fieldName) return;

    setRecords((prevRecords) =>
      prevRecords.map((record) => {
        if (record.id === editModal.recordId) {
          // 日次記録の場合
          if (editModal.dailyRecordKey) {
            return {
              ...record,
              dailyRecords: {
                ...record.dailyRecords,
                [editModal.dailyRecordKey]:
                  editValue === '空白' ? '' : editValue,
              },
            };
          }

          // 数値フィールドの場合
          if (editModal.fieldType === 'number' && editModal.fieldName) {
            return {
              ...record,
              [editModal.fieldName as keyof MonthlySettlementRecord]: editValue
                ? Number(editValue)
                : 0,
            } as MonthlySettlementRecord;
          }

          // 通常のフィールド
          if (editModal.fieldName) {
            return {
              ...record,
              [editModal.fieldName as keyof MonthlySettlementRecord]: editValue,
            } as MonthlySettlementRecord;
          }
        }
        return record;
      })
    );

    handleCloseModal();
  };

  // フィルタリングされたデータ
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 利用者名検索
      if (
        searchPatientName &&
        !record.patientName.includes(searchPatientName)
      ) {
        return false;
      }
      return true;
    });
  }, [records, searchPatientName]);

  // 選択月の日数を取得
  const getDaysInMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-').map(Number);
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth);

  // 日次記録の列を生成
  const generateDayColumns = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][
        date.getDay()
      ];
      days.push({ day, dayOfWeek, key: `${month}/${day}` });
    }
    return days;
  };

  const dayColumns = generateDayColumns();

  // CSVダウンロード
  const handleDownloadCSV = () => {
    alert('CSV ダウンロード機能は実装予定です');
  };

  // 上部スクロールバーの幅をテーブルと同期
  useEffect(() => {
    const syncScrollbarWidth = () => {
      const topScrollbar = document.getElementById('monthly-top-scrollbar');
      const tableContainer = document.getElementById('monthly-table-container');
      const scrollbarContent = document.getElementById(
        'monthly-scrollbar-content'
      );

      if (tableContainer && scrollbarContent && topScrollbar) {
        const table = tableContainer.querySelector('table');
        if (table) {
          const tableWidth = table.scrollWidth;
          const scrollbarWidth = topScrollbar.clientWidth;

          console.log('テーブルの幅:', tableWidth);
          console.log('スクロールバーの親要素の幅:', scrollbarWidth);
          console.log('差分:', tableWidth - scrollbarWidth);

          scrollbarContent.style.width = `${tableWidth}px`;

          // 確認：設定後の幅
          setTimeout(() => {
            console.log(
              'スクロールバー中身の実際の幅:',
              scrollbarContent.offsetWidth
            );
          }, 10);
        }
      }
    };

    // DOMが完全にレンダリングされるまで少し待つ
    const timer = setTimeout(() => {
      syncScrollbarWidth();
    }, 100);

    window.addEventListener('resize', syncScrollbarWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', syncScrollbarWidth);
    };
  }, [filteredRecords, selectedMonth, dayColumns.length]);

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/interventions')}
              className="text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">月次決算</h1>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            CSV出力
          </button>
        </div>

        {/* フィルター・検索エリア */}
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <div className="flex gap-3 items-end">
            {/* 年月選択 */}
            <div className="flex-shrink-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                年月選択
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名検索 */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                利用者名検索
              </label>
              <input
                type="text"
                placeholder="利用者名"
                value={searchPatientName}
                onChange={(e) => setSearchPatientName(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* データ件数表示 */}
        <div className="mb-2">
          <p className="text-xs text-gray-600">{filteredRecords.length}件</p>
        </div>

        {/* テーブル（2分割：固定列 + スクロール列） */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="flex">
            {/* 左側：固定列テーブル */}
            <div className="flex-shrink-0 flex flex-col">
              {/* 上部スペーサー（右側のスクロールバーと高さを合わせる） */}
              <div style={{ height: '20px' }}></div>

              <table
                className="border-collapse text-xs"
                style={{ tableLayout: 'fixed' }}
              >
                <thead className="sticky top-0 z-10">
                  <tr
                    className="bg-gray-100 border-b border-gray-300"
                    style={{ height: '40px', boxSizing: 'border-box' }}
                  >
                    <th
                      className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap"
                      style={{
                        width: '70px',
                        height: '40px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box',
                      }}
                    >
                      当月状態
                    </th>
                    <th
                      className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap"
                      style={{
                        width: '50px',
                        height: '40px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box',
                      }}
                    >
                      フロア
                    </th>
                    <th
                      className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap"
                      style={{
                        width: '70px',
                        height: '40px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box',
                      }}
                    >
                      居室番号
                    </th>
                    <th
                      className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-400 whitespace-nowrap"
                      style={{
                        width: '90px',
                        height: '40px',
                        lineHeight: '1.2',
                        boxSizing: 'border-box',
                      }}
                    >
                      利用者名
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, idx) => {
                    const rowBgColor =
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                    return (
                      <tr
                        key={record.id}
                        className={`border-b border-gray-200 ${rowBgColor}`}
                        style={{ height: '32px', boxSizing: 'border-box' }}
                      >
                        <td
                          className="px-2 text-center border-r border-gray-300 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                          style={{
                            width: '70px',
                            height: '32px',
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                          }}
                          onClick={() =>
                            handleCellClick(
                              record.id,
                              'currentStatus',
                              'selection',
                              record.currentStatus
                            )
                          }
                        >
                          {record.currentStatus}
                        </td>
                        <td
                          className="px-2 text-center border-r border-gray-300 whitespace-nowrap"
                          style={{
                            width: '50px',
                            height: '32px',
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                          }}
                        >
                          {record.floor}
                        </td>
                        <td
                          className="px-2 text-center border-r border-gray-300 whitespace-nowrap"
                          style={{
                            width: '70px',
                            height: '32px',
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                          }}
                        >
                          {record.roomNumber}
                        </td>
                        <td
                          className="px-2 text-center font-medium border-r-2 border-gray-400 whitespace-nowrap"
                          style={{
                            width: '90px',
                            height: '32px',
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                          }}
                        >
                          {record.patientName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 右側：上部スクロールバー + スクロール列テーブル */}
            <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
              {/* 上部スクロールバー */}
              <div
                id="monthly-top-scrollbar"
                className="overflow-x-auto overflow-y-hidden"
                style={{ height: '20px', flexShrink: 0 }}
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  const tableContainer = document.getElementById(
                    'monthly-table-container'
                  );
                  if (tableContainer) {
                    tableContainer.scrollLeft = target.scrollLeft;
                  }
                }}
              >
                <div
                  id="monthly-scrollbar-content"
                  style={{ height: '20px' }}
                ></div>
              </div>

              {/* スクロール列テーブル */}
              <div
                id="monthly-table-container"
                className="overflow-x-auto"
                style={{
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE, Edge
                }}
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement;
                  const topScrollbar = document.getElementById(
                    'monthly-top-scrollbar'
                  );
                  if (topScrollbar) {
                    topScrollbar.scrollLeft = target.scrollLeft;
                  }
                }}
              >
                <table
                  className="border-collapse text-xs"
                  style={{ tableLayout: 'auto' }}
                >
                  <thead className="sticky top-0 z-10">
                    <tr
                      className="bg-gray-100 border-b border-gray-300"
                      style={{ height: '40px', boxSizing: 'border-box' }}
                    >
                      {/* 基本情報列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        ﾌﾘｶﾞﾅ
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '45px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        年齢
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '60px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        介護度
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        予定介入数
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '50px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        生保
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '60px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        コード
                      </th>

                      {/* 保険・管理列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '80px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療保険
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '60px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特管
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        初期加算日数
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '90px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        利用開始日
                      </th>

                      {/* ターミナル・連携列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        ターミナル
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        退院時指導(医)
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        口腔連携
                      </th>

                      {/* 日次記録列（動的生成） */}
                      {dayColumns.map((day) => (
                        <th
                          key={day.key}
                          className="bg-blue-50 px-1 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                          style={{
                            minWidth: '40px',
                            height: '40px',
                            lineHeight: '1.2',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div>{day.day}</div>
                          <div className="text-[10px] text-gray-500">
                            ({day.dayOfWeek})
                          </div>
                        </th>
                      ))}

                      {/* 集計列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '60px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        合計
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        介護売上
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療売上
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        ﾎﾃﾙｺｽﾄ
                      </th>

                      {/* 負担割合列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        介護負担割合
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療負担割合
                      </th>

                      {/* 医療特記・公費列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療特記
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療公費
                      </th>

                      {/* とろみ管理列 */}
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        とろみ利用
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        開始日
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        終了日
                      </th>
                      <th
                        className="bg-gray-100 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        とろみ濃度
                      </th>

                      {/* 稼働関連列（5列） */}
                      <th
                        className="bg-yellow-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '60px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        稼働率
                      </th>
                      <th
                        className="bg-yellow-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        月日数
                      </th>
                      <th
                        className="bg-yellow-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '85px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        当月在所日数
                      </th>
                      <th
                        className="bg-yellow-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '45px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        デイ
                      </th>
                      <th
                        className="bg-yellow-50 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        部屋確保
                      </th>

                      {/* 医療クール計算列（15列） */}
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療クール計算
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特指示クール数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        別表７クール数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療日数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療回数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        除外数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療枠
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療取得率
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '90px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療介入回数
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療介入回数(日)
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        別表7回数(日)
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特指示回数(日)
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療介入回数(月)
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        別表7回数(月)
                      </th>
                      <th
                        className="bg-green-50 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '95px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特指示回数(月)
                      </th>

                      {/* 介護売上列（14列） */}
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        定期巡回
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療減算
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        デイ減算
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        緊急加算
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        ターミナル(介護)
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        共同指導(介護)
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '50px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        口腔
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '75px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特管(介護)
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        総合マネ
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '80px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        提供加算Ⅲ
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        初期加算
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '90px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        介護処遇以外
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        処遇加算
                      </th>
                      <th
                        className="bg-purple-50 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '65px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        地域加算
                      </th>

                      {/* 医療売上列（6列） */}
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        医療保険(計算)
                      </th>
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '80px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        初日差額分
                      </th>
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        ターミナル(医療)
                      </th>
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        共同指導(医療)
                      </th>
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '100px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        緊急加算(医療)
                      </th>
                      <th
                        className="bg-orange-50 px-2 text-center font-semibold text-gray-700 border-r-2 border-gray-300 whitespace-nowrap"
                        style={{
                          minWidth: '80px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        特管(医療)
                      </th>

                      {/* ホテルコスト列（4列） */}
                      <th
                        className="bg-pink-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        家賃
                      </th>
                      <th
                        className="bg-pink-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        管理費
                      </th>
                      <th
                        className="bg-pink-50 px-2 text-center font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                        style={{
                          minWidth: '70px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        食事形態
                      </th>
                      <th
                        className="bg-pink-50 px-2 text-center font-semibold text-gray-700 whitespace-nowrap"
                        style={{
                          minWidth: '55px',
                          height: '40px',
                          lineHeight: '1.2',
                          boxSizing: 'border-box',
                        }}
                      >
                        食費
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, idx) => {
                      const rowBgColor =
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                      return (
                        <tr
                          key={record.id}
                          className={`border-b border-gray-200 ${rowBgColor}`}
                          style={{ height: '32px', boxSizing: 'border-box' }}
                        >
                          {/* 基本情報列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            {record.furigana}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            {record.age}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            {record.careLevel}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'plannedIntervention',
                                'selection',
                                record.plannedIntervention
                              )
                            }
                          >
                            {record.plannedIntervention}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'welfare',
                                'selection',
                                record.welfare
                              )
                            }
                          >
                            {record.welfare}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'code',
                                'text',
                                record.code
                              )
                            }
                          >
                            {record.code || '-'}
                          </td>

                          {/* 保険・管理列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'medicalInsurance',
                                'searchable',
                                record.medicalInsurance
                              )
                            }
                          >
                            {record.medicalInsurance || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'specialManagement',
                                'searchable',
                                record.specialManagement
                              )
                            }
                          >
                            {record.specialManagement || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'initialDays',
                                'number',
                                record.initialDays
                              )
                            }
                          >
                            {record.initialDays || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'startDate',
                                'date',
                                record.startDate
                              )
                            }
                          >
                            {record.startDate}
                          </td>

                          {/* ターミナル・連携列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'terminal',
                                'text',
                                record.terminal
                              )
                            }
                          >
                            {record.terminal || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'hospitalDischargeGuidance',
                                'text',
                                record.hospitalDischargeGuidance
                              )
                            }
                          >
                            {record.hospitalDischargeGuidance || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'oralCare',
                                'selection',
                                record.oralCare
                              )
                            }
                          >
                            {record.oralCare || '-'}
                          </td>

                          {/* 日次記録列（動的生成） */}
                          {dayColumns.map((day) => (
                            <td
                              key={day.key}
                              className="px-1 text-center border-r border-gray-200 bg-blue-50 whitespace-nowrap cursor-pointer hover:bg-blue-100"
                              style={{
                                height: '32px',
                                lineHeight: '1.2',
                                boxSizing: 'border-box',
                              }}
                              onClick={() =>
                                handleCellClick(
                                  record.id,
                                  'dailyRecords',
                                  'dailyRecord',
                                  record.dailyRecords,
                                  day.key
                                )
                              }
                            >
                              <span className="font-medium">
                                {record.dailyRecords[day.key] || ''}
                              </span>
                            </td>
                          ))}

                          {/* 集計列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-gray-100 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            確認中
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-gray-100 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            確認中
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-gray-100 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            確認中
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 bg-gray-100 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            確認中
                          </td>

                          {/* 負担割合列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'careBurdenRate',
                                'selection',
                                record.careBurdenRate
                              )
                            }
                          >
                            {record.careBurdenRate}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'medicalBurdenRate',
                                'selection',
                                record.medicalBurdenRate
                              )
                            }
                          >
                            {record.medicalBurdenRate}
                          </td>

                          {/* 医療特記・公費列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'medicalNotes',
                                'selection',
                                record.medicalNotes
                              )
                            }
                          >
                            {record.medicalNotes || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'medicalPublicExpense',
                                'selection',
                                record.medicalPublicExpense
                              )
                            }
                          >
                            {record.medicalPublicExpense || '-'}
                          </td>

                          {/* とろみ管理列 */}
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'thickeningUse',
                                'selection',
                                record.thickeningUse
                              )
                            }
                          >
                            {record.thickeningUse}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'thickeningStartDate',
                                'date',
                                record.thickeningStartDate
                              )
                            }
                          >
                            {record.thickeningStartDate || '-'}
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'thickeningEndDate',
                                'date',
                                record.thickeningEndDate
                              )
                            }
                          >
                            {record.thickeningEndDate || '-'}
                          </td>
                          <td
                            className="px-2 text-center whitespace-nowrap cursor-pointer hover:bg-blue-50"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                            onClick={() =>
                              handleCellClick(
                                record.id,
                                'thickeningConcentration',
                                'text',
                                record.thickeningConcentration
                              )
                            }
                          >
                            {record.thickeningConcentration || '-'}
                          </td>

                          {/* 計算列（44列）- 将来的にバックエンドで計算 */}
                          {/* 稼働関連列（5列） */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-yellow-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-yellow-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-yellow-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-yellow-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 bg-yellow-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>

                          {/* 医療クール計算列（15列） */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 bg-green-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>

                          {/* 介護売上列（14列） */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 bg-purple-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>

                          {/* 医療売上列（6列） */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r-2 border-gray-300 bg-orange-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>

                          {/* ホテルコスト列（4列） */}
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-pink-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-pink-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center border-r border-gray-200 bg-pink-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                          <td
                            className="px-2 text-center bg-pink-50 text-gray-500 text-[10px] whitespace-nowrap"
                            style={{
                              height: '32px',
                              lineHeight: '1.2',
                              boxSizing: 'border-box',
                            }}
                          >
                            -
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* データなしメッセージ */}
          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">データがありません</p>
            </div>
          )}
        </div>

        {/* 注記 */}
        <div className="mt-3 bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-600">
            ※
            集計列・医療特記・医療公費はクライアント確認中です（CLIENT_CONFIRMATION.md参照）
          </p>
        </div>
      </div>

      {/* 編集モーダル */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              セルの編集
            </h3>

            {/* 選択式（通常） */}
            {editModal.fieldType === 'selection' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  選択してください
                </label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {editModal.fieldName &&
                    FIELD_OPTIONS[
                      editModal.fieldName as keyof typeof FIELD_OPTIONS
                    ]?.map((option) => (
                      <button
                        key={option}
                        onClick={() => setEditValue(option.toString())}
                        className={`w-full text-left px-4 py-2 rounded border ${
                          editValue === option.toString()
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* 選択式（検索機能付き） */}
            {editModal.fieldType === 'searchable' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  検索して選択
                </label>
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {editModal.fieldName &&
                    FIELD_OPTIONS[
                      editModal.fieldName as keyof typeof FIELD_OPTIONS
                    ]
                      ?.filter((option) =>
                        option
                          .toString()
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((option) => (
                        <button
                          key={option}
                          onClick={() => setEditValue(option.toString())}
                          className={`w-full text-left px-4 py-2 rounded border text-sm ${
                            editValue === option.toString()
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                </div>
              </div>
            )}

            {/* 日次記録（特殊） */}
            {editModal.fieldType === 'dailyRecord' && (
              <div className="mb-4">
                {!showOtherInput ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      選択してください
                    </label>
                    <div className="space-y-2 mb-3">
                      {FIELD_OPTIONS.dailyRecords.map((option) => (
                        <button
                          key={option}
                          onClick={() =>
                            setEditValue(option === '空白' ? '' : option)
                          }
                          className={`w-full text-left px-4 py-2 rounded border ${
                            editValue === (option === '空白' ? '' : option)
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option === '空白' ? '空白（空欄）' : option}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowOtherInput(true)}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300 hover:bg-gray-200"
                    >
                      その他（数値入力）
                    </button>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      数値を入力してください（01〜99、または数字+▼）
                    </label>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="例: 20、20▼"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setShowOtherInput(false)}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      ← 選択肢に戻る
                    </button>
                  </>
                )}
              </div>
            )}

            {/* テキスト入力 */}
            {editModal.fieldType === 'text' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  入力してください
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* 数値入力 */}
            {editModal.fieldType === 'number' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  数値を入力してください
                </label>
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* 日付入力 */}
            {editModal.fieldType === 'date' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  日付を選択してください
                </label>
                <input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* ボタン */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
