export function normalizeBlocks(
  blocks: { date: string; startTime: string; endTime: string }[]
): string {
  return blocks
    .map((b) => `${b.date}|${b.startTime}|${b.endTime}`)
    .sort()
    .join(",");
}

export function getEarliestSelectableTime(): Date {
  const now = new Date();
  const THIRTY_MIN_MS = 30 * 60 * 1000;
  return new Date(Math.ceil(now.getTime() / THIRTY_MIN_MS) * THIRTY_MIN_MS);
}
