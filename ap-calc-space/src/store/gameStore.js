import { create } from "zustand";

export const useGameStore = create((set) => ({
  cityBudget: 1500,
  coins: 0,
  trafficLevel: 50,
  energyLevel: 50,
  weatherRisk: 50,
  activeEvent: null,
  unlockedRegions: [],
  completedMissions: [],
  isGameOver: false,
  gameOverType: null, // 'traffic' | 'energy' | 'weather'

  setMetrics: (updater) => set((state) => {
    const nextMetrics = typeof updater === "function" ? updater(state) : updater;

    const traffic = nextMetrics.trafficLevel ?? state.trafficLevel;
    const energy  = nextMetrics.energyLevel  ?? state.energyLevel;
    const weather = nextMetrics.weatherRisk  ?? state.weatherRisk;

    let gameOverType = state.gameOverType;
    let gameOverTriggered = state.isGameOver;

    if (!gameOverTriggered) {
      if (traffic >= 100) { gameOverTriggered = true; gameOverType = 'traffic'; }
      else if (energy >= 100) { gameOverTriggered = true; gameOverType = 'energy'; }
      else if (weather >= 100) { gameOverTriggered = true; gameOverType = 'weather'; }
    }

    return {
      ...nextMetrics,
      trafficLevel: Math.max(0, Math.min(100, traffic)),
      energyLevel:  Math.max(0, Math.min(100, energy)),
      weatherRisk:  Math.max(0, Math.min(100, weather)),
      isGameOver: gameOverTriggered,
      gameOverType,
    };
  }),

  setActiveEvent: (event) => set({ activeEvent: event }),
  clearActiveEvent: () => set({ activeEvent: null }),

  // rewardText("+3 Coin")에서 숫자 파싱해서 정확한 코인 지급
  unlockRegionInStore: (regionName, rewardText) => set((state) => {
    const match = rewardText?.match(/\+(\d+)/);
    const coinGain = match ? parseInt(match[1]) : 1;
    return {
      unlockedRegions: [...state.unlockedRegions, regionName],
      coins: state.coins + coinGain,
    };
  }),

  completeMissionInStore: (missionId) => set((state) => ({
    completedMissions: [...state.completedMissions, missionId],
  })),
}));