import { memo } from "react";

import { matchAll } from "~/lib/utils";

const withInliners = (str: string) => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const m of str.matchAll(/\[(.*?)\]\((.*?)\)/g)) {
    const before = str.substring(lastIndex, m.index);
    if (before) parts.push(before);
    parts.push(
      <a key={parts.length} href={m[2]}>
        {m[1]}
      </a>,
    );
    lastIndex = m.index + m[0].length;
  }
  if (str.length > lastIndex) parts.push(str.substring(lastIndex, str.length));
  return parts;
};

/**
 * Simple and buggy markdown implementation.
 * Supports: links, ordered-lists, unordered-lists, paragraphs
 */
export const Markdown = memo(function InnerMarkdown({
  children,
}: {
  children: string;
}) {
  if (typeof children !== "string" || children.length === 0) return null;

  return children
    .trim()
    .split(/\n{2,}/)
    .map((str, i) => {
      if (/^\s*-/.test(str)) {
        return (
          <ul key={i}>
            {matchAll(str, /^\s*-\s*(.*)/gm, (m, j) => {
              return <li key={j}>{withInliners(m[1]!)}</li>;
            })}
          </ul>
        );
      } else if (/^\s*\d+[.\s]/.test(str)) {
        return (
          <ol key={i}>
            {matchAll(str, /^\s*\d+[.\s]\s*(.*)/gm, (m, j) => {
              return <li key={j}>{withInliners(m[1]!)}</li>;
            })}
          </ol>
        );
      } else {
        return <p key={i}>{withInliners(str)}</p>;
      }
    });
});
