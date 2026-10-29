import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import VolumeDistributionBar from "@/modules/admin/home/components/VolumeDistributionBar";

describe("VolumeDistributionBar", () => {
  it("muestra los porcentajes y la leyenda del diseño", () => {
    render(<VolumeDistributionBar split={{ claimsPct: 58, reportsPct: 42 }} />);

    expect(screen.getByText("Distribución de volumen operativo")).toBeInTheDocument();
    expect(screen.getByText("Reclamos de sesiones")).toBeInTheDocument();
    expect(screen.getByText("Denuncias de material")).toBeInTheDocument();
    expect(screen.getByText("58%")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("expone la distribución como una imagen accesible", () => {
    render(<VolumeDistributionBar split={{ claimsPct: 58, reportsPct: 42 }} />);

    expect(
      screen.getByRole("img", {
        name: /reclamos de sesiones 58%.*denuncias de material 42%/i,
      })
    ).toBeInTheDocument();
  });

  it("normaliza una distribución cuya suma no es 100", () => {
    render(<VolumeDistributionBar split={{ claimsPct: 50, reportsPct: 25 }} />);

    expect(screen.getByText("66.7%")).toBeInTheDocument();
    expect(screen.getByText("33.3%")).toBeInTheDocument();
  });

  it("no rompe cuando no hay volumen", () => {
    render(<VolumeDistributionBar split={{ claimsPct: 0, reportsPct: 0 }} />);

    expect(screen.getAllByText("0%")).toHaveLength(2);
  });
});
