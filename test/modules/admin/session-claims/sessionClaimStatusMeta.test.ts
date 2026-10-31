import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_CLAIM_STATUS_META } from "@/modules/admin/session-claims/constants/claim-status-meta";

describe("ADMIN_SESSION_CLAIM_STATUS_META", () => {
  it("traduce los tres estados de ClaimStatus con su tono y acento", () => {
    expect(ADMIN_SESSION_CLAIM_STATUS_META.OPEN.label).toBe("Pendiente");
    expect(ADMIN_SESSION_CLAIM_STATUS_META.OPEN.tone).toBe("warning");
    expect(ADMIN_SESSION_CLAIM_STATUS_META.IN_REVIEW.label).toBe("En revisión");
    expect(ADMIN_SESSION_CLAIM_STATUS_META.IN_REVIEW.tone).toBe("info");
    expect(ADMIN_SESSION_CLAIM_STATUS_META.RESOLVED.label).toBe("Resuelto");
    expect(ADMIN_SESSION_CLAIM_STATUS_META.RESOLVED.tone).toBe("success");
  });

  it("define un color de franja para cada estado", () => {
    Object.values(ADMIN_SESSION_CLAIM_STATUS_META).forEach((meta) => {
      expect(meta.accent).toMatch(/^#/);
    });
  });
});