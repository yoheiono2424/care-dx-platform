export interface MealRecord {
  id: number;
  registeredAt: string;
  patientName: string;
  floor: string; // フロア
  mealContentPattern: string; // 食事内容パターン
  preMealAmount: number; // 食前の食事量
  foodResidue: number; // 食事残渣量
  mainDishIntake: number; // 食事摂取量-主食
  sideDishIntake: number; // 食事摂取量-副食
  intakePercentage: number; // 食事摂取割合
  waterAmount: number; // 水分量
  waterIntake: number; // 水分摂取量
  remarks: string; // 備考
}

// シード値を使った疑似乱数生成
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ダミーデータ生成関数
const generateMealData = (): MealRecord[] => {
  const patientNames = [
    '田中 太郎',
    '佐藤 花子',
    '鈴木 一郎',
    '高橋 美咲',
    '渡辺 健太',
    '伊藤 由美',
    '山本 博',
    '中村 さくら',
    '小林 誠',
    '加藤 愛子',
  ];

  const floors = ['1階', '2階', '3階'];

  const mealPatterns = ['通常食', '軟菜食', 'きざみ食', 'ミキサー食', '治療食'];

  const data: MealRecord[] = [];
  let id = 1;
  let seed = 98765;

  // 各利用者について、過去7日間 × 3食のデータを生成
  patientNames.forEach((name, patientIndex) => {
    for (let day = 6; day >= 0; day--) {
      // 朝食、昼食、夕食
      const meals = [
        { time: '08:00', type: '朝食' },
        { time: '12:00', type: '昼食' },
        { time: '18:00', type: '夕食' },
      ];

      meals.forEach((meal) => {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];

        // 食前の食事量: 400-600g
        const preMealAmount = Math.floor(seededRandom(seed++) * 200) + 400;

        // 食事残渣量: 0-150g
        const foodResidue = Math.floor(seededRandom(seed++) * 150);

        // 食事摂取量-主食: 50-100%
        const mainDishIntake = Math.floor(seededRandom(seed++) * 50) + 50;

        // 食事摂取量-副食: 50-100%
        const sideDishIntake = Math.floor(seededRandom(seed++) * 50) + 50;

        // 食事摂取割合: 主食と副食の平均
        const intakePercentage = Math.floor(
          (mainDishIntake + sideDishIntake) / 2
        );

        // 水分量: 200-400ml
        const waterAmount = Math.floor(seededRandom(seed++) * 200) + 200;

        // 水分摂取量: 水分量の60-100%
        const waterIntake = Math.floor(
          waterAmount * (0.6 + seededRandom(seed++) * 0.4)
        );

        // 備考: ランダムで生成
        const remarksOptions = [
          '完食',
          '少し残した',
          '食欲がない様子',
          '普通に摂取',
          '水分摂取を促した',
          '',
          '',
          '',
        ];
        const remarks =
          remarksOptions[
            Math.floor(seededRandom(seed++) * remarksOptions.length)
          ];

        data.push({
          id: id,
          registeredAt: `${dateStr} ${meal.time}`,
          patientName: name,
          floor: floors[patientIndex % 3],
          mealContentPattern:
            mealPatterns[
              Math.floor(seededRandom(seed++) * mealPatterns.length)
            ],
          preMealAmount: preMealAmount,
          foodResidue: foodResidue,
          mainDishIntake: mainDishIntake,
          sideDishIntake: sideDishIntake,
          intakePercentage: intakePercentage,
          waterAmount: waterAmount,
          waterIntake: waterIntake,
          remarks: remarks,
        });

        id++;
      });
    }
  });

  // 登録日時の降順でソート
  return data.sort(
    (a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
  );
};

export const mockMealData: MealRecord[] = generateMealData();
