import { memo, useEffect, useRef } from "react";

import { FluidInit as createFluid } from "~/lib/fluid";

// const useEvent = (watcher, name, listener) => {
//   useEffect(() => {
//     watcher.addEventListener(name, listener);

//     return () => watcher.removeEventListener(name, listener);
//   }, [watcher, name, listener]);
// };

const Fluid_: React.FC<{
  getSplashInfo: (iteration: number) => {
    amount: number;
    timeout: number;
    moveAmount: number;
  };
}> = ({ getSplashInfo }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fluid = createFluid(canvasRef.current);

    let randomTimeoutId: NodeJS.Timeout | undefined;
    if (getSplashInfo) {
      let iteration = 0;
      const randomSplash = () => {
        const { amount, timeout, moveAmount } = getSplashInfo(iteration++);

        fluid.multipleSplats(amount, moveAmount);

        randomTimeoutId = setTimeout(randomSplash, timeout);
      };
      randomSplash();
    }

    return () => {
      if (randomTimeoutId) clearTimeout(randomTimeoutId);

      fluid.destroy();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} />
      <style jsx>{`
        canvas {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100vh;
          display: block;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};
export const Fluid = memo(Fluid_);
