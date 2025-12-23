'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import {
  mockStatusChanges,
  primaryCareTypes,
  statusOptions,
  StatusChange,
} from '@/data/mockStatusChanges';

export default function StatusChangesPage() {
  const router = useRouter();

  // フィルター状態
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPrimaryCareType, setSelectedPrimaryCareType] = useState('');
  const [isMobile, setIsMobile] = useState(true);

  // インライン編集状態
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [localData, setLocalData] = useState<StatusChange[]>(mockStatusChanges);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // フィルタリングされたデータ
  const filteredReports = useMemo(() => {
    return localData.filter((report) => {
      // 期間フィルター
      if (startDate) {
        const reportDate = new Date(report.reportDate);
        const filterStartDate = new Date(startDate);
        if (reportDate < filterStartDate) return false;
      }
      if (endDate) {
        const reportDate = new Date(report.reportDate);
        const filterEndDate = new Date(endDate);
        filterEndDate.setHours(23, 59, 59, 999);
        if (reportDate > filterEndDate) return false;
      }

      // 利用者名フィルター
      if (selectedPatient && !report.patientName.includes(selectedPatient)) {
        return false;
      }

      // ステータスフィルター
      if (selectedStatus && report.status !== selectedStatus) {
        return false;
      }

      // かかりつけ種別フィルター
      if (
        selectedPrimaryCareType &&
        report.primaryCareType !== selectedPrimaryCareType
      ) {
        return false;
      }

      return true;
    });
  }, [
    startDate,
    endDate,
    selectedPatient,
    selectedStatus,
    selectedPrimaryCareType,
    localData,
  ]);

  // CSVダウンロード
  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      '利用者名',
      '生年月日',
      '年齢',
      '性別',
      'サービス利用開始日',
      '介護度',
      '事業所名',
      '号室',
      '施設名',
      'フロア',
      '報告日',
      '報告者名',
      '変化発生日',
      '変化発生時刻',
      'かかりつけ種別',
      '状態変化の種類',
      '状態変化内容',
      '補足説明',
      '体温',
      '血圧(高)',
      '血圧(低)',
      '脈拍',
      'SpO2',
      '医療機関名',
      '電話番号',
      '受診日',
      '受診時刻',
      '診断名',
      '処置内容',
      '処方',
      '次回予約',
      '家族連絡日',
      '連絡先',
      '連絡内容',
      'ケアマネ連絡日',
      'ケアマネ連絡内容',
      'ステータス',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredReports.map((report) =>
        [
          report.id,
          report.patientName,
          report.birthDate,
          report.age,
          report.gender,
          report.serviceStartDate,
          report.careLevel,
          report.facilityName,
          report.roomNumber,
          report.buildingName,
          report.floor,
          report.reportDate,
          report.reporterName,
          report.changeDate,
          report.changeTime,
          report.primaryCareType,
          report.changeType,
          `"${report.changeDescription}"`,
          `"${report.supplementaryNote}"`,
          report.temperature || '',
          report.bloodPressureHigh || '',
          report.bloodPressureLow || '',
          report.pulse || '',
          report.spo2 || '',
          report.hospitalName || report.emergencyHospital || '',
          report.hospitalPhone || '',
          report.consultationDate ||
            report.visitDate ||
            report.emergencyDate ||
            '',
          report.consultationTime ||
            report.visitTime ||
            report.emergencyTime ||
            '',
          report.diagnosis ||
            report.visitDiagnosis ||
            report.emergencyDiagnosis ||
            '',
          report.treatmentSummary ||
            report.visitTreatment ||
            report.emergencyTreatment ||
            '',
          report.prescription || report.visitPrescription || '',
          report.nextAppointment || report.visitNextDate || '',
          report.familyContactDate || '',
          report.familyContactPerson || '',
          `"${report.familyContactContent || ''}"`,
          report.careManagerContactDate || '',
          `"${report.careManagerContactContent || ''}"`,
          report.status,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `状態変化データ_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 編集画面へ遷移
  const handleEdit = (id: string) => {
    router.push(`/status-changes/${id}/edit`);
  };

  // インライン編集開始
  const handleStartEdit = (id: string, field: string, value: string) => {
    setEditingId(id);
    setEditingField(field);
    setEditValue(value);
  };

  // インライン編集保存
  const handleSaveEdit = () => {
    if (editingId && editingField) {
      setLocalData((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, [editingField]: editValue } : item
        )
      );
    }
    setEditingId(null);
    setEditingField(null);
    setEditValue('');
  };

  // インライン編集キャンセル
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditValue('');
  };

  // ステータスバッジの色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '対応中':
        return 'bg-red-100 text-red-800';
      case '経過観察中':
        return 'bg-yellow-100 text-yellow-800';
      case '完了':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // かかりつけ種別バッジの色
  const getPrimaryCareColor = (type: string) => {
    switch (type) {
      case '病院':
        return 'bg-blue-100 text-blue-800';
      case 'クリニック':
        return 'bg-indigo-100 text-indigo-800';
      case '訪問診療':
        return 'bg-purple-100 text-purple-800';
      case '救急搬送':
        return 'bg-red-100 text-red-800';
      case 'なし':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 編集可能セルのレンダリング
  const renderEditableCell = (
    report: StatusChange,
    field: keyof StatusChange,
    value: string | number | boolean | undefined,
    type: 'text' | 'select' = 'text',
    options?: string[]
  ) => {
    const isEditing = editingId === report.id && editingField === field;
    const displayValue = value?.toString() || '-';

    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
            autoFocus
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }
      return (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveEdit();
            if (e.key === 'Escape') handleCancelEdit();
          }}
          className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
          autoFocus
        />
      );
    }

    return (
      <span
        onClick={() =>
          handleStartEdit(report.id, field as string, displayValue)
        }
        className="cursor-pointer hover:bg-blue-50 px-1 py-0.5 rounded block"
        title="クリックで編集"
      >
        {displayValue}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">状態変化管理</h1>
            <p className="text-sm text-gray-600 mt-1">
              利用者の状態変化を管理します（セルをクリックでインライン編集可能）
            </p>
          </div>
          {!isMobile && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => router.push('/status-changes/create')}
              >
                状態変化作成
              </Button>
              <Button variant="primary" onClick={handleDownloadCSV}>
                CSVダウンロード
              </Button>
            </div>
          )}
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* 期間検索（開始日） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間（開始日）
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 期間検索（終了日） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                期間（終了日）
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 利用者名検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                利用者名
              </label>
              <input
                type="text"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                placeholder="利用者名を入力"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* かかりつけ種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                かかりつけ種別
              </label>
              <select
                value={selectedPrimaryCareType}
                onChange={(e) => setSelectedPrimaryCareType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {primaryCareTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* モバイル: ボタン群 */}
        {isMobile && (
          <div className="mb-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push('/status-changes/create')}
              className="flex-1"
            >
              作成
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadCSV}
              className="flex-1"
            >
              CSV
            </Button>
          </div>
        )}

        {/* データ件数表示 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredReports.length}件のデータが見つかりました
          </p>
        </div>

        {/* スマホ表示: カード形式 */}
        <div className="md:hidden space-y-4">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow p-4">
              {/* ヘッダー */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {report.patientName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {report.id}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      報告日: {report.reportDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => handleEdit(report.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                  </div>
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600 text-xs">かかりつけ:</span>
                    <p>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getPrimaryCareColor(
                          report.primaryCareType
                        )}`}
                      >
                        {report.primaryCareType}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">状態変化:</span>
                    <p className="font-medium">{report.changeType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">介護度:</span>
                    <p className="font-medium">{report.careLevel}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs">施設:</span>
                    <p className="font-medium text-xs">{report.facilityName}</p>
                  </div>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="text-xs text-gray-600 mb-1">バイタル</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-gray-600 text-xs">体温:</span>
                      <p className="font-medium">{report.temperature}℃</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">血圧:</span>
                      <p className="font-medium">
                        {report.bloodPressureHigh}/{report.bloodPressureLow}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">SpO2:</span>
                      <p className="font-medium">{report.spo2}%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-gray-600 block mb-1 text-xs">
                    状態変化内容:
                  </span>
                  <p className="text-gray-900 text-xs bg-gray-50 p-2 rounded">
                    {report.changeDescription}
                  </p>
                </div>

                {report.supplementaryNote && (
                  <div>
                    <span className="text-gray-600 block mb-1 text-xs">
                      補足説明:
                    </span>
                    <p className="text-gray-900 text-xs bg-gray-50 p-2 rounded">
                      {report.supplementaryNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PC表示: テーブル形式 */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 z-10">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky left-16 bg-gray-50 z-10">
                    利用者名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    報告日
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    かかりつけ
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    状態変化
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    変化発生日時
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    事業所
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    介護度
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    体温
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    血圧
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    脈拍
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    SpO2
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    状態変化内容
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    補足説明
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    医療機関
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    診断名
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    家族連絡
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    報告者
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 sticky left-0 bg-white">
                      {report.id}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-16 bg-white">
                      {report.patientName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(
                        report,
                        'reportDate',
                        report.reportDate
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {editingId === report.id && editingField === 'status' ? (
                        <select
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          className="px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none"
                          autoFocus
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          onClick={() =>
                            handleStartEdit(report.id, 'status', report.status)
                          }
                          className={`px-2 py-1 text-xs font-medium rounded cursor-pointer ${getStatusColor(
                            report.status
                          )}`}
                          title="クリックで編集"
                        >
                          {report.status}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getPrimaryCareColor(
                          report.primaryCareType
                        )}`}
                      >
                        {report.primaryCareType}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(
                        report,
                        'changeType',
                        report.changeType
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.changeDate} {report.changeTime}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.facilityName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.careLevel}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {renderEditableCell(
                        report,
                        'temperature',
                        report.temperature ? `${report.temperature}℃` : '-'
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.bloodPressureHigh && report.bloodPressureLow
                        ? `${report.bloodPressureHigh}/${report.bloodPressureLow}`
                        : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.pulse || '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.spo2 ? `${report.spo2}%` : '-'}
                    </td>
                    <td
                      className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                      title={report.changeDescription}
                    >
                      {renderEditableCell(
                        report,
                        'changeDescription',
                        report.changeDescription
                      )}
                    </td>
                    <td
                      className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate"
                      title={report.supplementaryNote}
                    >
                      {renderEditableCell(
                        report,
                        'supplementaryNote',
                        report.supplementaryNote
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.hospitalName ||
                        report.emergencyHospital ||
                        report.visitDoctorName ||
                        '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.diagnosis ||
                        report.visitDiagnosis ||
                        report.emergencyDiagnosis ||
                        '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.familyContactDate
                        ? `${report.familyContactDate} ${report.familyContactPerson || ''}`
                        : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {report.reporterName}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-center">
                      <button
                        onClick={() => handleEdit(report.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        編集
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* データなしメッセージ */}
            {filteredReports.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">データがありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
