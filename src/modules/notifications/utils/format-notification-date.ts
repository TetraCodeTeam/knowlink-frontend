const formatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatNotificationDate(createdAt: string): string {
  return formatter.format(new Date(createdAt));
}
