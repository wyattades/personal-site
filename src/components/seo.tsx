import Head from "next/head";
import {
  generateDefaultSeo,
  generateNextSeo,
  type DefaultSeoProps,
  type NextSeoProps,
} from "next-seo/pages";
import { useCanonicalUrl } from "~/lib/hooks";

export const DefaultSeo = (props: DefaultSeoProps) => {
  return <Head>{generateDefaultSeo(props)}</Head>;
};

export const NextSeo = (props: NextSeoProps) => {
  return <Head>{generateNextSeo(props)}</Head>;
};

/**
 * Emits `<link rel="canonical">` and `og:url` for whatever page is being
 * rendered. Mounted once in `_app`, so every route gets a self-referencing
 * canonical instead of every page claiming to be the site root.
 */
export const CanonicalUrl = () => {
  const url = useCanonicalUrl();

  return (
    <Head>
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
    </Head>
  );
};

export const JsonLd = ({
  id,
  data,
}: {
  id: string;
  data: Record<string, unknown>;
}) => (
  <Head>
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", ...data }),
      }}
    />
  </Head>
);
