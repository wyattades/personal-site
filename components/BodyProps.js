import { useIsomorphicLayoutEffect } from 'react-use';

/*
 * Add attributes to `<body/>` during SSR and when page changes.
 * For now only supports `className`
 */

let activeProps = null;

export const DocumentBody = ({ children }) => {
  return <body {...(activeProps || {})}>{children}</body>;
};

export const BodyProps = ({ className }) => {
  activeProps = {
    className,
  };

  // this code assumes we don't use `BodyProps` with the same `className` multiple times!
  useIsomorphicLayoutEffect(() => {
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, [className]);

  return null;
};
