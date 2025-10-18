'use client';

import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/common/Button';
import { mockPatientData } from '@/data/mockPatients';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params.id);

  // 利用者データを取得
  const patient = mockPatientData.find((p) => p.id === patientId);

  if (!patient) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">利用者が見つかりません</p>
            <Button
              variant="outline"
              onClick={() => router.push('/patients')}
              className="mt-4"
            >
              一覧に戻る
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // 読み取り専用フィールドコンポーネント
  const ReadOnlyField = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | string[] | undefined;
  }) => {
    // 配列の場合はカンマ区切りで表示
    const displayValue = Array.isArray(value)
      ? value.join(', ')
      : value !== undefined && value !== ''
        ? value
        : '-';

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
          {displayValue}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/patients')}
            className="mb-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            ← 一覧に戻る
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">利用者詳細</h1>
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push(`/patients/${patient.id}/edit`)}
            >
              編集
            </Button>
          </div>
        </div>

        {/* 詳細情報 */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* セクション1: 基本情報 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              基本情報
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="ID" value={patient.id} />
              <ReadOnlyField label="状況" value={patient.status} />
              <ReadOnlyField label="部屋番号" value={patient.roomNumber} />
              <ReadOnlyField label="フロア" value={patient.floor} />
              <ReadOnlyField label="氏名" value={patient.name} />
              <ReadOnlyField label="フリガナ" value={patient.furigana} />
              <ReadOnlyField label="性別" value={patient.gender} />
              <ReadOnlyField label="介護度" value={patient.careLevel} />
              <ReadOnlyField label="別表7" value={patient.schedule7} />
              <ReadOnlyField
                label="生活保護"
                value={patient.publicAssistance}
              />
              <ReadOnlyField
                label="在所日数（自動計算）"
                value={`${patient.daysOfStay}日`}
              />
              <ReadOnlyField
                label="紹介業者確認欄"
                value={patient.referralConfirmation}
              />
              <ReadOnlyField
                label="紹介業者or接触経路"
                value={patient.referralSource}
              />
              <ReadOnlyField label="利用開始日" value={patient.admissionDate} />
              <ReadOnlyField label="最終利用日" value={patient.lastUsageDate} />
              <ReadOnlyField
                label="利用再開日"
                value={patient.resumptionDate}
              />
              <ReadOnlyField label="退去日" value={patient.moveOutDate} />
              <ReadOnlyField label="退去理由" value={patient.moveOutReason} />
              <ReadOnlyField label="誕生月" value={patient.birthMonth} />
              <ReadOnlyField label="生年月日" value={patient.birthDate} />
              <ReadOnlyField
                label="年齢（自動計算）"
                value={`${patient.age}歳`}
              />
            </div>
          </div>

          {/* セクション2: 医療・プライマリー */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              医療・プライマリー
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="プライマリー①" value={patient.primary1} />
              <ReadOnlyField label="プライマリー②" value={patient.primary2} />
              <ReadOnlyField
                label="入居前状況"
                value={patient.priorSituation}
              />
              <ReadOnlyField
                label="かかりつけ病院"
                value={patient.primaryHospital}
              />
              <ReadOnlyField label="主治医" value={patient.primaryDoctor} />
              <ReadOnlyField
                label="主治医TEL"
                value={patient.primaryDoctorTel}
              />
            </div>
          </div>

          {/* セクション3: 居宅・ケアマネ */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              居宅・ケアマネ
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="居宅" value={patient.homeCareFacility} />
              <ReadOnlyField label="担当" value={patient.homeCareStaff} />
              <ReadOnlyField label="ケアマネ" value={patient.careManager1} />
              <ReadOnlyField label="TEL" value={patient.careManagerTel} />
              <ReadOnlyField label="ケアマネ(2)" value={patient.careManager2} />
              <ReadOnlyField label="FAX" value={patient.careManagerFax} />
            </div>
          </div>

          {/* セクション4: 緊急連絡先 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              緊急連絡先
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField
                label="緊急連絡先①"
                value={patient.emergencyContact1}
              />
              <ReadOnlyField
                label="①（氏名/続柄）"
                value={patient.emergencyName1}
              />
              <ReadOnlyField label="TEL①" value={patient.emergencyTel1} />
              <ReadOnlyField
                label="緊急連絡先②"
                value={patient.emergencyContact2}
              />
              <ReadOnlyField
                label="②（氏名/続柄）"
                value={patient.emergencyName2}
              />
              <ReadOnlyField label="TEL②" value={patient.emergencyTel2} />
              <ReadOnlyField
                label="緊急時の特記事項"
                value={patient.emergencyNotes}
              />
              <ReadOnlyField label="面会注意事項" value={patient.visitNotes} />
            </div>
          </div>

          {/* セクション5: サービス利用 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              サービス利用
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField
                label="通所利用先"
                value={patient.dayCareProvider}
              />
              <ReadOnlyField label="通所利用曜日" value={patient.dayCareDays} />
              <ReadOnlyField label="透析先" value={patient.dialysisProvider} />
              <ReadOnlyField
                label="透析利用曜日"
                value={patient.dialysisDays}
              />
              <ReadOnlyField
                label="訪問サービス"
                value={patient.homeVisitService}
              />
              <ReadOnlyField label="訪問リハ" value={patient.homeVisitRehab} />
              <ReadOnlyField
                label="訪問診療"
                value={patient.homeVisitMedical}
              />
              <ReadOnlyField label="訪問歯科" value={patient.homeVisitDental} />
              <ReadOnlyField label="薬局" value={patient.pharmacy} />
              <ReadOnlyField
                label="福祉用具"
                value={patient.welfareEquipment}
              />
              <ReadOnlyField
                label="福祉用具連絡先"
                value={patient.welfareEquipmentContact}
              />
              <ReadOnlyField label="おむつ" value={patient.diaper} />
              <ReadOnlyField
                label="医療機器メーカー"
                value={patient.medicalEquipmentMaker}
              />
            </div>
          </div>

          {/* セクション6: 疾患・医療行為 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              疾患・医療行為
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="疾患" value={patient.disease} />
              <ReadOnlyField label="診断名" value={patient.diagnosis} />
              <ReadOnlyField label="既往歴" value={patient.medicalHistory} />
              <ReadOnlyField
                label="医療行為（自動計算）"
                value={`${patient.medicalActCount}件`}
              />
              <ReadOnlyField label="気切" value={patient.tracheostomy} />
              <ReadOnlyField label="痰吸引" value={patient.suctioning} />
              <ReadOnlyField label="人工呼吸器" value={patient.ventilator} />
              <ReadOnlyField label="在宅酸素" value={patient.oxygenTherapy} />
              <ReadOnlyField label="経鼻" value={patient.nasalFeeding} />
              <ReadOnlyField label="胃ろう" value={patient.gastrostomy} />
              <ReadOnlyField label="腎ろう" value={patient.nephrostomy} />
              <ReadOnlyField label="IVH" value={patient.ivh} />
              <ReadOnlyField label="ストマ" value={patient.stoma} />
              <ReadOnlyField label="バルーン" value={patient.catheter} />
              <ReadOnlyField label="膀胱ろう" value={patient.cystostomy} />
              <ReadOnlyField label="透析" value={patient.dialysis} />
              <ReadOnlyField label="インスリン" value={patient.insulin} />
              <ReadOnlyField label="褥瘡" value={patient.pressureUlcer} />
            </div>
          </div>

          {/* セクション7: ADL・ケア */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              ADL・ケア
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField
                label="日常生活自立度"
                value={patient.dailyLivingIndependence}
              />
              <ReadOnlyField
                label="認知症高齢者の日常生活自立度"
                value={patient.dementiaIndependence}
              />
              <ReadOnlyField label="移動状況" value={patient.mobilityStatus} />
              <ReadOnlyField label="移乗" value={patient.transfer} />
              <ReadOnlyField label="食介" value={patient.mealAssistance} />
              <ReadOnlyField
                label="居室でお食事をされている方"
                value={patient.roomMeal}
              />
              <ReadOnlyField
                label="入浴介助時間"
                value={patient.bathAssistTime}
              />
              <ReadOnlyField
                label="入浴介助量"
                value={patient.bathAssistLevel}
              />
              <ReadOnlyField label="転倒歴の有無" value={patient.fallHistory} />
              <ReadOnlyField
                label="利用者評価"
                value={patient.userEvaluation}
              />
              <ReadOnlyField
                label="家族評価"
                value={patient.familyEvaluation}
              />
              <ReadOnlyField
                label="食形態（主食）"
                value={patient.mealTextureMain}
              />
              <ReadOnlyField
                label="食形態（副食）"
                value={patient.mealTextureSide}
              />
              <ReadOnlyField label="とろみ" value={patient.thickener} />
              <ReadOnlyField label="義歯の有無" value={patient.dentures} />
              <ReadOnlyField label="禁忌" value={patient.contraindication} />
              <ReadOnlyField label="アレルギー" value={patient.allergy} />
            </div>
          </div>

          {/* セクション8: 急変・終末期 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              急変・終末期
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="急変時" value={patient.emergencyResponse} />
              <ReadOnlyField
                label="急変時-備考"
                value={patient.emergencyResponseNotes}
              />
              <ReadOnlyField label="終末期" value={patient.endOfLife} />
              <ReadOnlyField
                label="終末期-備考"
                value={patient.endOfLifeNotes}
              />
              <ReadOnlyField
                label="慢性的な病態の悪化時"
                value={patient.chronicDeteriorationResponse}
              />
              <ReadOnlyField
                label="慢性的な病態の悪化時-備考"
                value={patient.chronicDeteriorationNotes}
              />
              <ReadOnlyField
                label="救急搬送希望"
                value={patient.emergencyTransportRequest}
              />
            </div>
          </div>

          {/* セクション9: 契約・その他 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">
              契約・その他
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <ReadOnlyField label="契約書" value={patient.contract} />
              <ReadOnlyField
                label="個人賠償保険期限"
                value={patient.personalLiabilityInsuranceExpiry}
              />
              <ReadOnlyField label="保険者" value={patient.insurer} />
              <ReadOnlyField
                label="住所地特例確認"
                value={patient.residenceSpecialException}
              />
              <ReadOnlyField
                label="郵便物 開封許可"
                value={patient.mailOpeningPermission}
              />
              <ReadOnlyField
                label="郵便物 開封許可-備考"
                value={patient.mailOpeningPermissionNotes}
              />
              <ReadOnlyField
                label="HitomeQケアサポート同意"
                value={patient.hitomeQConsent}
              />
              <ReadOnlyField
                label="ご家族の公式LINE使用"
                value={patient.familyLineUsage}
              />
              <ReadOnlyField
                label="肖像権の同意"
                value={patient.portraitRightsConsent}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
