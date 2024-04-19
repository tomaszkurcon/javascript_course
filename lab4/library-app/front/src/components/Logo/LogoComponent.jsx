import { useEffect, useRef } from "react";
import { createLogo } from "./logo";

const LogoComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      createLogo(canvas);
    }
  }, []);

  return (
    <canvas id="canvas" width="45" height="45" ref={canvasRef}>
      {`Wygląda na to, że twoja przeglądarka nie obsługuje elementu "canvas"`}
    </canvas>
  );
};

export default LogoComponent;
