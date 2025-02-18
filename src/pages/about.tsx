import { Link as LinkIcon } from "lucide-react";
import { NextSeo } from "next-seo";

import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { getResumeItems } from "~/lib/resume-items";

const resumeItems = getResumeItems();

const AboutPageInner = () => {
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

export default function AboutPage() {
  return (
    <Layout seo={<NextSeo title="About" />}>
      <AboutPageInner />
    </Layout>
  );
}
