import { animated, useSpring } from "@react-spring/three";
import { useBox } from "@react-three/cannon";
import { PerspectiveCamera } from "@react-three/drei";
import {
  Canvas,
  extend as extendReactThree,
  useThree,
} from "@react-three/fiber";
import {
  cloneElement,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useEvent } from "react-use";
import {
  BoxGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Vector3,
  WireframeGeometry,
  type PerspectiveCamera as PerspectiveCameraType,
} from "three";
import {
  FontLoader,
  TextGeometry,
  type TextGeometryParameters,
} from "three-stdlib";

import { useAnimatedSwitch } from "~/components/animated-items";
import { withErrorBoundary } from "~/components/error-boundary";
import { debug, FloorPlane, IS_DEV, Physics } from "~/components/physics";

import fontJson from "~/fonts/helv.json";

const REMOVE_DURATION = 1000;
const SHOW_DURATION = 300;

type FixedFontData = Omit<typeof fontJson, "glyphs"> & {
  glyphs: {
    [key in keyof (typeof fontJson)["glyphs"]]?: (typeof fontJson)["glyphs"][key] & {
      _cachedOutline: string[];
    };
  };
};

const parsedFont = new FontLoader().parse(fontJson as unknown as FixedFontData);

let seqIdCounter = 1;
const seqId = () => seqIdCounter++;

const r = new Vector3();
const initialInnerPos = (vec3: Vector3) => {
  return r.set(0, 0, 7).add(vec3).toArray();
};

const Char: React.FC<{
  char: string;
  textGeomConfig: TextGeometryParameters;
  pos: Vector3;
  innerPos: Vector3;
  size: Vector3;
  animateIn: boolean;
  isInitial: boolean; // unused
}> = ({ char, textGeomConfig, pos, innerPos, size, animateIn }) => {
  const [ref, boxApi] = useBox(() => ({
    mass: 1,
    position: pos.toArray(),
    args: size.toArray(),
  }));

  const [springs, _api] = useSpring(
    () => ({
      from: {
        opacity: animateIn ? 0 : 1,
        innerPosAnimated: initialInnerPos(innerPos),
      },
      to: {
        opacity: animateIn ? 1 : 0,
        innerPosAnimated: innerPos.toArray(),
      },
      config: {
        duration: animateIn ? SHOW_DURATION : REMOVE_DURATION,
        // precision: 0.001,
      },
    }),
    [char, animateIn],
  );

  const explodeLetter = (strength = 2) => {
    debug("explodeLetter", char);

    boxApi.applyImpulse(
      [
        MathUtils.randFloat(-20, 20),
        MathUtils.randFloat(-5, 0),
        MathUtils.randFloat(-35 * strength, -25 * strength),
      ],
      [MathUtils.randFloat(-4, 4), MathUtils.randFloat(-2, 1), 0],
    );
  };

  useLayoutEffect(() => {
    if (!animateIn) {
      const temp = ref.current.position.clone();
      temp.z -= 10;
      boxApi.position.set(...temp.toArray());
      explodeLetter();
    }
  }, [animateIn]);

  useEvent("click", () => {
    explodeLetter();
  });

  // show a box representing the letter's bounding box for debugging
  // TODO: somehow render this via JSX. the following doesn't work yet:
  // <animated.lineSegments position={innerPosAnimated}>
  //   <wireframeGeometry>
  //     <boxGeometry args={size.toArray()} />
  //   </wireframeGeometry>
  // </animated.lineSegments>;
  const dev = useRef<LineSegments>(null);
  if (IS_DEV && !dev.current) {
    const geometry = new BoxGeometry(...size.toArray());

    const wireframe = new WireframeGeometry(geometry);

    const line = new LineSegments(wireframe, new LineBasicMaterial());
    line.material.depthTest = false;
    line.material.color.setHex(0x777777);

    dev.current = line;
  }

  return (
    <group ref={ref}>
      {/* @ts-expect-error waiting for https://github.com/pmndrs/react-spring/pull/2349 */}
      <animated.mesh
        receiveShadow
        castShadow
        position={springs.innerPosAnimated}
      >
        {/* @ts-expect-error waiting for ^ */}
        <animated.meshNormalMaterial transparent opacity={springs.opacity} />
        <renamedTextGeometry args={[char, textGeomConfig]} />
        {/* @ts-expect-error waiting for ^ */}
      </animated.mesh>
      {dev.current ? <primitive object={dev.current} /> : null}
    </group>
  );
};

const Text: React.FC<{
  children: string;
  fontSize?: number;
  depth?: number;
  bevelThickness?: number;
  letterPadding?: number;
  animateIn?: boolean;
  isInitial?: boolean;
}> = ({
  children,
  fontSize = 15,
  depth = 0.5,
  bevelThickness = 3,
  letterPadding = 3,
  animateIn = false,
  isInitial = false,
}) => {
  const letters = useMemo(() => {
    let moveX = 0;

    const arr: {
      char: string;
      id: number;
      size: Vector3;
      pos: Vector3;
      innerPos: Vector3;
    }[] = children.split("").map((char, i) => {
      const glyph = fontJson.glyphs[char as keyof typeof fontJson.glyphs];
      if (!glyph) throw new Error(`Glyph not found for char: ${char}`);

      const width = ((glyph.x_max - glyph.x_min) / 1000) * fontSize;

      const size = new Vector3(
        bevelThickness / 2 + width,
        bevelThickness / 2 + fontSize,
        2 * bevelThickness + depth,
      );

      const w2 = width / 2;
      const innerPos = new Vector3(-w2, -fontSize / 2, 0);

      if (i > 0) moveX += letterPadding;
      moveX += w2;
      const pos = new Vector3(moveX, 0, 0);

      moveX += w2;

      return {
        char,
        id: seqId(),
        size,
        pos,
        innerPos,
      };
    });

    for (const el of arr) {
      el.pos.x -= moveX / 2;
    }

    return arr;
  }, [children, fontSize, depth, bevelThickness, letterPadding]);

  const textGeomConfig = useMemo(
    (): TextGeometryParameters => ({
      font: parsedFont,
      size: fontSize,
      height: depth, // this is actually depth
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.75,
      bevelOffset: 0,
      // bevelSegments: 4,
    }),
    [fontSize, depth, bevelThickness],
  );

  // console.log("Text", { letters, animateIn, isInitial });

  return (
    <group>
      {letters.map(({ id, char, pos, innerPos, size }) => (
        <Char
          key={id}
          char={char}
          pos={pos}
          innerPos={innerPos}
          size={size}
          animateIn={animateIn}
          isInitial={isInitial}
          textGeomConfig={textGeomConfig}
        />
      ))}
    </group>
  );
};

const SpringGroup: React.FC<{
  children: React.ReactElement<{
    animateIn: boolean;
    isInitial: boolean;
  }>;
  changeKey: string;
}> = ({ children, changeKey }) => {
  const stack = useAnimatedSwitch(changeKey, children, REMOVE_DURATION);

  return stack.map((s, i) =>
    cloneElement(s.children, {
      key: s.key,
      animateIn: i === 0,
      isInitial: s.isInitial,
      // onComplete: s.remove,
    }),
  );
};

const cameraZ = 190;

const Resizer: React.FC<{
  parentRef: React.RefObject<HTMLDivElement | null>;
}> = ({ parentRef }) => {
  const camera = useThree((state) => state.camera as PerspectiveCameraType);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = parentRef.current!;

    camera.aspect = w / h;

    const objectsWidth = 70; // should be close to `moveX`

    // Set FOV so letters fit in screen with some margin (20deg)
    const fov =
      20 +
      2 *
        Math.atan(objectsWidth / (camera.aspect * 2 * cameraZ)) *
        (180 / Math.PI);

    camera.fov = fov;
    camera.updateProjectionMatrix();
  };

  useEvent("resize", resize);

  useEffect(resize, [camera]);

  return null;
};

// TODO: why are we doing this inside a component?
const ExtendReactThree = () => {
  useMemo(() => extendReactThree({ RenamedTextGeometry: TextGeometry }), []);

  return null;
};

const EMPTY_Z = 0;

const BlockText_: React.FC<{ text: string }> = ({ text }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<PerspectiveCameraType>(null);

  return (
    <>
      <div
        ref={parentRef}
        style={{
          // Use min width and height to prevent webGL crash when size is 0
          minHeight: 10,
          minWidth: 10,
          maxWidth: 1600,
          margin: "0 auto",
        }}
      >
        {/* TODO: cool shadows + lights */}
        <Canvas>
          <ExtendReactThree />
          <Resizer parentRef={parentRef} />
          <group name="Camera" position={[0, 0, cameraZ]}>
            <PerspectiveCamera
              makeDefault
              far={3000}
              near={0.1}
              fov={42} // will be overridden by `<Resizer/>`
              ref={cameraRef}
            />

            {/* <directionalLight
              castShadow
              position={[10, 20, 15]}
              shadow-camera-right={8}
              shadow-camera-top={8}
              shadow-camera-left={-8}
              shadow-camera-bottom={-8}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              intensity={2}
              shadow-bias={-0.0001}
            /> */}
          </group>
          <ambientLight intensity={1} />
          {/* <ambientLight /> */}
          {/* <pointLight position={[10, 10, 10]} /> */}
          {/* <Suspense fallback={null}> */}
          {/* <Environment preset="city" /> doesn't do anything */}
          <Physics allowSleep stepSize={1 / 30} gravity={[0, -20, 0]}>
            <SpringGroup changeKey={text}>
              <Text>{text}</Text>
            </SpringGroup>
            {/* this `y` is perfect for resting the letters on initially */}
            <FloorPlane
              size={[100, 100, EMPTY_Z]}
              position={[0, -8.25, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </Physics>
          {/* </Suspense> */}
        </Canvas>
      </div>
      <h1 className="sr-only">{text}</h1>
    </>
  );
};

export const BlockText = memo(
  withErrorBoundary(
    BlockText_,
    IS_DEV
      ? ({ error }) => {
          console.error("BlockText error", error);
          return <p>Error: {error.message}</p>;
        }
      : null,
  ),
);
