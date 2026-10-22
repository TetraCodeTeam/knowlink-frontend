import { httpClient } from "@/shared/lib/httpClient";
import type {
  TutorSupportData,
  TutorSupportDto,
} from "@/modules/support/interfaces/responses/tutor-support.response";
import { mapTutorSupport } from "@/modules/support/utils/supportMappers.utils";

export async function getTutorSupport(): Promise<TutorSupportData> {
  const response = await httpClient.get<TutorSupportDto>("/api/v1/tutors/support");
  return mapTutorSupport(response.data);
}
