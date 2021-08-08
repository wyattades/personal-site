import React from 'react';
import clsx from 'clsx';
// import { useRouter } from 'next/router';

import Nav from 'components/Nav';
// import { Fade, TransitionGroup } from 'components/AnimatedItems';

const Layout = ({
  children,
  wrapperClassName,
  pageClassName,
  noLayout = false,
}) => {
  // const router = useRouter();

  return (
    <div className={clsx('wrapper', wrapperClassName)}>
      <main>
        {/* <TransitionGroup component={null}>
          <Fade key={router.asPath} timeout={500} unmount> */}
        <div className={clsx(!noLayout && 'page')}>
          <div className={pageClassName}>{children}</div>
        </div>
        {/* </Fade>
        </TransitionGroup> */}
      </main>
      <Nav />
    </div>
  );
};

export default Layout;
