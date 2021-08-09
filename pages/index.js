import React, { useState } from 'react';
import { useDebounce as useDebounceFn } from 'react-use';

import Layout from 'components/Layout';
import BlockText from 'components/LazyBlockText';
import { useHoveredLink } from 'components/Link';
import AnimatedItems, { useOutTransition } from 'components/AnimatedItems';

const useDebounced = (val, wait) => {
  const [v, setV] = useState(val);
  useDebounceFn(() => setV(val), wait, [val]);
  return v;
};

const IndexPage = () => {
  const outTransition = useOutTransition();

  const [hoveredLink] = useHoveredLink();

  let text = useDebounced(
    hoveredLink && hoveredLink !== 'Home' ? hoveredLink : 'WYATT',
    500,
  );
  if (outTransition) text = '';

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
        }
        h1 {
          margin-top: 250px;
          text-transform: uppercase;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

IndexPage.getLayout = ({ children }) => (
  <Layout wrapperClassName="index-page" noLayout noTransition>
    {children}
  </Layout>
);

export default IndexPage;
