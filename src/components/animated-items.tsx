"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import React, {
  Children as ReactChildren,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Transition } from "react-transition-group";
import { useInterval, useUpdate } from "react-use";

import { useReducedMotion } from "~/lib/hooks";

const OutTransition = createContext<{
  onComplete: () => void;
} | null>(null);
export const useOutTransition = () => useContext(OutTransition);

export const useAnimatedSwitch = <Children extends React.ReactElement>(
  value: string,
  children: Children,
  removeDelay = 1000,
) => {
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
      timeout: null as NodeJS.Timeout | null,
    },
  ]);
  const first = stack.current[0]!;

  const removeKey = (key: number) => {
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
      isInitial: false,
      remove: () => removeKey(key),
      timeout: null,
    });
    const next = stack.current[1]!;
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

export const PageTransition: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
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

function canInjectStyle(
  children: React.ReactNode,
): children is React.ReactHTMLElement<HTMLElement> {
  return (
    isValidElement(children) &&
    (typeof children.type === "string" || children.type === Link)
  );
}

export const Fade: React.FC<{
  children: React.ReactNode;
  show?: boolean;
  timeout?: number;
  toX?: number;
  toY?: number;
  unmount?: boolean;
  disabled?: boolean;
}> = ({
  children,
  show = true,
  timeout = 500,
  toX = 0,
  toY = 0,
  unmount = false,
  disabled = false,
  ...rest
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  if (!children) return null;

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

        if (canInjectStyle(children))
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
} as const;
type AnimateDir = keyof typeof ANIMATE_DIRS;

export const AnimatedItems: React.FC<{
  children: React.ReactNode;
  dist?: number;
}> = ({ children, dist = 12 }) => {
  const outTransition = useOutTransition();

  const validChildren = ReactChildren.toArray(children).filter(isValidElement);

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
        const dir = (item.props as { ["data-animate-dir"]?: AnimateDir })[
          "data-animate-dir"
        ];

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
