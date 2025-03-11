/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Physics as CannonPhysics,
  usePlane,
  type PlaneProps,
  type Triplet,
} from "@react-three/cannon";
import type { PhysicsProviderProps } from "@react-three/cannon/dist/physics-provider";
import { createContext, useContext, useEffect } from "react";
import { useAsync, useKeyPressEvent, useLocalStorage } from "react-use";
import { Euler, Vector3 } from "three";

export const IS_DEV = process.env.NODE_ENV === "development";

const t0 = new Vector3(),
  t1 = new Vector3(),
  e0 = new Euler();
export const V = {
  add: (...vs: Triplet[]) => {
    const s: Triplet = [0, 0, 0];
    for (const v of vs) {
      s[0] += v[0];
      s[1] += v[1];
      s[2] += v[2];
    }
    return s;
  },
  mult: (vec: Triplet, scalar: number) =>
    t0
      .set(...vec)
      .multiplyScalar(scalar)
      .toArray(),
  dist: (a: Triplet, b: Triplet) => t0.set(...a).distanceTo(t1.set(...b)),
  applyRotate: (vec: Triplet, rot: Triplet) =>
    t0
      .set(...vec)
      .applyEuler(e0.set(...rot, "XYZ"))
      .toArray(),
};

export const useStats = (enabled = true) => {
  const res = useAsync(
    () => (enabled ? import("stats.js") : Promise.resolve(null)),
    [enabled],
  );
  const Stats = res.value?.default;

  useEffect(() => {
    if (!Stats) return;

    let mounted = true;

    // show FPS stats
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    const animate = () => {
      stats.update();
      if (mounted) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      mounted = false;
      stats.dom.remove();
    };
  }, [Stats]);
};

const debugCtx = createContext(false);

export const usePhysicsDebug = () => useContext(debugCtx);

export const FloorPlane: React.FC<PlaneProps & { size: Triplet }> = ({
  size,
  ...props
}) => {
  const [ref] = usePlane(() => props);

  const isDebug = usePhysicsDebug();

  if (isDebug)
    return (
      <mesh ref={ref}>
        <planeGeometry args={size} />
      </mesh>
    );

  return null;
};

const PhysicsDebug: React.FC<{ children: React.ReactNode }> = IS_DEV
  ? ({ children }) => {
      const [enabled, setEnabled] = useLocalStorage("physics-debug", false);

      useKeyPressEvent("d", () => {
        setEnabled(!enabled);
      });

      useStats(enabled);

      return enabled ? (
        <debugCtx.Provider value={enabled}>
          {/* @ts-ignore waiting for fix */}
          <PhysicsDebug color="#ff0000">{children}</PhysicsDebug>
        </debugCtx.Provider>
      ) : (
        children
      );
    }
  : (p) => p.children;

export const Physics: React.FC<
  PhysicsProviderProps & { children: React.ReactNode }
> = ({ children, ...rest }) => {
  return (
    // @ts-ignore waiting for fix
    <CannonPhysics {...rest}>
      <PhysicsDebug>{children}</PhysicsDebug>
    </CannonPhysics>
  );
};

export const debug = IS_DEV
  ? (...args: unknown[]) => console.debug("[debug]", ...args)
  : () => {};
