import { useRouter } from "next/router";
import {
  Children as ReactChildren,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Transition } from "react-transition-group";
import { useInterval, useUpdate } from "react-use";

import { useReducedMotion } from "~/lib/hooks";

const OutTransition = createContext(null);
export const useOutTransition = () => useContext(OutTransition);

export const useAnimatedSwitch = (value, children, removeDelay = 1000) => {
  const update = useUpdate();

  const counter = useRef(1);
  const stack = useRef([
    {
      key: 0,
      value,
      children,
      isInitial: true,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      remove: () => removeKey(0),
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

  if (first.value !== value) {
    const key = counter.current++;
    stack.current.unshift({
      key,
      value,
      children,
      remove: () => removeKey(key),
    });
    const next = stack.current[1];
    next.timeout = setTimeout(() => {
      next.timeout = null;
      next.remove();
    }, removeDelay);
  }

  useEffect(
    () => () => {
      for (const s of stack.current) if (s.timeout) clearTimeout(s.timeout);
    },
    [],
  );

  return stack.current;
};

export const PageTransition = ({ children }) => {
  const { asPath: page } = useRouter();

  const stack = useAnimatedSwitch(page, children);

  return (
    <div className="page-transition">
      {stack.map((s, i) => (
        <OutTransition.Provider
          key={s.key}
          value={
            i === 0
              ? null
              : {
                  onComplete: s.remove,
                }
          }
        >
          <div className={i === 0 ? undefined : "page-transition-out"}>
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
  const nodeRef = useRef();

  if (!children) return null;

  const canInjectStyle = typeof children.type === "string";

  return (
    <Transition
      {...rest}
      timeout={timeout}
      in={show || disabled}
      appear
      mountOnEnter={unmount}
      unmountOnExit={unmount}
      nodeRef={nodeRef}
    >
      {(state) => {
        const hide = state === "exited" || state === "exiting";
        const style =
          state === "entered" || disabled
            ? undefined
            : {
                transition: `opacity ${timeout}ms ease, transform ${timeout}ms ease`,
                opacity: hide ? 0 : 1,
                transform: hide ? `translate(${toX}px, ${toY}px)` : "none",
              };

        if (canInjectStyle)
          return style
            ? cloneElement(children, {
                ref: nodeRef,
                style: children.props.style
                  ? { ...children.props.style, ...style }
                  : style,
              })
            : children;

        return (
          <div style={style} ref={nodeRef}>
            {children}
          </div>
        );
      }}
    </Transition>
  );
};

const ANIMATE_DIRS = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};

const AnimatedItems = ({ children, dist = 12 }) => {
  const outTransition = useOutTransition();

  const validChildren = ReactChildren.toArray(children).filter(
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
        const dir = item.props["data-animate-dir"];

        const [ax, ay] = (dir && ANIMATE_DIRS[dir]) || ANIMATE_DIRS.down;

        return (
          <Fade
            key={i}
            show={
              outTransition
                ? animatedI > validChildren.length - i
                : animatedI >= i
            }
            toX={ax * dist}
            toY={ay * dist}
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
