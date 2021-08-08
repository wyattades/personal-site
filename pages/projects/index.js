import React from 'react';
import Image from 'next/image';
import { NextSeo } from 'next-seo';

import projects from 'lib/projects';
import Layout from 'components/Layout';
import Link from 'components/Link';
import AnimatedItems from 'components/AnimatedItems';

const projectItems = projects.filter((p) => !p.noListing);

const ProjectsPage = () => {
  return (
    <AnimatedItems className="box-list">
      <div
        className="content"
        style={{ flexBasis: '100%', margin: '0 1rem 3rem' }}
      >
        <h1>Projects</h1>
        <p>
          Here are some of my noteworthy projects that were mostly created in my
          spare time. You can also view all of them and more on my{' '}
          <a href="https://github.com/wyattades">github</a>.
        </p>
      </div>
      {projectItems.map((p) => {
        return (
          <div key={p.id} className="box-link">
            {p.image ? (
              <Image src={p.image} layout="fill" objectFit="cover" alt="" />
            ) : null}
            <Link href={`/projects/${p.id}`}>{p.title}</Link>
          </div>
        );
      })}
    </AnimatedItems>
  );
};

ProjectsPage.getLayout = ({ children }) => (
  <Layout pageKey="projects" seo={<NextSeo title="Projects" />} animateItems>
    {children}
  </Layout>
);

export default ProjectsPage;
