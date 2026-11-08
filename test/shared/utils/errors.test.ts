import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { getErrorMessage, isRatingRequiredError } from "@/shared/utils/errors";

function axiosError(status: number, data: Record<string, unknown> = {}): AxiosError {
  const response = {
    status,
    statusText: "",
    headers: {},
    config: {} as never,
    data,
  } as AxiosResponse;

  return new AxiosError("request failed", "ERR_BAD_RESPONSE", undefined, undefined, response);
}

describe("isRatingRequiredError", () => {
  it("detecta un 423 con el codigo RATING_REQUIRED", () => {
    expect(isRatingRequiredError(axiosError(423, { detail: "RATING_REQUIRED" }))).toBe(true);
  });

  it("ignora un 423 sin el codigo esperado", () => {
    expect(isRatingRequiredError(axiosError(423, { detail: "OTRO_MOTIVO" }))).toBe(false);
    expect(isRatingRequiredError(axiosError(423))).toBe(false);
  });

  it("ignora el codigo RATING_REQUIRED en un estado distinto de 423", () => {
    expect(isRatingRequiredError(axiosError(422, { detail: "RATING_REQUIRED" }))).toBe(false);
    expect(isRatingRequiredError(axiosError(409, { detail: "RATING_REQUIRED" }))).toBe(false);
  });

  it("ignora errores que no provienen de axios", () => {
    expect(isRatingRequiredError(new Error("boom"))).toBe(false);
    expect(isRatingRequiredError(null)).toBe(false);
    expect(isRatingRequiredError(undefined)).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("prioriza el mensaje del backend", () => {
    expect(getErrorMessage(axiosError(500, { message: "Falla del servidor" }), "fallback")).toBe(
      "Falla del servidor"
    );
  });

  it("usa el fallback cuando no hay respuesta", () => {
    expect(getErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });
});
