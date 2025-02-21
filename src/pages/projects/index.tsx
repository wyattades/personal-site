import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { Link } from "~/components/link";
import { HTMLPhysics } from "~/components/physics-import";
import { projects } from "~/lib/projects";

const projectItems = projects.filter((p) => !p.noListing);

const ProjectsPageInner = () => {
  const [broken, setBroken] = useState(false);

  return (
    <>
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
            <Link key={p.id} className="BoxLink" href={`/projects/${p.id}`}>
              {p.image ? (
                <Image
                  className="BoxLink--bg-image"
                  src={p.image}
                  fill
                  // https://nextjs.org/docs/pages/api-reference/components/image#sizes
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              ) : null}
              <span>{p.title}</span>
            </Link>
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
    </>
  );
};

export default function ProjectsPage() {
  return (
    <Layout seo={<NextSeo title="Projects" />} pageClassName="box-list">
      <ProjectsPageInner />
    </Layout>
  );
}
