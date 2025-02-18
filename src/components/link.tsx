import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { isValidElement } from "react";
import { createGlobalState } from "react-use/lib/factory/createGlobalState";

export { default as Link } from "next/link";

export const useHoveredLink = createGlobalState<string | null>(null);

const textContent = (r: React.ReactNode): string =>
  r == null
    ? ""
    : Array.isArray(r)
      ? r.map(textContent).join("")
      : typeof r === "string" || typeof r === "number"
        ? r.toString()
        : isValidElement(r)
          ? textContent((r.props as { children?: React.ReactNode }).children)
          : "";

export const NavLink: React.FC<{
  href: string;
  exact?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ href, exact, className, ...rest }) => {
  const router = useRouter();

  const active = exact
    ? router.pathname === href
    : router.pathname.startsWith(href);

  const [, setHoveredLink] = useHoveredLink();

  const linkText = textContent(rest.children);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHoveredLink(linkText)}
      onMouseLeave={() => setHoveredLink(null)}
      className={clsx(className, active && "active")}
      {...rest}
    />
  );
};

export const GoBackLink: React.FC<{ href: string }> = ({ href }) => {
  return (
    <Link className="go-back-link" href={href}>
      <span>←</span>
      <span className="sr-only">Go back</span>
    </Link>
  );
};
