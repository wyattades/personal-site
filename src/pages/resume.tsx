import { NextSeo } from "next-seo";

import { getResumeItems } from "~/lib/resume-items";

const resumeItems = getResumeItems(4);

const ResumePage = () => {
  return (
    <div id="resume-root">
      <NextSeo
        title="Wyatt Ades Resume"
        description="Self-driven full-stack engineer with focus on Progressive Web Applications and seamless user experiences"
        robotsProps={{ nosnippet: true }}
      />

      <section
        className="pad-horizontal"
        style={{
          paddingTop: "0.5rem",
          paddingBottom: "1rem",
        }}
      >
        <div className="pdf-columns">
          <div className="column">
            <div
              className="logo"
              style={{ userSelect: "none" }}
              aria-label="logo of initials"
            >
              <span>W</span>
              <span>A</span>
            </div>
          </div>
          <div className="column center-text" style={{ padding: "0 100px" }}>
            <h1>
              <a href="https://wyattades.com">Wyatt Ades</a>
            </h1>
          </div>
          <div className="column center-text">
            <p className="contact-link">
              <a href="mailto:me@wyattades.com">me@wyattades.com</a>
            </p>
            <p className="contact-link">
              <a href="https://github.com/wyattades">github.com/wyattades</a>
            </p>
            <p className="contact-link">
              <a href="https://wyattades.com">wyattades.com</a>
            </p>
          </div>
        </div>
      </section>
      <div className="text-hr vertical-margin" style={{ marginTop: 0 }} />
      {resumeItems}
    </div>
  );
};

export default ResumePage;
