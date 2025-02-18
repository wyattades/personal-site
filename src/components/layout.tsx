import clsx from "clsx";

import { PageTransition } from "~/components/animated-items";
import { Nav } from "~/components/nav";

export const Layout: React.FC<{
  children: React.ReactNode;
  wrapperClassName?: string;
  pageClassName?: string;
  noLayout?: boolean;
  seo?: React.ReactNode;
  outsideTransition?: React.ReactNode;
}> = ({
  children,
  wrapperClassName,
  pageClassName,
  noLayout = false,
  // following 2 props are useful if we want things to unmount immediately on page change
  seo = null,
  outsideTransition = null,
}) => {
  return (
    <div className={clsx("wrapper", wrapperClassName)}>
      <PageTransition>
        <main className={clsx(!noLayout && "page", pageClassName)}>
          {children}
        </main>
      </PageTransition>
      <Nav />
      {seo}
      {outsideTransition}
    </div>
  );
};
