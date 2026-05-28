import regions from "../dataset/regions";
import upgrades from "../dataset/upgrades";
import { useGameStore } from "../store/gameStore";

const unlockSystem = {
  // 스토어 예산 상태를 기준으로 실시간 지역 해금 현황 매핑 데이터 반환
  getRegionStatusList() {
    const { cityBudget, unlockedRegions } = useGameStore.getState();

    return regions.map((region) => {
      // 이미 해금 목록에 있거나, 예산 기준을 충족하면 unlocked True 처리
      const isUnlocked = unlockedRegions.includes(region.name) ||
                         cityBudget >= (region.unlockRequirement || 0);

      return {
        ...region,
        unlocked: isUnlocked,
      };
    });
  },

  // 현재 예산으로 즉시 구매 가능한 인프라 업그레이드 필터링
  getAffordableUpgrades() {
    const { cityBudget } = useGameStore.getState();
    return upgrades.filter((upgrade) => cityBudget >= upgrade.cost);
  },

  // 플레이어가 대시보드나 상점에서 인프라 업그레이드를 클릭했을 때 실행
  executePurchaseUpgrade(upgrade) {
    const store = useGameStore.getState();

    // 예산 차감 및 인프라 버프 효과 적용
    let trafficBuff = upgrade.category === "traffic" ? -15 : 0;
    let energyBuff = upgrade.category === "energy" ? -15 : 0;

    store.setMetrics((state) => ({
      cityBudget: state.cityBudget - upgrade.cost,
      trafficLevel: state.trafficLevel + trafficBuff,
      energyLevel: state.energyLevel + energyBuff
    }));

    // 인프라 구매 이력을 완료 미션 배열 등에 스트링 키값으로 저장
    store.completeMissionInStore(`infrastructure_${upgrade.id}`);

    return { success: true, message: `[${upgrade.name}] 배치가 완료되었습니다.` };
  },
};

export default unlockSystem;