import { describe, expect, it } from "vitest";
import { adminQueryKeys } from "@/modules/admin/constants/admin-query-keys";

describe("adminQueryKeys", () => {
  it("incluye el rango en la clave del resumen", () => {
    expect(adminQueryKeys.dashboard("MONTH")).toEqual(["admin", "dashboard", "summary", "MONTH"]);
    expect(adminQueryKeys.dashboard("WEEK")).not.toEqual(adminQueryKeys.dashboard("MONTH"));
  });

  it("permite invalidar todo el dashboard desde una clave base", () => {
    expect(adminQueryKeys.dashboard("WEEK").slice(0, 2)).toEqual([...adminQueryKeys.dashboardBase]);
  });

  it("expone una clave propia para los badges del sidebar", () => {
    expect(adminQueryKeys.navigationBadges).toEqual(["admin", "navigation", "badges"]);
  });

  it("cuelga todas las claves del prefijo admin", () => {
    expect(adminQueryKeys.all).toEqual(["admin"]);
    expect(adminQueryKeys.dashboardBase.slice(0, 1)).toEqual([...adminQueryKeys.all]);
  });
});
