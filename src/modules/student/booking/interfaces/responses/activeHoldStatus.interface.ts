import { ActiveHoldResponse } from "@/modules/student/booking/interfaces/responses/activeHold.interface";

export interface ActiveHoldStatusResponse {
  hasActiveHold: boolean;
  hold: ActiveHoldResponse | null;
}