import type { MDXContent } from "mdx/types";

type ArticleImport = {
  default: MDXContent;
  metadata: {
    title: string;
    publishedAt: DateString;
    excerpt?: string;
  };
};

export const getArticles = async () => {
  // NOTE: must be a relative path; Turbopack's `require.context` does not
  // resolve the `~/*` tsconfig alias, and silently returns zero matches.
  const requireFn = require.context("../pages/blog", true, /^\.\/.*\.mdx$/);
  const paths = requireFn.keys() as string[];

  return Promise.all(
    paths.map(async (path) => {
      const mod: ArticleImport = await requireFn(path);
      const slug = path.replace(/^.*[\\/]/, "").replace(/\.mdx$/, "");
      if (!mod.metadata?.title)
        throw new Error(`No metadata found for ${path}`);

      return { slug, metadata: mod.metadata };
    }),
  );
};
