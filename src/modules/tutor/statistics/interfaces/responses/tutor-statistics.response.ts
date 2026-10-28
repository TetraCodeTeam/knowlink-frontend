import type { CompensationType } from "@/modules/tutor/types/compensation-type.type";
import type { AvailabilityBand } from "@/modules/tutor/statistics/types/availability-band.type";
import type { DayOfWeek } from "@/modules/tutor/statistics/types/day-of-week.type";
import type { StatisticsPeriodType } from "@/modules/tutor/statistics/types/statistics-period.type";

export interface StatisticsPeriod {
  type: StatisticsPeriodType;
  from: string;
  to: string;
}

export interface StatisticsSummary {
  completedSessions: number;
  completedSessionsPreviousPeriod: number;
  /** Null cuando no hubo sesiones que llegaran a su horario. */
  fulfillmentRate: number | null;
  eligibleSessions: number;
  averageRating: number | null;
  reviewsCount: number;
  netIncome: number;
  commissionPercentage: number;
}

export interface MonthlySessions {
  /** yyyy-MM */
  month: string;
  completedSessions: number;
}

export interface UnheldSessions {
  cancelledByTutor: number;
  cancelledByStudent: number;
  /** Subconjunto de `cancelledByStudent` cuyo monto se acredita al tutor. */
  cancelledByStudentCredited: number;
  notHeld: number;
}

export interface FundsAmount {
  amount: number;
  sessions: number;
}

export interface FundsStatus {
  released: FundsAmount;
  pendingRelease: FundsAmount;
  withheldByClaim: FundsAmount;
  commissionPercentage: number;
}

export interface RatingBucket {
  stars: number;
  count: number;
}

export interface RatingDistribution {
  average: number | null;
  total: number;
  /** Siempre 5 elementos, de 5 a 1 estrellas. */
  buckets: RatingBucket[];
}

export interface StudentsStatistics {
  distinct: number;
  recurrent: number;
  recurrentPercentage: number;
  sessionsWithRecurrentStudents: number;
  sessionsWithNewStudents: number;
}

export interface OccupancyCell {
  dayOfWeek: DayOfWeek;
  band: AvailabilityBand;
  bookedHours: number;
  offeredHours: number;
  /** Null cuando la franja no tuvo horas ofrecidas (distinto de 0%). */
  percentage: number | null;
}

export interface Occupancy {
  bookedHours: number;
  offeredHours: number;
  percentage: number | null;
  cells: OccupancyCell[];
}

export interface SubjectPerformance {
  tutorSubjectId: string;
  subjectName: string;
  compensationType: CompensationType;
  pricePerHour: number | null;
  deactivated: boolean;
  completedSessions: number;
  averageRating: number | null;
  reviewsCount: number;
  distinctStudents: number;
  recurrentStudents: number;
  /** Null en materias gratuitas. */
  netIncome: number | null;
}

export interface TutorStatisticsResponse {
  period: StatisticsPeriod;
  hasActivity: boolean;
  summary: StatisticsSummary;
  monthlySessions: MonthlySessions[];
  unheldSessions: UnheldSessions;
  /** Null cuando el tutor solo ofrece materias gratuitas. */
  funds: FundsStatus | null;
  ratings: RatingDistribution;
  students: StudentsStatistics;
  occupancy: Occupancy;
  subjects: SubjectPerformance[];
}
