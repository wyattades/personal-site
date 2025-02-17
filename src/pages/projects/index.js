import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import AnimatedItems from "~/components/AnimatedItems";
import Layout from "~/components/Layout";
import Link from "~/components/Link";
import { HTMLPhysics } from "~/components/physicsImport";
import projects from "~/lib/projects";

const projectItems = projects.filter((p) => !p.noListing);

const ProjectsPage = () => {
  const [broken, setBroken] = useState(false);

  return (
    <div className="box-list">
      <AnimatedItems>
        <div
          className="content"
          style={{ flexBasis: "100%", margin: "0 1rem" }}
        >
          <h1 style={{ marginBottom: 0, paddingBottom: "3rem" }}>
            <span>Projects</span>
          </h1>
          <p style={{ paddingBottom: "3rem" }}>
            Here are some of my noteworthy projects that were mostly created in
            my spare time. You can also view all of them and more on my{" "}
            <a href="https://github.com/wyattades">github</a>.
          </p>
        </div>
        {projectItems.map((p) => {
          return (
            <div key={p.id} className="box-link">
              {p.image ? (
                <Image
                  src={p.image}
                  fill
                  // https://nextjs.org/docs/pages/api-reference/components/image#sizes
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              ) : null}
              <Link href={`/projects/${p.id}`}>
                <span>{p.title}</span>
              </Link>
            </div>
          );
        })}
        <div
          className="content"
          style={{
            flexBasis: "100%",
            margin: "0 1rem",
            paddingTop: "4rem",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            className="plain-button"
            style={{ zIndex: 5, position: "relative" }}
            onClick={() => setBroken((r) => !r)}
          >
            {broken ? "🛠 Fix" : "💣 Break"} this page?
          </button>
        </div>
      </AnimatedItems>

      {broken && <HTMLPhysics />}
    </div>
  );
};

ProjectsPage.getLayout = ({ children }) => (
  <Layout seo={<NextSeo title="Projects" />}>{children}</Layout>
);

export default ProjectsPage;
