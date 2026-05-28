import { useGameStore } from "../store/gameStore";

const eventSystem = {
  getAllEvents() {
    return events;
  },

  getEventById(id) {
    return events.find((event) => event.id === id);
  },

  // 현재 도시가 직면할 수 있는 활성화 가능한 이벤트 추출 (해금 구역 기반)
  getAvailableEvents() {
    const { unlockedRegions } = useGameStore.getState();
    return events.filter((event) => unlockedRegions.includes(event.region));
  },

  // 해금된 지역 내에서 무작위 이벤트 발생 및 스토어 등록
  triggerDailyEvent() {
    const store = useGameStore.getState();
    if (store.activeEvent) return store.activeEvent; // 이미 발생한 문제가 있다면 중복 방지

    const available = this.getAvailableEvents();
    if (available.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * available.length);
    const randomEvent = available[randomIndex];

    const activeEventPayload = {
      ...randomEvent,
      active: true,
      createdAt: new Date().toISOString(),
    };

    // 스토어의 현재 활성 이벤트로 셋팅
    store.setActiveEvent(activeEventPayload);
    return activeEventPayload;
  },
};

export default eventSystem;