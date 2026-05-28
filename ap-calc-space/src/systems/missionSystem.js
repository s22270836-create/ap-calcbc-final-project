import missionData from "../dataset/missions";
import { useGameStore } from "../store/gameStore";

// unit 문자열에서 숫자 추출: "Unit 3: ..." → 3
const extractUnitNumber = (unitStr) => parseInt(unitStr?.match(/\d+/)?.[0] || 0);

// 단원별 도메인 매핑
const getDomainByUnit = (unitNumber) => {
  if ([2, 4, 9, 17].includes(unitNumber)) return 'traffic';
  if ([1, 5, 6, 13, 14].includes(unitNumber)) return 'energy';
  if ([7, 8, 10, 15, 16, 18, 19, 20].includes(unitNumber)) return 'weather';
  return 'energy'; // fallback
};

// 단원별 난이도 라벨
const getDifficulty = (unitNumber) => {
  if (unitNumber <= 3) return 'EASY';
  if (unitNumber <= 6) return 'NORMAL';
  if (unitNumber <= 8) return 'HARD';
  return 'EXPERT';
};

// 단원별 보상 금액
const getReward = (unitNumber) => {
  if (unitNumber <= 3) return 100;
  if (unitNumber <= 6) return 200;
  if (unitNumber <= 8) return 300;
  return 400;
};

const missionSystem = {
  getAllMissions() {
    return missionData.map((m) => {
      const unitNumber = extractUnitNumber(m.unit);
      return {
        ...m,
        unitNumber,
        domain: getDomainByUnit(unitNumber),
        difficulty: getDifficulty(unitNumber),
        reward: getReward(unitNumber),
      };
    });
  },

  getMissionById(id) {
    return this.getAllMissions().find((m) => m.id === id);
  },

  // 정답 판별: solution 문자열에 유저 입력이 포함되는지 체크 (trim, 소문자)
  checkAnswer(mission, userInput) {
    if (!userInput) return false;
    const normalizedSolution = mission.solution.toLowerCase().replace(/\s/g, '');
    const normalizedInput = userInput.toLowerCase().replace(/\s/g, '');
    // 숫자만 추출해서 비교 (근삿값 포함 대응)
    const solutionNumbers = normalizedSolution.match(/-?\d+\.?\d*/g) || [];
    const inputNumbers = normalizedInput.match(/-?\d+\.?\d*/g) || [];
    if (solutionNumbers.length > 0 && inputNumbers.length > 0) {
      return solutionNumbers.some((sn) =>
        inputNumbers.some((inp) => Math.abs(parseFloat(sn) - parseFloat(inp)) < 0.1)
      );
    }
    return normalizedSolution.includes(normalizedInput);
  },

  completeMission(missionId, isCorrect) {
    const store = useGameStore.getState();
    const mission = this.getMissionById(missionId);
    if (!mission) return;

    const delta = isCorrect ? -10 : 10;

    const trafficDelta = mission.domain === 'traffic' ? delta : 0;
    const energyDelta = mission.domain === 'energy' ? delta : 0;
    const weatherDelta = mission.domain === 'weather' ? delta : 0;

    store.setMetrics((state) => ({
      cityBudget: isCorrect
        ? state.cityBudget + mission.reward
        : Math.max(0, state.cityBudget - 50),
      trafficLevel: Math.max(0, Math.min(100, state.trafficLevel + trafficDelta)),
      energyLevel: Math.max(0, Math.min(100, state.energyLevel + energyDelta)),
      weatherRisk: Math.max(0, Math.min(100, state.weatherRisk + weatherDelta)),
    }));

    if (isCorrect) {
      store.completeMissionInStore(missionId);
      store.clearActiveEvent();
    }
  },
};

export default missionSystem;