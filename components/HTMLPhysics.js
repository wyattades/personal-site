import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal as creatReactPortal } from 'react-dom';
import { PerspectiveCamera, Vector3 } from 'three';
import { frameCorners as frameCameraCorners } from 'three/examples/jsm/utils/CameraUtils';
import { useBox } from '@react-three/cannon';
import { Canvas } from '@react-three/fiber';

import { withErrorBoundary } from 'components/ErrorBoundary';
import { Physics, FloorPlane, COLLIDERS } from 'components/physics';
import { BallOnChain } from 'components/BallOnChain';
import { $$, findFixedParent } from 'lib/utils/html';

const scaleOut = 50;
const scaleIn = 1 / scaleOut;

const TWO_PI = 2 * Math.PI;

const ElementBody = ({ start, position, size, el }) => {
  const [_ref, bodyApi] = useBox(() => ({
    mass: 1,
    linearFactor: [1, 1, 0],
    angularFactor: [0, 0, 1],
    position,
    args: size,
    allowSleep: true,
  }));

  const tmp = useRef({ i: 0 });

  const [w, h] = size;
  const updateStyles = () => {
    if ((tmp.current.i++ & 2) === 0) return;

    const { p, r } = tmp.current;

    el.style.transform = `translate(${
      (p[0] - w * 0.5) * scaleOut - start.x
    }px, ${(p[1] - h * 0.5) * -scaleOut - start.y}px) rotate(${
      r[0] === 0 && r[1] === 0 ? TWO_PI - r[2] : TWO_PI + r[2]
    }rad)`;
  };

  useEffect(() =>
    bodyApi.rotation.subscribe((r) => {
      tmp.current.r = r;
      if (tmp.current.p) updateStyles();
    }),
  );
  useEffect(() =>
    bodyApi.position.subscribe((p) => {
      tmp.current.p = p;
      if (tmp.current.r) updateStyles();
    }),
  );

  return null;
};

const getViewBounds = (scale = scaleIn) => {
  const { clientWidth: cw, clientHeight: ch } = document.body;

  // const offsetX = cw * ((1 - 1 / zoomOutScale) / 2);
  // const ox = offsetX * scale;

  const w = cw * scale,
    h = ch * scale;
  const w2 = w / 2,
    h2 = h / 2;

  return {
    x: 0,
    y: 0,
    width: w,
    height: h,
    bottomLeft: new Vector3(0, -h2, 0),
    bottomMiddle: new Vector3(w2, -h2, 0),
    bottomRight: new Vector3(w, -h2, 0),
    topLeft: new Vector3(0, h2, 0),
  };
};

const FullPageCanvas = ({ children, hide, ...rest }) => {
  // make sure never this is never rendered server-side!
  const [{ camera, style }] = useState(() => {
    const viewBounds = getViewBounds();

    const camera = new PerspectiveCamera();
    camera.position.z = 500; // give a arbitrarily far camera z so scene looks more orthographic
    frameCameraCorners(
      camera,
      viewBounds.bottomLeft,
      viewBounds.bottomRight,
      viewBounds.topLeft,
      true,
    );

    return {
      camera,
      style: {
        width: viewBounds.width * scaleOut,
        height: viewBounds.height * scaleOut,
        left: viewBounds.x * scaleOut,
        top: viewBounds.y * scaleOut,
      },
    };
  });

  return creatReactPortal(
    <Canvas
      camera={camera}
      style={
        hide
          ? {
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              width: 100,
              height: 100,
              overflow: 'hidden',
              visibility: 'hidden',
              zIndex: -1000,
            }
          : {
              position: 'absolute',
              pointerEvents: 'none',
              ...style,
            }
      }
      {...rest}
    >
      {children}
    </Canvas>,
    document.body,
  );
};

const HTMLPhysics = ({
  selector = '.box-link, .content > p, .content > h1 > span, .plain-button',
}) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    const depth = 100 * scaleIn;

    let removeFixedEls = [];

    const { scrollTop, scrollHeight } = document.documentElement;

    document.body.classList.add('phys__overflow-hidden');

    const els = $$(selector).map((el) => {
      if (window.getComputedStyle(el).display === 'inline')
        el.classList.add('phys__inline-block');

      const fixedParent = findFixedParent(el);
      if (fixedParent) removeFixedEls.push(fixedParent);

      const { x, y, width: w, height: h } = el.getBoundingClientRect();

      const py = y + scrollTop - scrollHeight / 2 + h;

      return {
        el,
        start: { x, y: py + (fixedParent ? -scrollTop : 0) },
        position: [(x + w / 2) * scaleIn, (-py + h / 2) * scaleIn, 0],
        size: [w * scaleIn, h * scaleIn, depth],
      };
    });

    removeFixedEls = _.uniq(removeFixedEls);
    for (const el of removeFixedEls) {
      el.classList.add('phys__no-fixed');
    }

    const viewBounds = getViewBounds();

    const isSmall = document.documentElement.clientWidth < 1150;
    const extraX = isSmall ? 8 : 0;
    const floors = [
      {
        position: viewBounds.bottomMiddle.toArray(),
        size: [viewBounds.width, depth],
        rotation: [-Math.PI / 2, 0, 0],
      },
      {
        position: viewBounds.bottomLeft
          .clone()
          .setX(viewBounds.bottomLeft.x - extraX)
          .toArray(),
        size: [viewBounds.width, depth],
        rotation: [-Math.PI / 2, Math.PI / 2, 0],
      },
      {
        position: viewBounds.bottomRight
          .clone()
          .setX(viewBounds.bottomRight.x + extraX)
          .toArray(),
        size: [viewBounds.width, depth],
        rotation: [-Math.PI / 2, -Math.PI / 2, 0],
      },
    ];

    setState({
      els,
      floors,
      isSmall,
    });

    return () => {
      setState(null);

      for (const { el } of els) {
        el.classList.remove('phys__inline-block');

        el.style.transform = '';
      }

      for (const el of removeFixedEls) {
        el.classList.remove('phys__absolute');
      }

      document.body.classList.remove('phys__overflow-hidden');
    };
  }, []);

  if (!state) return null;

  return (
    <FullPageCanvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 0, 10]} />

      <Physics>
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

        <BallOnChain
          angle={-Math.PI / 2}
          position={[-1, state?.isSmall ? -10 : 12, 0]}
          chainCount={10}
        />
      </Physics>

      <style jsx global>{`
        .phys__overflow-hidden {
          overflow: hidden !important;
        }
        .phys__inline-block {
          display: inline-block !important;
        }
        .phys__absolute {
          position: absolute !important;
        }
      `}</style>
    </FullPageCanvas>
  );
};

export default React.memo(withErrorBoundary(HTMLPhysics, null));
