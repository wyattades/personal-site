import Image from 'next/image';
import { FaCloudDownloadAlt as DownloadIcon } from '@react-icons/all-files/fa/FaCloudDownloadAlt';
import { FaLink as LinkIcon } from '@react-icons/all-files/fa/FaLink';
import { FaCode as CodeIcon } from '@react-icons/all-files/fa/FaCode';
import { NextSeo } from 'next-seo';

import Layout from 'components/Layout';
import projects from 'lib/projects';
import PlaySketch from 'components/PlaySketch';
import { GoBackLink } from 'components/Link';
import AnimatedItems from 'components/AnimatedItems';
import { Markdown } from 'components/Markdown';

export const getStaticProps = async ({ params: { project_id } }) => {
  const project = projects.find((p) => !p.noPage && p.id === project_id);

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
    paths: projects
      .filter((p) => !p.noPage)
      .map((p) => ({
        params: { project_id: p.id },
      })),
    fallback: false,
  };
};

const ShowProjectPage = ({ project }) => {
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

  const isNPM = !!url?.includes('npmjs.com');

  return (
    <>
      <NextSeo
        title={`${title} - Wyatt Ades Project`}
        openGraph={
          image
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
            : {}
        }
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
              {isNPM ? 'NPM Package' : 'Live Website'}
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
            style={{ marginBottom: '2rem' }}
          >
            <Image
              width={800}
              height={imageW && imageH ? (800 * imageH) / imageW : 600}
              style={{ objectFit: 'cover' }}
              placeholder={imageBlurDataURL ? 'blur' : 'empty'}
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
        ) : desc && typeof desc === 'string' ? (
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

ShowProjectPage.getLayout = ({ children }) => {
  return <Layout pageClassName="content">{children}</Layout>;
};

export default ShowProjectPage;
