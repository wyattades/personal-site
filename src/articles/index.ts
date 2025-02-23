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
  const requireFn = require.context("~/pages/blog", true, /^\.\/.*\.mdx$/);
  return Promise.all(
    requireFn.keys().map(async (path) => {
      const mod: ArticleImport = await requireFn(path);
      const slug = path.replace(/^.*[\\/]/, "").replace(/\.mdx$/, "");
      if (!mod.metadata?.title)
        throw new Error(`No metadata found for ${path}`);

      return { slug, metadata: mod.metadata };
    }),
  );
};
