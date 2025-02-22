// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type ArticleImport = typeof import("~/pages/blog/first-newsletter.mdx");

export const getArticles = async () => {
  const requireFn = require.context("~/pages/blog", true, /^\.\/.*\.mdx$/);
  return Promise.all(
    requireFn.keys().map(async (path) => {
      const mod = (await requireFn(path)) as ArticleImport;
      const slug = path.replace(/^.*[\\/]/, "").replace(/\.mdx$/, "");
      if (!mod.metadata?.title)
        throw new Error(`No metadata found for ${path}`);

      return { slug, metadata: mod.metadata };
    }),
  );
};
