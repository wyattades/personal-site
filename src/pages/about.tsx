import { Link as LinkIcon } from "lucide-react";
import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { NextSeo } from "~/components/seo";
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
    <Layout
      seo={
        <NextSeo
          title="About"
          description="Wyatt Ades is a full-stack engineer: co-founder and CTO of Vanly (acquired), previously Triplebyte, now a founding product engineer at Stepful."
        />
      }
    >
      <AboutPageInner />
    </Layout>
  );
}
