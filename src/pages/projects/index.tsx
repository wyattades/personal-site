import { X as ClearIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { AnimatedItems } from "~/components/animated-items";
import { Layout } from "~/components/layout";
import { Link } from "~/components/link";
import { HTMLPhysics } from "~/components/physics-import";
import { NextSeo } from "~/components/seo";
import {
  projects,
  projectTopics,
  projectTypes,
  type ProjectTopic,
  type ProjectType,
} from "~/lib/projects";
import { trackEvent } from "~/lib/tracking";

const ProjectsPageInner = () => {
  const [broken, setBroken] = useState(false);
  const [typeFilter, setTypeFilter] = useState<ProjectType | null>(null);
  const [topicFilter, setTopicFilter] = useState<ProjectTopic | null>(null);

  const projectItems = projects.filter(
    (project) =>
      (!typeFilter || project.type === typeFilter) &&
      (!topicFilter || project.topics.includes(topicFilter)),
  );

  const hasFilters = !!typeFilter || !!topicFilter;

  return (
    <>
      <AnimatedItems>
        <div className="content" style={{ flexBasis: "100%" }}>
          <h1 style={{ marginBottom: 0, paddingBottom: "3rem" }}>
            <span>Projects</span>
          </h1>
          <div style={{ paddingBottom: "3rem" }}>
            <p>
              Here are some of my noteworthy projects that were mostly created
              in my spare time. You can also view all of them and more on my{" "}
              <a href="https://github.com/wyattades">github</a>.
            </p>
            <div className="project-filters">
              <div className="filter-groups">
                <div className="filter-group" role="group" aria-label="Type">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="filter-chip"
                      aria-pressed={typeFilter === type}
                      onClick={() => {
                        setTypeFilter(typeFilter === type ? null : type);
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="filter-group" role="group" aria-label="Topic">
                  {projectTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className="filter-chip"
                      aria-pressed={topicFilter === topic}
                      onClick={() => {
                        setTopicFilter(topicFilter === topic ? null : topic);
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  className="filter-clear"
                  aria-label="Clear filters"
                  onClick={() => {
                    setTypeFilter(null);
                    setTopicFilter(null);
                  }}
                >
                  <ClearIcon aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>
        {projectItems.map((p) => {
          return (
            <Link
              key={p.id}
              className="BoxLink"
              data-testid="project-card"
              href={`/projects/${p.id}`}
            >
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
              <span>
                <strong>{p.title}</strong>
                <small>{[p.type, ...p.topics].join(" · ")}</small>
              </span>
            </Link>
          );
        })}
      </AnimatedItems>
      <button
        type="button"
        className="plain-button"
        data-testid="wrecking-ball-toggle"
        style={{
          transform: "translate(calc(50% - 1rem), -100%) rotate(-90deg)",
          zIndex: 5,
          position: "fixed",
          bottom: "4rem",
          right: "0",
        }}
        onClick={() => {
          trackEvent("Trigger Wrecking Ball", { broken });

          setBroken((r) => !r);
        }}
      >
        {broken ? "🛠 Fix" : "💣 Break"} this page?
      </button>

      {broken && (
        <HTMLPhysics selector=".BoxLink, .content p, .content > h1 > span, .filter-chip, .filter-clear" />
      )}
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
