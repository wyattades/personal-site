import React, { useState } from 'react';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { useInterval } from 'react-use';

import { useReducedMotion } from 'lib/hooks';

export { TransitionGroup };

export const Fade = ({
  children,
  show = true,
  timeout = 500,
  toX = 0,
  toY = 0,
  unmount = false,
  disabled = false,
  ...rest
}) => {
  const transition = `opacity ${timeout}ms ease, transform ${timeout}ms ease`;

  const canInjectStyle = typeof children.type === 'string';

  return (
    <Transition
      {...rest}
      timeout={timeout}
      in={show || disabled}
      appear
      mountOnEnter={unmount}
      unmountOnExit={unmount}
    >
      {(state) => {
        const hide = state === 'exited' || state === 'exiting';
        const style =
          state === 'entered' || disabled
            ? undefined
            : {
                transition,
                opacity: hide ? 0 : 1,
                transform: hide ? `translate(${toX}px, ${toY}px)` : 'none',
              };

        if (canInjectStyle)
          return style
            ? React.cloneElement(children, {
                style: { ...children.props.style, ...style },
              })
            : children;

        return <div style={style}>{children}</div>;
      }}
    </Transition>
  );
};

const AnimatedItems = ({ children, dist = 12 }) => {
  const validChildren = React.Children.toArray(children).filter(
    (c) => c != null && c !== false,
  );

  const [animatedI, setAnimatedI] = useState(-1);
  useInterval(() => {
    if (animatedI < validChildren.length - 1) setAnimatedI((i) => i + 1);
  }, 100);

  const reducedMotion = useReducedMotion();

  return (
    <TransitionGroup component={null}>
      {validChildren.map((item, i) => {
        const left = item.props['data-animate-dir'] === 'left'; // only supporting 'left' for now

        return (
          <Fade
            key={i}
            show={animatedI >= i}
            toX={left ? -dist : 0}
            toY={left ? 0 : dist}
            disabled={reducedMotion}
          >
            {item}
          </Fade>
        );
      })}
    </TransitionGroup>
  );
};

export default AnimatedItems;
