import Lottie from "react-lottie-player";
import lottieJson from "../../../public/loading-animation.json";

export default function LoadingAnimation({ small }) {
  return (
    <div className="w-full flex justify-center">
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{
          width: small ? "8rem" : "80%",
          height: small ? "8rem" : "80%",
        }}
      />
    </div>
  );
}
