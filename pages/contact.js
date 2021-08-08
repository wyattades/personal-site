import React from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaSpotify } from '@react-icons';
import { NextSeo } from 'next-seo';

import Layout from 'components/Layout';
import AnimatedItems from 'components/AnimatedItems';

const ContactPage = () => {
  return (
    <AnimatedItems className="content">
      <h1>Contact</h1>
      <p>
        <a href="mailto:me@wyattades.com">
          <FaEnvelope className="icon-head" aria-hidden />
          me@wyattades.com
        </a>
        <br />
        <br />
      </p>
      <h2>Other Links</h2>
      <p>
        <a href="https://github.com/wyattades">
          <FaGithub className="icon-head" aria-hidden />
          github.com/wyattades
        </a>
      </p>
      <p>
        <a href="https://linkedin.com/in/wyattades/">
          <FaLinkedin className="icon-head" aria-hidden />
          linkedin.com/in/wyattades
        </a>
      </p>
      <p>
        <a href="https://open.spotify.com/user/wyattades">
          <FaSpotify className="icon-head" aria-hidden />
          open.spotify.com/user/wyattades
        </a>
      </p>
    </AnimatedItems>
  );
};

ContactPage.getLayout = ({ children }) => (
  <Layout pageKey="contact" seo={<NextSeo title="Contact" />}>
    {children}
  </Layout>
);

export default ContactPage;
