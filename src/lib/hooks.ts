import { useRouter } from "next/router";

const HOST_URL = process.env.HOST_URL!;

/**
 * Absolute URL of the current page with any query string or hash stripped,
 * for use as `<link rel="canonical">` and `og:url`.
 */
export const useCanonicalUrl = () => {
  const { asPath } = useRouter();

  const pathname = asPath.split(/[?#]/)[0]!.replace(/\/+$/, "");

  return HOST_URL + pathname;
};
