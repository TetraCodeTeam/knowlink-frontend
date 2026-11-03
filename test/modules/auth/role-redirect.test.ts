import { describe, expect, it } from "vitest";
import { getRoleDestination } from "@/modules/auth/utils/role-redirect";

describe("getRoleDestination", () => {
  it("CP-001.09 - resuelve el destino de cada rol", () => {
    expect(getRoleDestination("STUDENT")).toBe("/student/home");
    expect(getRoleDestination("TUTOR")).toBe("/tutor/home");
    expect(getRoleDestination("ADMIN")).toBe("/admin/home");
  });
});
