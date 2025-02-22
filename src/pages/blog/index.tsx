import Link from "next/link";
import { getArticles } from "~/articles";
import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";

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
    <Layout pageClassName="box-list">
      <AnimatedItems>
        <div
          className="content"
          style={{ flexBasis: "100%", margin: "0 1rem" }}
        >
          <h1 style={{ marginBottom: 0, paddingBottom: "3rem" }}>
            <span>Blog</span>
          </h1>
          {/* <p style={{ paddingBottom: "3rem" }}>
            Here are some of my noteworthy projects that were mostly created in
            my spare time. You can also view all of them and more on my{" "}
            <a href="https://github.com/wyattades">github</a>.
          </p> */}
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

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .grid :global(.blog-card) {
          padding: 1rem;
          border: 1px solid var(--offset-color);
          border-radius: 0.5rem;
        }
      `}</style>
    </Layout>
  );
}
