import { EMPTY_STATE_MESSAGE } from "@/modules/class-history/constants/classHistory.constants";
import FrankieEmptyState from "@/shared/frankie/FrankieEmptyState";

export default function ClassHistoryEmptyState() {
  return (
    <FrankieEmptyState
      fill
      mood="sleepy"
      size={240}
      title="Por acá está todo tranquilo"
      message={EMPTY_STATE_MESSAGE}
    />
  );
}
