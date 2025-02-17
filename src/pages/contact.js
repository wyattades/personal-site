import { FaEnvelope as EmailIcon } from "@react-icons/all-files/fa/FaEnvelope";
import { FaGithub as GithubIcon } from "@react-icons/all-files/fa/FaGithub";
import { FaLinkedin as LinkedinIcon } from "@react-icons/all-files/fa/FaLinkedin";
import { FaSpotify as SpotifyIcon } from "@react-icons/all-files/fa/FaSpotify";
import { NextSeo } from "next-seo";

import AnimatedItems from "~/components/AnimatedItems";
import Layout from "~/components/Layout";

const ContactPage = () => {
  return (
    <AnimatedItems>
      <h1>Contact</h1>
      <p>
        <a href="mailto:me@wyattades.com">
          <EmailIcon className="icon-head" aria-hidden />
          me@wyattades.com
        </a>
        <br />
        <br />
      </p>
      <h2>Other Links</h2>
      <p>
        <a href="https://github.com/wyattades">
          <GithubIcon className="icon-head" aria-hidden />
          github.com/wyattades
        </a>
      </p>
      <p>
        <a href="https://linkedin.com/in/wyattades/">
          <LinkedinIcon className="icon-head" aria-hidden />
          linkedin.com/in/wyattades
        </a>
      </p>
      <p>
        <a href="https://open.spotify.com/user/wyattades">
          <SpotifyIcon className="icon-head" aria-hidden />
          open.spotify.com/user/wyattades
        </a>
      </p>
    </AnimatedItems>
  );
};

ContactPage.getLayout = ({ children }) => (
  <Layout seo={<NextSeo title="Contact" />} pageClassName="content">
    {children}
  </Layout>
);

export default ContactPage;
