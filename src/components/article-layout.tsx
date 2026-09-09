import type { ArticleMetadata } from "~/articles";
import { Layout } from "~/components/layout";
import { JsonLd, NextSeo } from "~/components/seo";
import { useCanonicalUrl } from "~/lib/hooks";

/**
 * Wrapper for MDX articles under `pages/blog`. MDX files export a `metadata`
 * object for the blog index; this feeds the same object to `<head>` so each
 * article gets its own title, description and Article markup.
 */
export const ArticleLayout: React.FC<{
  metadata: ArticleMetadata;
  children: React.ReactNode;
}> = ({ metadata, children }) => {
  const url = useCanonicalUrl();

  return (
    <Layout
      pageClassName="content"
      seo={
        <>
          <NextSeo
            title={metadata.title}
            description={metadata.excerpt}
            openGraph={{
              type: "article",
              title: metadata.title,
              description: metadata.excerpt,
              article: {
                publishedTime: new Date(metadata.publishedAt).toISOString(),
                authors: ["https://wyattades.com/about"],
              },
            }}
          />
          <JsonLd
            id="article-jsonld"
            data={{
              "@type": "BlogPosting",
              headline: metadata.title,
              description: metadata.excerpt,
              datePublished: metadata.publishedAt,
              mainEntityOfPage: url,
              url,
              author: {
                "@type": "Person",
                name: "Wyatt Ades",
                url: "https://wyattades.com",
              },
            }}
          />
        </>
      }
    >
      {children}
    </Layout>
  );
};
