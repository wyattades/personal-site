import { type Triplet, useBox } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import * as _ from "lodash-es";
import React, { memo, useEffect, useRef, useState } from "react";
import { createPortal as creatReactPortal } from "react-dom";
import { PerspectiveCamera, Vector3 } from "three";
import { frameCorners as frameCameraCorners } from "three/examples/jsm/utils/CameraUtils.js";

import { BallOnChain } from "~/components/ball-on-chain";
import { withErrorBoundary } from "~/components/error-boundary";
import { FloorPlane, Physics } from "~/components/physics";
import { $$, findFixedParent } from "~/lib/utils/html";

const COLLISION_GROUPS = {
  all: 0xffffffff,
  default: 1 << 0,
  boundary: 1 << 1,
};

const scaleOut = 50;
const scaleIn = 1 / scaleOut;

const TWO_PI = 2 * Math.PI;

// is `true` on modern browsers
// const supportsSubPixels = (() => {
//   const $testWrap = document.createElement('div');

//   $testWrap.innerHTML =
//     '<div style="width: 4px; height: 2px; position: absolute; right: 0; bottom: 0;">' +
//     '<div id="subpixel-layout-1" style="width: 2.5px; height: 1px; float: left;"></div>' +
//     '<div id="subpixel-layout-2" style="width: 2.5px; height: 1px; float: left;"></div>' +
//     '</div>';

//   document.body.appendChild($testWrap);

//   const supported =
//     document.getElementById('subpixel-layout-1').getBoundingClientRect().top !==
//     document.getElementById('subpixel-layout-2').getBoundingClientRect().top;

//   $testWrap.remove();

//   return supported;
// })();

// fast rounding to nearest 1 digit
const roundPixelNum = (number: number) => {
  return ((number * 10) | 0) * 0.1;
};
// fast rounding to nearest 3 digits
const roundAngleNum = (number: number) => {
  return ((number * 1000) | 0) * 0.001;
};

const ElementBody: React.FC<{
  start: { x: number; y: number };
  position: Triplet;
  size: Triplet;
  el: HTMLElement;
}> = ({ start, position, size, el }) => {
  const [_ref, bodyApi] = useBox(() => ({
    mass: 1,
    linearFactor: [1, 1, 0],
    angularFactor: [0, 0, 1],
    position,
    args: size,
    allowSleep: true,
  }));

  const tmp = useRef<{ i: number; r?: Triplet; p?: Triplet }>({ i: 0 });

  const [w, h] = size;
  const updateStyles = () => {
    if ((tmp.current.i++ & 2) === 0) return;

    const p = tmp.current.p!;
    const r = tmp.current.r!;

    const x = (p[0] - w * 0.5) * scaleOut - start.x,
      y = (p[1] - h * 0.5) * -scaleOut - start.y,
      angle = r[0] === 0 && r[1] === 0 ? TWO_PI - r[2] : TWO_PI + r[2];

    el.style.transform = `translate(${roundPixelNum(x)}px, ${roundPixelNum(
      y,
    )}px) rotate(${roundAngleNum(angle)}rad)`;
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

const FullPageCanvas: React.FC<{
  children: React.ReactNode;
  hide?: boolean;
  style?: React.CSSProperties;
}> = ({ children, hide, ...rest }) => {
  // make sure never this is never rendered server-side!
  const [{ camera, style }] = useState(() => {
    const viewBounds = getViewBounds();

    const cam = new PerspectiveCamera();
    // @ts-expect-error `manual` is not typed???
    cam.manual = true; // tell `@react-three/fiber` not to update our camera
    cam.position.z = 500; // give a arbitrarily far camera z so scene looks more orthographic
    frameCameraCorners(
      cam,
      viewBounds.bottomLeft,
      viewBounds.bottomRight,
      viewBounds.topLeft,
      true,
    );
    // `cam.updateProjectionMatrix()` should not be called after this!
    // for debugging:
    // cam.updateProjectionMatrix = () => {
    //   throw new Error('Not allowed');
    // };

    return {
      camera: cam,
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
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              width: 100,
              height: 100,
              overflow: "hidden",
              visibility: "hidden",
              zIndex: -1000,
            }
          : {
              position: "absolute",
              pointerEvents: "none",
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

type ElState = {
  el: HTMLElement;
  start: { x: number; y: number };
  position: Triplet;
  size: Triplet;
};
type FloorState = {
  position: Triplet;
  size: Triplet;
  rotation: Triplet;
};

const HTMLPhysics_ = ({
  selector = ".box-link, .content > p, .content > h1 > span, .plain-button",
}) => {
  const [state, setState] = useState<{
    els: ElState[];
    floors: FloorState[];
    viewBounds: {
      x: number;
      y: number;
      width: number;
      height: number;
      bottomLeft: Vector3;
      bottomMiddle: Vector3;
      bottomRight: Vector3;
      topLeft: Vector3;
    };
  } | null>(null);

  useEffect(() => {
    const depth = 100 * scaleIn;

    let removeFixedEls: HTMLElement[] = [];

    const { scrollTop, scrollHeight } = document.documentElement;

    document.body.classList.add("phys__overflow-hidden");

    const els: ElState[] = $$(selector).map((el) => {
      if (window.getComputedStyle(el).display === "inline")
        el.classList.add("phys__inline-block");

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
      el.classList.add("phys__no-fixed");
    }

    const viewBounds = getViewBounds();

    const minWidth = 30;
    const floorsWidth = Math.max(minWidth, viewBounds.width);
    const floorsExtraX = (floorsWidth - viewBounds.width) / 2;

    const EMPTY_Z = 0;

    const floors: FloorState[] = [
      {
        position: viewBounds.bottomMiddle.toArray(),
        size: [floorsWidth, depth, EMPTY_Z],
        rotation: [-Math.PI / 2, 0, 0],
      },
      {
        position: viewBounds.bottomLeft
          .clone()
          .setX(viewBounds.bottomLeft.x - floorsExtraX)
          .toArray(),
        size: [viewBounds.height, depth, EMPTY_Z],
        rotation: [-Math.PI / 2, Math.PI / 2, 0],
      },
      {
        position: viewBounds.bottomRight
          .clone()
          .setX(viewBounds.bottomRight.x + floorsExtraX)
          .toArray(),
        size: [viewBounds.height, depth, EMPTY_Z],
        rotation: [-Math.PI / 2, -Math.PI / 2, 0],
      },
    ];

    setState({
      els,
      floors,
      viewBounds,
    });

    return () => {
      setState(null);

      for (const { el } of els) {
        el.classList.remove("phys__inline-block");

        el.style.transform = "";
      }

      for (const el of removeFixedEls) {
        el.classList.remove("phys__absolute");
      }

      document.body.classList.remove("phys__overflow-hidden");
    };
  }, [selector]);

  if (!state) return null;

  return (
    <FullPageCanvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 0, 10]} />

      <Physics>
        {state.els.map((props, i) => (
          <ElementBody key={i} {...props} />
        ))}
        {state.floors.map((props, i) => (
          <FloorPlane
            key={i}
            {...props}
            collisionFilterGroup={COLLISION_GROUPS.boundary}
          />
        ))}

        <BallOnChain
          angle={-Math.PI / 2}
          position={[-1, state.viewBounds.bottomMiddle.y + 32, 0]} // BallOnChain with 10 links is roughly 30 units tall
          chainCount={10}
          collisionFilterMasks={{
            ball: COLLISION_GROUPS.all & ~COLLISION_GROUPS.boundary, // don't collide ball with boundaries
          }}
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

export const HTMLPhysics = memo(withErrorBoundary(HTMLPhysics_, null));
