"use client";

import clsx from "clsx";
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
} from "react";
import { useUpdate } from "react-use";

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

const ANIMATE_DIRS = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
} as const;
type AnimateDir = keyof typeof ANIMATE_DIRS;

const STAGGER_MS = 60;
/**
 * Cap on the stagger so long lists (the ~20-item projects grid) finish
 * revealing in under a second instead of trickling in for two.
 */
const MAX_STAGGER_STEPS = 8;

/**
 * Staggered entrance/exit for a page's top-level content.
 *
 * The animation is driven entirely by CSS `animation-delay` rather than a JS
 * timer, so the reveal clock starts at first paint instead of waiting for
 * React to hydrate. That keeps the largest element from being stuck at
 * `opacity: 0` while the bundle parses, which is what dominated LCP.
 */
export const AnimatedItems: React.FC<{
  children: React.ReactNode;
  dist?: number;
}> = ({ children, dist = 12 }) => {
  const outTransition = useOutTransition();

  const validChildren = ReactChildren.toArray(children).filter(isValidElement);

  return (
    <>
      {validChildren.map((item, i) => {
        const dir = (item.props as { ["data-animate-dir"]?: AnimateDir })[
          "data-animate-dir"
        ];

        const [ax, ay] = (dir && ANIMATE_DIRS[dir]) || ANIMATE_DIRS.down;

        const style = {
          "--animate-delay": `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`,
          "--animate-x": `${ax * dist}px`,
          "--animate-y": `${ay * dist}px`,
        } as React.CSSProperties;

        const className = clsx(
          "animated-item",
          outTransition && "animated-item--out",
        );

        if (canInjectStyle(item))
          return cloneElement(item, {
            key: i,
            className: clsx(item.props.className, className),
            style: item.props.style ? { ...item.props.style, ...style } : style,
          });

        return (
          <div key={i} className={className} style={style}>
            {item}
          </div>
        );
      })}
    </>
  );
};
