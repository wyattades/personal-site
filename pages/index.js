import React, { useEffect, useState } from 'react';
import { useDebounce as useDebounceFn } from 'react-use';

import Layout from 'components/Layout';
import BlockText from 'components/LazyBlockText';
import { useHoveredLink } from 'components/Link';
import { useOutTransition } from 'components/AnimatedItems';

const useDebounced = (val, wait) => {
  const [v, setV] = useState(val);
  useDebounceFn(() => setV(val), wait, [val]);
  return v;
};

const IndexPage = () => {
  const outTransition = useOutTransition();
  useEffect(() => {
    outTransition?.onComplete?.();
  }, [outTransition]);

  const [hoveredLink] = useHoveredLink();

  const text = useDebounced(hoveredLink || 'WYATT', 600);

  return (
    <div className="layers">
      <BlockText text={text} />

      <div className="title-wrapper">
        <h1>Personal Site</h1>
      </div>

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
