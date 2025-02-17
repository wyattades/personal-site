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
  LineSegments,
  MathUtils,
  Vector3,
  WireframeGeometry,
} from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

import { useAnimatedSwitch } from "~/components/AnimatedItems";
import { withErrorBoundary } from "~/components/ErrorBoundary";
import { debug, FloorPlane, IS_DEV, Physics } from "~/components/physics";

import fontJson from "fonts/helv.json";

const REMOVE_DURATION = 1000;
const SHOW_DURATION = 300;

const parsedFont = new FontLoader().parse(fontJson);

let seqIdCounter = 1;
const seqId = () => seqIdCounter++;

/** @param {THREE.Vector3} vec3 */
const r = new Vector3();
const initialInnerPos = (vec3) => {
  return r.set(0, 0, 7).add(vec3).toArray();
};

const Char = ({ char, textGeomConfig, pos, innerPos, size, animateIn }) => {
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
  const dev = useRef();
  if (IS_DEV && !dev.current) {
    const geometry = new BoxGeometry(...size.toArray());

    const wireframe = new WireframeGeometry(geometry);

    const line = new LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.color.setHex(0x777777);

    dev.current = line;
  }

  return (
    <group ref={ref}>
      <animated.mesh
        receiveShadow
        castShadow
        position={springs.innerPosAnimated}
      >
        <animated.meshNormalMaterial transparent opacity={springs.opacity} />
        <textGeometry args={[char, textGeomConfig]} />
      </animated.mesh>
      {dev.current ? <primitive object={dev.current} /> : null}
    </group>
  );
};

const Text = ({
  children,
  fontSize = 15,
  depth = 0.5,
  bevelThickness = 3,
  letterPadding = 3,
  animateIn,
  isInitial,
}) => {
  const letters = useMemo(() => {
    const arr = children.split("").map((char) => ({ char, id: seqId() }));

    let moveX = 0;
    let i = 0;
    for (const el of arr) {
      const glyph = parsedFont.data.glyphs[el.char];

      const { x_min, x_max, ha: _ha } = glyph;

      const width = ((x_max - x_min) / 1000) * fontSize;

      el.size = new Vector3(
        bevelThickness / 2 + width,
        bevelThickness / 2 + fontSize,
        2 * bevelThickness + depth,
      );

      const w2 = width / 2;
      el.innerPos = new Vector3(-w2, -fontSize / 2, 0);

      if (i > 0) moveX += letterPadding;
      moveX += w2;
      el.pos = new Vector3(moveX, 0, 0);

      moveX += w2;

      i++;
    }

    for (const el of arr) {
      el.pos.x -= moveX / 2;
    }

    return arr;
  }, [children]);

  const textGeomConfig = useMemo(
    () => ({
      font: parsedFont,
      size: fontSize,
      height: depth, // this is actually depth
      curveSegments: 16,
      bevelEnabled: true,
      bevelThickness,
      bevelSize: 0.75,
      bevelOffset: 0,
      bevelSegments: 4,
    }),
    [fontSize, depth, bevelThickness],
  );

  console.log("Text", { letters, animateIn, isInitial });

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

const SpringGroup = ({ children, changeKey }) => {
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

const Resizer = ({ parentRef }) => {
  const camera = useThree((state) => state.camera);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = parentRef.current;

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

const ExtendReactThree = () => {
  useMemo(() => extendReactThree({ TextGeometry }), []);

  return null;
};

const BlockText = ({ text }) => {
  const parentRef = useRef();
  const cameraRef = useRef();

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
          <Physics allowSleep step={1 / 30} gravity={[0, -20, 0]}>
            <SpringGroup changeKey={text}>
              <Text>{text}</Text>
            </SpringGroup>
            {/* this `y` is perfect for resting the letters on initially */}
            <FloorPlane
              size={[100, 100]}
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

export default memo(withErrorBoundary(BlockText, null));
