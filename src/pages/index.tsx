import { useState } from "react";
import { useDebounce as useDebounceFn } from "react-use";

import { AnimatedItems, useOutTransition } from "~/components/animated-items";
import { BodyProps } from "~/components/body-props";
import { Layout } from "~/components/layout";
import { useHoveredLink } from "~/components/link";
import { BlockText } from "~/components/physics-import";

const useDebounced = <T,>(val: T, wait: number) => {
  const [v, setV] = useState(val);
  useDebounceFn(() => setV(val), wait, [val]);
  return v;
};

const IndexPage = () => {
  const outTransition = useOutTransition();

  const [hoveredLink] = useHoveredLink();

  let text = useDebounced(
    hoveredLink && hoveredLink !== "Home" ? hoveredLink : "WYATT",
    200,
  );
  if (outTransition) text = "";

  return (
    <div className="layers">
      <BlockText text={text} />

      <AnimatedItems>
        <div className="title-wrapper">
          <h1>Personal Site</h1>
        </div>
      </AnimatedItems>

      <style jsx>{`
        .title-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }
        h1 {
          margin-top: 250px;
          text-transform: uppercase;
          text-align: center;
          pointer-events: all;
        }
      `}</style>
    </div>
  );
};

IndexPage.getLayout = ({ children }) => (
  <Layout noLayout outsideTransition={<BodyProps className="index-page" />}>
    {children}
  </Layout>
);

export default IndexPage;
