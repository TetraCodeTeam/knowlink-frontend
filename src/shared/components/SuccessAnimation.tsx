import { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";

const SuccessLottie = lazy(() => import("./SuccessLottie"));

export function SuccessAnimation() {
  return (
    <Suspense
      fallback={
        <div style={{ width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={40} color="primary" />
        </div>
      }
    >
      <SuccessLottie />
    </Suspense>
  );
}

export function prefetchSuccessAnimation() {
  void import("./SuccessLottie");
}