import React, { createContext, createRef, useContext } from 'react';
import { useBox, useConeTwistConstraint, useSphere } from '@react-three/cannon';

import { COLLIDERS, V } from 'components/physics';

const parentCtx = createContext({
  ref: createRef(),
  pos: [0, 0, 0],
  offset: [0, 0, 0],
  rotation: [0, 0, 0],
});

const collisionFilterMask = COLLIDERS.default;

const meshQuality = 4;

/** @returns {{ constraint: import('@react-three/cannon').ConeTwistConstraintOpts }} */
const getConstraintData = (parent, offset) => {
  const pos = V.add(
    parent.pos,
    V.applyRotate(parent.offset, parent.rotation),
    V.mult(V.applyRotate(offset, parent.rotation), -1),
  );

  return {
    pos,
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

const ChainBall = ({ radius = 1 }) => {
  const p = useContext(parentCtx);

  const { constraint, pos, rotation } = getConstraintData(p, [0, radius, 0]);

  const [ref] = useSphere(() => ({
    args: radius,
    mass: radius * 10,
    linearFactor: [1, 1, 0],
    position: pos,
    rotation,
    collisionFilterMask,
  }));

  useConeTwistConstraint(p.ref, ref, constraint);

  return (
    <mesh ref={ref} name="ChainBall">
      <sphereBufferGeometry args={[radius, meshQuality * 4, meshQuality * 4]} />
      <meshStandardMaterial color="#666" />
    </mesh>
  );
};

const ChainLink = ({ children, chainSize, linkIndex, collides = false }) => {
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
    collisionFilterMask: collides ? collisionFilterMask : 0,
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

const ChainHandle = ({ children, position, radius = 1, startRotation = 0 }) => {
  const rotation = [0, 0, startRotation];

  const [ref] = useSphere(() => ({
    mass: 20, // high mass so constraint doesn't stretch
    type: 'Dynamic',
    linearFactor: [0, 0, 0],
    angularFactor: [0, 0, 1],
    args: radius,
    position,
    collisionFilterMask: 0,
    // angularDamping: 0.8, // rotational friction
    rotation,
  }));

  const offset = [0, -radius, 0];

  return (
    <parentCtx.Provider value={{ ref, pos: position, rotation, offset }}>
      {children}
    </parentCtx.Provider>
  );
};

export const BallOnChain = ({ position, angle, chainCount }) => {
  return (
    <ChainHandle position={position} startRotation={angle}>
      <ChainLinks count={chainCount} chainSize={[0.3, 2, 0.3]}>
        <ChainBall radius={3.5} />
      </ChainLinks>
    </ChainHandle>
  );
};
