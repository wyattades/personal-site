import {
  Mail as EmailIcon,
  Github as GithubIcon,
  Linkedin as LinkedinIcon,
  Twitter as TwitterIcon,
} from "lucide-react";
import { NextSeo } from "next-seo";

import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M19.098 10.638c-3.868-2.297-10.248-2.508-13.941-1.387-.593.18-1.22-.155-1.399-.748-.18-.593.154-1.22.748-1.4 4.239-1.287 11.285-1.038 15.738 1.605.533.317.708 1.005.392 1.538-.316.533-1.005.709-1.538.392zm-.126 3.403c-.272.44-.847.578-1.287.308-3.225-1.982-8.142-2.557-11.958-1.399-.494.15-1.017-.129-1.167-.623-.149-.495.13-1.016.624-1.167 4.358-1.322 9.776-.682 13.48 1.595.44.27.578.847.308 1.286zm-1.469 3.267c-.215.354-.676.465-1.028.249-2.818-1.722-6.365-2.111-10.542-1.157-.402.092-.803-.16-.895-.562-.092-.403.159-.804.562-.896 4.571-1.045 8.492-.595 11.655 1.338.353.215.464.676.248 1.028zm-5.503-17.308c-6.627 0-12 5.373-12 12 0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.627-5.372-12-12-12z" />
    </svg>
  );
}

const ContactPageInner = () => {
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
      <p>
        <a href="https://x.com/wyattades">
          <TwitterIcon className="icon-head" aria-hidden />
          x.com/wyattades
        </a>
      </p>
    </AnimatedItems>
  );
};

export default function ContactPage() {
  return (
    <Layout seo={<NextSeo title="Contact" />} pageClassName="content">
      <ContactPageInner />
    </Layout>
  );
}
