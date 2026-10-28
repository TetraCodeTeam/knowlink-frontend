import Lottie from "lottie-react";
import tokenSuccess from "@/shared/assets/animations/token-success.json.json";

export default function SuccessLottie() {
  return (
    <Lottie
      animationData={tokenSuccess}
      loop={false}
      autoplay
      style={{ width: 140, height: 140 }}
    />
  );
}