/** Los límites reflejan los del backend (CommunityConstants / application.yaml). */
export const TITLE_MAX_LENGTH = 150;
export const HELP_REQUEST_MAX_LENGTH = 500;
export const SHARED_CONTENT_MAX_LENGTH = 2000;
export const REPLY_MAX_LENGTH = 2000;
export const BOOKING_QUESTION_MAX_LENGTH = 150;
export const DEFAULT_BOOKING_QUESTION = "¿Necesitás más ayuda con este tema?";

export const ATTACHMENT_MAX_MB = 5;
export const ATTACHMENT_MAX_BYTES = ATTACHMENT_MAX_MB * 1024 * 1024;
export const ATTACHMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png,.xlsx";
export const ATTACHMENT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "xlsx"] as const;

export const TOP_RANKING_SIZE = 10;

export const FEED_PAGE_SIZE = 10;
export const MY_POSTS_PAGE_SIZE = 10;

/** La comunidad es única por facultad; todavía no hay un catálogo de facultades en el backend. */
export const FACULTY_LABEL = "UTN Facultad Regional Villa María";

export const COMMUNITY_STALE_TIME_MS = 30_000;
