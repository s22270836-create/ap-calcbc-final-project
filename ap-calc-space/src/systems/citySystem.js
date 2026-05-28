import { useGameStore } from "../store/gameStore";

const citySystem = {
  // 실제 교통 데이터를 기반으로 혼잡도 점수(0~100) 계산
  // 데이터셋의 총 차량 수가 많을수록 점수가 낮아지므로 이를 반전시켜 혼잡도(Level)로 변환
  updateTrafficMetrics(trafficData) {
    const totalCars = trafficData.reduce((sum, item) => sum + item.cars, 0);
    // 차량 수에 따른 유연한 혼잡도 계산 (예시 공식)
    const calculatedTrafficLevel = Math.min(100, Math.floor(totalCars / 50));

    // 글로벌 스토어에 즉시 반영
    useGameStore.getState().setMetrics({ trafficLevel: calculatedTrafficLevel });
    return calculatedTrafficLevel;
  },

  // 에너지 예비율 데이터를 기반으로 스토어의 에너지 안정성 갱신
  updateEnergyMetrics(energyData) {
    const avgReserveRate = energyData.reduce((sum, item) => sum + item.reserveRate, 0) / energyData.length;
    const calculatedEnergyLevel = Math.min(100, Math.floor(avgReserveRate));

    useGameStore.getState().setMetrics({ energyLevel: calculatedEnergyLevel });
    return calculatedEnergyLevel;
  },

  // 날씨 데이터를 분석하여 위험도 반영
  updateWeatherRisk(weatherData) {
    const highRainDays = weatherData.filter((day) => day.afternoon.rainChance >= 60);
    // 위험 기상 일수에 따른 가중치 산정 (최대 100)
    const calculatedRisk = Math.min(100, highRainDays.length * 15);

    useGameStore.getState().setMetrics({ weatherRisk: calculatedRisk });
    return calculatedRisk;
  },

  // 현재 스토어의 실시간 상태를 기반으로 도시 종합 보고서 생성
  generateCityReport() {
    const { trafficLevel, energyLevel, weatherRisk } = useGameStore.getState();

    return {
      // 레벨 기반이므로 상태 조건 반전 (지표가 낮을수록 안정적인 교통인 경우 등 조절 가능)
      trafficStatus: trafficLevel <= 40 ? "STABLE" : "CONGESTED",
      energyStatus: energyLevel >= 50 ? "STABLE" : "WARNING",
      weatherStatus: weatherRisk >= 45 ? "HIGH RISK" : "SAFE",
    };
  },
};

export default citySystem;