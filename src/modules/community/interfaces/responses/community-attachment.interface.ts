export interface CommunityAttachment {
  fileName: string;
  contentType: string;
  sizeInBytes: number;
  /** URL firmada y temporal; es null si el storage no pudo firmarla. */
  url: string | null;
}
