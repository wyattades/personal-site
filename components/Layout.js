import clsx from 'clsx';

import Nav from 'components/Nav';
import { PageTransition } from 'components/AnimatedItems';

const Layout = ({
  children,
  wrapperClassName,
  pageClassName,
  noLayout = false,
  // following 2 props are useful if we want things to unmount immediately on page change
  seo = null,
  outsideTransition = null,
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
      {outsideTransition}
    </div>
  );
};

export default Layout;
