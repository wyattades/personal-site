import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Transition from 'react-transition-group/Transition';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { useInterval, useUpdate } from 'react-use';
import { useRouter } from 'next/router';

import { useReducedMotion } from 'lib/hooks';

export { TransitionGroup };

const OutTransition = createContext(null);
export const useOutTransition = () => useContext(OutTransition);

export const PageTransition = ({ children }) => {
  const { asPath: page } = useRouter();

  const counter = useRef(1);
  const stack = useRef([
    {
      key: 0,
      page,
      children,
    },
  ]);
  const first = stack.current[0];

  const removeKey = (key) => {
    const i = stack.current.findIndex((s) => s.key === key);
    if (i !== -1) {
      stack.current.splice(i, 1);
      update();
    }
  };

  if (first.page !== page) {
    stack.current.unshift({
      key: counter.current++,
      page,
      children,
    });
    const next = stack.current[1];
    next.timeout = setTimeout(() => {
      next.timeout = null;
      removeKey(next.key);
    }, 1000);
  }

  useEffect(
    () => () => {
      for (const s of stack.current) if (s.timeout) clearTimeout(s.timeout);
    },
    [],
  );

  const update = useUpdate();

  return (
    <div className="page-transition">
      {stack.current.map((s, i) => (
        <OutTransition.Provider
          key={s.key}
          value={
            i === 0
              ? null
              : {
                  onComplete: () => removeKey(s.key),
                }
          }
        >
          <div className={i === 0 ? undefined : 'page-transition-out'}>
            {s.children}
          </div>
        </OutTransition.Provider>
      ))}

      <style jsx>{`
        .page-transition {
          position: relative;
        }
        .page-transition-out {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          min-height: 70vh; // so page isn't cutoff while transitioning
          max-height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

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
  if (!children) return null;

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
                transition: `opacity ${timeout}ms ease, transform ${timeout}ms ease`,
                opacity: hide ? 0 : 1,
                transform: hide ? `translate(${toX}px, ${toY}px)` : 'none',
              };

        if (canInjectStyle)
          return style
            ? React.cloneElement(children, {
                style: children.props.style
                  ? { ...children.props.style, ...style }
                  : style,
              })
            : children;

        return <div style={style}>{children}</div>;
      }}
    </Transition>
  );
};

const AnimatedItems = ({ children, dist = 12 }) => {
  const outTransition = useOutTransition();

  const validChildren = React.Children.toArray(children).filter(
    (c) => c != null && c !== false,
  );

  const [animatedI, setAnimatedI] = useState(-1);
  useInterval(() => {
    if (outTransition && animatedI >= 0) {
      setAnimatedI(animatedI - 1);
    } else if (!outTransition && animatedI < validChildren.length - 1)
      setAnimatedI(animatedI + 1);
  }, 100);

  const reducedMotion = useReducedMotion();

  return (
    <>
      {validChildren.map((item, i) => {
        const left = item.props['data-animate-dir'] === 'left'; // only supporting 'left' for now

        return (
          <Fade
            key={i}
            show={
              outTransition
                ? animatedI > validChildren.length - i
                : animatedI >= i
            }
            toX={left ? -dist : 0}
            toY={left ? 0 : dist}
            disabled={reducedMotion}
          >
            {item}
          </Fade>
        );
      })}
    </>
  );
};

export default AnimatedItems;
