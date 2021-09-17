import Stats from 'stats.js';
import { useEffect } from 'react';
import { Debug, usePlane } from '@react-three/cannon';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const COLLIDERS = {
  default: 1,
  boundary: 2,
};

export const V = {
  add: (...vs) => {
    const s = [0, 0, 0];
    for (const v of vs) {
      s[0] += v[0];
      s[1] += v[1];
      s[2] += v[2];
    }
    return s;
  },
  mult: (a, v) => [a[0] * v, a[1] * v, a[2] * v],
};

export const useStats = () => {
  useEffect(() => {
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
  }, []);
};

export const FloorPlane = ({ size, ...props }) => {
  const [ref, _api] = usePlane(() => props);

  if (IS_DEV)
    return (
      <mesh ref={ref}>
        <planeBufferGeometry args={size} />
      </mesh>
    );

  return null;
};

export const PhysicsDebug = IS_DEV
  ? ({ children, enabled = true }) => {
      useStats();

      return enabled ? <Debug color="#ff0000">{children}</Debug> : children;
    }
  : (p) => p.children;

export const debug = IS_DEV
  ? (...args) => console.debug('[debug]', ...args)
  : () => {};
