export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;

    return Date.now() >= (payload.exp as number) * 1000;
  } catch {
    return true;
  }
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}
