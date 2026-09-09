import {
  Code as CodeIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
} from "lucide-react";
import type { GetStaticProps } from "next";
import Image from "next/image";

import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { GoBackLink } from "~/components/link";
import { Markdown } from "~/components/markdown";
import { PlaySketch } from "~/components/play-sketch";
import { JsonLd, NextSeo } from "~/components/seo";
import { projects, type ProjectItem } from "~/lib/projects";

export const getStaticProps: GetStaticProps = async ({
  params: { project_id } = {},
}) => {
  const project = projects.find((p) => p.id === project_id);

  if (!project)
    return {
      notFound: true,
    };

  return {
    props: {
      project,
    },
  };
};

export const getStaticPaths = async () => {
  return {
    paths: projects.map((p) => ({
      params: { project_id: p.id },
    })),
    fallback: false,
  };
};

type Props = {
  project: ProjectItem;
};

const META_DESC_MAX = 155;

/** Flatten a markdown `desc` into a plain-text meta description. */
const toMetaDescription = (desc: ProjectItem["desc"]) => {
  if (typeof desc !== "string") return undefined;

  const text = desc
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> their label
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= META_DESC_MAX) return text;

  return text.slice(0, text.lastIndexOf(" ", META_DESC_MAX)) + "…";
};

const ShowProjectPageInner: React.FC<Props> = ({ project }) => {
  const {
    title,
    desc,
    download,
    url,
    source,
    image,
    imageW,
    imageH,
    imageBlurDataURL,
    hideImage,
  } = project;

  const isNPM = !!url?.includes("npmjs.com");

  const description = toMetaDescription(desc);

  return (
    <>
      <NextSeo
        title={`${title} Project`}
        description={description}
        openGraph={{
          title: `${title} - Wyatt Ades Project`,
          ...(description ? { description } : {}),
          ...(image
            ? {
                images: [
                  {
                    url: image,
                    alt: title,
                    ...(imageW && imageH
                      ? { width: imageW, height: imageH }
                      : {}),
                  },
                ],
              }
            : {}),
        }}
      />
      <JsonLd
        id="project-jsonld"
        data={{
          "@type": "CreativeWork",
          name: title,
          ...(description ? { description } : {}),
          ...(url ? { sameAs: [url] } : {}),
          genre: project.type,
          keywords: project.topics.join(", "),
          author: {
            "@type": "Person",
            name: "Wyatt Ades",
            url: "https://wyattades.com",
          },
        }}
      />

      <AnimatedItems dist={24}>
        <GoBackLink href="/projects" data-animate-dir="left" />
        <h1>{title}</h1>
        {download && (
          <p>
            <a href={download}>
              <DownloadIcon className="icon-head" aria-hidden />
              Download Link
            </a>
          </p>
        )}
        {url && (
          <p>
            <a href={url}>
              <LinkIcon className="icon-head" aria-hidden />
              {isNPM ? "NPM Package" : "Live Website"}
            </a>
          </p>
        )}
        {source && (
          <p>
            <a href={source}>
              <CodeIcon className="icon-head" aria-hidden />
              Source
            </a>
          </p>
        )}
        {!hideImage && image && (
          <div
            className="shadowed image-wrapper"
            style={{ marginBottom: "2rem" }}
          >
            <Image
              width={800}
              height={imageW && imageH ? (800 * imageH) / imageW : 600}
              // above the fold and reliably the LCP element on this page
              priority
              style={{ objectFit: "cover" }}
              placeholder={imageBlurDataURL ? "blur" : "empty"}
              blurDataURL={imageBlurDataURL || undefined}
              src={image}
              alt={`Image of ${title}`}
            />
          </div>
        )}

        {project.p5Sketch ? (
          [
            <PlaySketch key="play_sketch" game={project} />,
            project.help && (
              <div key="game_help" className="help">
                <Markdown>{project.help}</Markdown>
              </div>
            ),
          ]
        ) : desc && typeof desc === "string" ? (
          <Markdown>{desc}</Markdown>
        ) : Array.isArray(desc) ? (
          desc
        ) : null}

        <style jsx>{`
          .image-wrapper > :global(*) {
            display: block !important;
          }
        `}</style>
      </AnimatedItems>
    </>
  );
};

export default function ShowProjectPage(props: Props) {
  return (
    <Layout pageClassName="content">
      <ShowProjectPageInner {...props} />
    </Layout>
  );
}
