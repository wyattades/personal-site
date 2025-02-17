import { useBox, useConeTwistConstraint, useSphere } from "@react-three/cannon";
import { createContext, createRef, useContext } from "react";

import { V } from "~/components/physics";

const parentCtx = createContext({
  ref: createRef(),
  pos: [0, 0, 0],
  offset: [0, 0, 0],
  rotation: [0, 0, 0],
});

const meshQuality = 4;

/** @returns {{ constraint: import('@react-three/cannon').ConeTwistConstraintOpts }} */
const getConstraintData = (parent, offset) => {
  return {
    pos: V.add(
      parent.pos,
      V.applyRotate(V.add(parent.offset, V.mult(offset, -1)), parent.rotation),
    ),
    rotation: parent.rotation,
    offset: V.mult(offset, -1),
    constraint: {
      pivotA: parent.offset,
      pivotB: offset,
      axisA: [0, 1, 0],
      axisB: [0, 1, 0],
      twistAngle: 0,
      angle: Math.PI / 8, // aperture angle of the cone
    },
  };
};

const ChainBall = ({ radius = 1, collisionFilterMask }) => {
  const p = useContext(parentCtx);

  const { constraint, pos, rotation } = getConstraintData(p, [0, radius, 0]);

  const [ref] = useSphere(() => ({
    args: [radius],
    mass: radius * 10,
    linearFactor: [1, 1, 0],
    position: pos,
    rotation,
    collisionFilterMask,
  }));

  useConeTwistConstraint(p.ref, ref, constraint);

  return (
    <mesh ref={ref} name="ChainBall">
      <sphereGeometry args={[radius, meshQuality * 4, meshQuality * 4]} />
      <meshStandardMaterial color="#666" />
    </mesh>
  );
};

const ChainLink = ({ children, chainSize, linkIndex, collisionFilterMask }) => {
  const p = useContext(parentCtx);

  const { constraint, pos, rotation, offset } = getConstraintData(p, [
    0,
    chainSize[1] / 2,
    0,
  ]);

  const [ref] = useBox(() => ({
    args: chainSize,
    mass: 2,
    position: pos,
    rotation,
    collisionFilterMask,
  }));

  useConeTwistConstraint(p.ref, ref, constraint);

  return (
    <>
      <group ref={ref} name="ChainLink">
        <mesh rotation={[0, linkIndex % 2 === 1 ? Math.PI / 2 : 0, 0]}>
          <torusBufferGeometry
            args={[
              chainSize[1] / 2 + chainSize[0],
              chainSize[0],
              meshQuality * 2,
              meshQuality * 4,
            ]}
            // args={[chainSize[0], chainSize[0], chainSize[1], 8]}
          />
          <meshStandardMaterial color="#888" />
        </mesh>
      </group>
      <parentCtx.Provider
        value={{
          ref,
          pos,
          offset,
          rotation,
        }}
      >
        {children}
      </parentCtx.Provider>
    </>
  );
};

const ChainLinks = ({ count = 0, children, ...rest }) => {
  let content = children;
  for (let i = 0; i < count; i++) {
    content = (
      <ChainLink {...rest} linkIndex={i}>
        {content}
      </ChainLink>
    );
  }
  return content;
};

const ChainHandle = ({
  children,
  position,
  radius = 1,
  startRotation = 0,
  collisionFilterMask,
}) => {
  const rotation = [0, 0, startRotation];

  const [ref] = useSphere(() => ({
    args: [radius],
    mass: 20, // high mass so constraint doesn't stretch
    type: "Dynamic",
    // angularDamping: 0.8, // rotational friction
    linearFactor: [0, 0, 0],
    angularFactor: [0, 0, 1], // only rotates along Z axis
    position,
    collisionFilterMask,
    rotation,
  }));

  const offset = [0, -radius, 0];

  return (
    <parentCtx.Provider value={{ ref, pos: position, rotation, offset }}>
      {children}
    </parentCtx.Provider>
  );
};

export const BallOnChain = ({
  position = [0, 0, 0],
  angle = 0,
  chainCount = 8,
  collisionFilterMasks: { handle = 0, chain = 0, ball = -1 } = {},
}) => {
  return (
    <ChainHandle
      position={position}
      startRotation={angle}
      collisionFilterMask={handle}
    >
      <ChainLinks
        count={chainCount}
        chainSize={[0.3, 2, 0.3]}
        collisionFilterMask={chain}
      >
        <ChainBall radius={3.5} collisionFilterMask={ball} />
      </ChainLinks>
    </ChainHandle>
  );
};
