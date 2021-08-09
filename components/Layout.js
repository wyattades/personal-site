import React from 'react';
import clsx from 'clsx';

import Nav from 'components/Nav';
import { PageTransition } from 'components/AnimatedItems';

const Layout = ({
  children,
  wrapperClassName,
  pageClassName,
  noLayout = false,
  seo = null,
}) => {
  return (
    <div className={clsx('wrapper', wrapperClassName)}>
      <PageTransition>
        <main className={clsx(!noLayout && 'page', pageClassName)}>
          {children}
        </main>
      </PageTransition>
      <Nav />
      {seo}
    </div>
  );
};

export default Layout;
