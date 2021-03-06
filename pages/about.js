import React from 'react';
import { FaLink } from '@react-icons';
import { NextSeo } from 'next-seo';

import { getResumeItems } from 'lib/resumeItems';
import Layout from 'components/Layout';
import AnimatedItems from 'components/AnimatedItems';

const resumeItems = getResumeItems();

const AboutPage = () => {
  return (
    <AnimatedItems>
      <div className="content" style={{ marginBottom: 0 }}>
        <div className="space-between">
          <h1>About Me</h1>
          <a href="/resume.pdf">
            <FaLink className="icon-head" aria-hidden />
            Resume PDF
          </a>
        </div>
      </div>
      {resumeItems}
    </AnimatedItems>
  );
};

AboutPage.getLayout = ({ children }) => (
  <Layout>
    <NextSeo title="About" />
    {children}
  </Layout>
);

export default AboutPage;
