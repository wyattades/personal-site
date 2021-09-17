import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Physics, useBox } from '@react-three/cannon';
import { Canvas, useFrame } from '@react-three/fiber';

import { withErrorBoundary } from 'components/ErrorBoundary';
import {
  PhysicsDebug,
  FloorPlane,
  IS_DEV,
  COLLIDERS,
} from 'components/physics';
// import { BallOnChain } from 'components/BallOnChain';

/** @returns {HTMLElement | null} */
const $ = (s, d) => (d ? s : document).querySelector(d || s);
/** @returns {HTMLElement[]} */
const $$ = (s, d) => Array.from((d ? s : document).querySelectorAll(d || s));

const scaleOut = 50;
const scaleIn = 1 / scaleOut;

const TWO_PI = 2 * Math.PI;

const ElementBody = ({ start, position, size, el }) => {
  const [_ref, api] = useBox(() => ({
    mass: 1,
    linearFactor: [1, 1, 0],
    angularFactor: [0, 0, 1],
    position,
    args: size,
  }));

  const tmp = useRef({ i: 0 });

  const updateStyles = () => {
    const [w, h] = size;
    const {
      p: [x, y],
      r: [, , r],
    } = tmp.current;

    el.style.transform = `translate(${(x - w / 2) * scaleOut - start.x}px, ${
      (y - h / 2) * -scaleOut - start.y
    }px) rotate(${TWO_PI - r}rad)`;
  };

  useEffect(() =>
    api.rotation.subscribe((r) => {
      tmp.current.r = r;
      if (tmp.current.p) updateStyles();
    }),
  );
  useEffect(() =>
    api.position.subscribe((p) => {
      tmp.current.p = p;
      if (tmp.current.r) updateStyles();
    }),
  );
  const hovered = useRef(null);
  useEffect(() => {
    const mouseEnter = () => {
      hovered.current = [0, 80, 0];
    };
    const mouseLeave = () => {
      hovered.current = null;
    };
    el.addEventListener('mouseenter', mouseEnter);
    el.addEventListener('mouseleave', mouseLeave);
    return () => {
      el.removeEventListener('mouseenter', mouseEnter);
      el.removeEventListener('mouseleave', mouseLeave);
    };
  }, []);
  useFrame(() => {
    if (hovered.current) {
      api.applyForce(hovered.current, [0, 1000, 0]);
    }
  });

  return null;
};

/**
 *
 * @param {HTMLElement} el
 * @param {number} depth
 */
const findFixedParent = (el, depth = 4) => {
  if (depth <= 0) return null;
  const parent = el.parentElement;
  if (!parent || parent === document.body) return null;
  if (window.getComputedStyle(parent).position === 'fixed') return parent;
  return findFixedParent(parent, depth - 1);
};

const HTMLPhysics = ({ selector = '.box-link' }) => {
  const [state, setState] = useState(null);

  const [size] = useState(() => {
    if (typeof document === 'undefined') return null;
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  });

  useEffect(() => {
    const { width: cw, height: ch } = size;

    const depth = 100 * scaleIn;

    // const preventDefault = (e) => e.preventDefault();

    let removeFixedEls = [];

    const els = $$(selector).map((el) => {
      el.classList.add('phys-body');

      // el.addEventListener('click', preventDefault);

      const { x, y, width: w, height: h } = el.getBoundingClientRect();

      const fixedParent = findFixedParent(el);

      const { clientHeight, scrollTop, scrollHeight } =
        document.documentElement;

      const scrollBottom = scrollHeight - scrollTop - clientHeight;

      const offsetY = fixedParent ? scrollTop + 140 : scrollBottom;

      if (fixedParent) removeFixedEls.push(fixedParent);

      return {
        el,
        start: { x, y: y - offsetY },
        position: [(x + w / 2) * scaleIn, (-y + offsetY + h / 2) * scaleIn, 0],
        size: [w * scaleIn, h * scaleIn, depth],
      };
    });

    removeFixedEls = _.uniq(removeFixedEls);
    for (const el of removeFixedEls) {
      // const { x, y } = el.getBoundingClientRect();
      // el.style.left = `${x}px`;
      // el.style.top = `${y}px`;
      // el.style.transform = `translate(${x}px, ${y}px)`;
      el.classList.add('phys-no-fixed');
    }

    const floors = [
      {
        position: [(cw * scaleIn) / 2, (-ch / 2) * scaleIn, 0],
        size: [cw * scaleIn, depth],
        rotation: [-Math.PI / 2, 0, 0],
      },
      {
        position: [0, (-ch * scaleIn) / 2, 0],
        size: [cw * scaleIn, depth],
        rotation: [-Math.PI / 2, Math.PI / 2, 0],
      },
      {
        position: [cw * scaleIn, (-ch * scaleIn) / 2, 0],
        size: [cw * scaleIn, depth],
        rotation: [-Math.PI / 2, -Math.PI / 2, 0],
      },
    ];

    setState({
      els,
      floors,
    });

    return () => {
      setState(null);
      for (const { el } of els) {
        el.classList.remove('phys-body');
        el.style.transform = '';
        // el.removeEventListener('click', preventDefault);
      }
      for (const el of removeFixedEls) el.classList.remove('phys-no-fixed');
    };
  }, []);

  if (!size) return null;

  // camera.updateProjectionMatrix();

  const cameraZ = 40;
  return (
    <Canvas
      camera={{
        position: [0, 0, cameraZ],
        // fov: 2 * Math.atan(100 / (2 * cameraZ)) * (180 / Math.PI),
      }}
      style={{
        visibility: IS_DEV ? 'visible' : 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {IS_DEV ? (
        <>
          <ambientLight intensity={0.5} />
          <pointLight position={[-10, -10, -10]} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
        </>
      ) : null}
      <Physics>
        <PhysicsDebug>
          {state?.els.map((props, i) => (
            <ElementBody key={i} {...props} />
          ))}
          {state?.floors.map((props, i) => (
            <FloorPlane
              key={i}
              {...props}
              collisionFilterGroup={COLLIDERS.boundary}
            />
          ))}
          {/* <BallOnChain /> */}
        </PhysicsDebug>
      </Physics>
      <style jsx global>{`
        .phys-body {
          position: relative;
          // border: 1px solid black;
        }
        .phys-no-fixed {
          position: absolute !important;
        }
      `}</style>
    </Canvas>
  );
};

export default React.memo(withErrorBoundary(HTMLPhysics, null));
