import { FaLink as LinkIcon } from "@react-icons/all-files/fa/FaLink";
import { NextSeo } from "next-seo";

import AnimatedItems from "~/components/AnimatedItems";
import Layout from "~/components/Layout";
import { getResumeItems } from "~/lib/resumeItems";

const resumeItems = getResumeItems();

const AboutPage = () => {
  return (
    <AnimatedItems>
      <div className="space-between content">
        <h1>About Me</h1>
        <a href="/resume.pdf">
          <LinkIcon className="icon-head" aria-hidden />
          Resume PDF
        </a>
      </div>
      {resumeItems}
    </AnimatedItems>
  );
};

AboutPage.getLayout = ({ children }) => (
  <Layout seo={<NextSeo title="About" />}>{children}</Layout>
);

export default AboutPage;
