import { useState } from "react";
import { useDebounce as useDebounceFn } from "react-use";

import AnimatedItems, { useOutTransition } from "~/components/AnimatedItems";
import { BodyProps } from "~/components/BodyProps";
import Layout from "~/components/Layout";
import { useHoveredLink } from "~/components/Link";
import { BlockText } from "~/components/physicsImport";

const useDebounced = (val, wait) => {
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
