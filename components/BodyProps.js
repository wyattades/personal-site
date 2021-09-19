import _ from 'lodash';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'react-use';

/*
 * Add attributes to `<body/>` during SSR and when page changes.
 * For now only supports `className`
 */

// just used for SSR
let activeProps = {};

const isNonEmptyObj = (obj) => _.isPlainObject(obj) && !_.isEmpty(obj);
const objJSON = {
  stringify: (obj) => {
    try {
      if (isNonEmptyObj(obj)) return JSON.stringify(obj);
    } catch {}
    return undefined;
  },
  parse: (str) => {
    try {
      if (typeof str === 'string' && str) {
        const obj = JSON.parse(str);
        if (isNonEmptyObj(obj)) return obj;
      }
    } catch {}
    return undefined;
  },
};

export const DocumentBody = ({ children }) => {
  const attrs = {
    ...activeProps,
    'data-ssr-props': objJSON.stringify(activeProps),
  };

  return <body {...attrs}>{children}</body>;
};

const getClassTokens = (...cls) => {
  const tokens = new Set();

  for (const cl of cls)
    if (cl) for (const c of cl.split(/\s+/)) if (c) tokens.add(c);

  return [...tokens].sort();
};

export const BodyProps = (props) => {
  if (typeof window === 'undefined') {
    if (props.className) {
      activeProps.className = getClassTokens(
        activeProps.className,
        props.className,
      ).join(' ');
    }
  }

  const first = useRef(true);
  useIsomorphicLayoutEffect(() => {
    if (first.current) {
      first.current = false;

      const ssrTokens = getClassTokens(
        objJSON.parse(document.body.dataset.ssrProps)?.className,
      );
      document.body.classList.remove(...ssrTokens);
      delete document.body.dataset.ssrProps;
    }

    // so we don't remove classes that were already active
    const toAdd = _.difference(
      getClassTokens(props.className),
      getClassTokens(document.body.className),
    );
    document.body.classList.add(...toAdd);
    return () => {
      document.body.classList.remove(...toAdd);
    };
  }, [props.className]);

  return null;
};
