import Link from "next/link";
import { getArticles } from "~/articles";
import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { NextSeo } from "~/components/seo";

export const getStaticProps = async () => {
  return {
    props: {
      articles: await getArticles(),
    },
  };
};

export default function BlogIndexPage({
  articles,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout
      pageClassName="box-list"
      seo={
        <NextSeo
          title="Blog"
          description="Essays on engineering, tooling, and the meta-problems of building things — written by Wyatt Ades."
        />
      }
    >
      <AnimatedItems>
        <div className="content" style={{ flexBasis: "100%" }}>
          <h1 style={{ marginBottom: 0 }}>
            <span>Blog</span>
          </h1>
          <p style={{ paddingBottom: "3rem" }}>
            Occasional writing about engineering challenges, the tools I build
            to get around them, and the meta-problems — motivation, taste,
            knowing when something is done — that turn out to be the hard part.
          </p>
        </div>

        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="BoxLink"
          >
            <div
              className="BoxLink--bg-image content"
              style={{
                position: "absolute",
                inset: "10px",
                fontSize: "16px",
                fontWeight: "normal",
                color: "var(--offset-color)",
              }}
            >
              {article.metadata.excerpt}
            </div>
            <span>
              <span>{article.metadata.title}</span>
              <span className="date">{article.metadata.publishedAt}</span>
            </span>
          </Link>
        ))}
      </AnimatedItems>

      <style jsx>{`
        span.date {
          color: var(--offset-color);
        }
      `}</style>
    </Layout>
  );
}
