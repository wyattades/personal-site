const experienceItems = [
  {
    title: 'Vanly',
    link: 'https://vanly.app',
    role: 'Co-founder & CTO',
    from: '2019',
    to: null,
    desc: [
      'A two-sided marketplace for homeowners to Share Driveway Space™ with vanlifers',
      'Top performing SEO PWA website, cross-platform mobile app, ML prediction service, suite of admin tools',
    ],
  },
  {
    title: 'Triplebyte',
    link: 'https://triplebyte.com',
    role: 'Full-stack Engineer',
    from: 'April 2019',
    to: 'April 2021',
    desc: [
      'Project lead for the most vital company capstone projects: jobs directory, Triplebyte Screen, profile editor',
      'Added sub 30ms React server-side-rendering system in Rails',
      'Moved all web infrastructure and test suites to parallelized Docker containers for a tremendous increase in speed, caching and reliability',
    ],
  },
  {
    title: 'Rootid',
    link: 'https://rootid.com',
    role: 'Dev-ops Intern',
    from: '2018',
    to: '2019',
    desc: [
      'Moved to Docker infrastructure and created automated integration testing suite for >20 client websites',
    ],
  },
  {
    title: 'Baskin School of Engineering',
    link: 'https://soe.ucsc.edu',
    role: 'Full-stack Engineer',
    from: '2017',
    to: '2018',
    desc: [
      'Created automated tools for bulk content migration and testing that are still used today to manage hundreds of enterprise Drupal sites',
      'Built reusable web "modules", interactive building maps and company org charts, used on campus kiosks',
      'Developed responsive Drupal CSS theme used on most School of Engineering websites',
    ],
  },
  {
    title: 'MVCode',
    link: 'https://web.archive.org/web/20210127040716/https://www.mvcode.com/',
    role: 'Coordinator and Lead Instructor',
    from: '2015',
    to: '2017',
    desc: [
      'Developed and taught coding and design challenges for teens in JavaScript, HTML/CSS, Arduino, Unity/C#',
      'Clearly communicated with coworkers and parents by documenting performance and progress of students',
      'Managed 3 other instructors at a time',
    ],
  },
];

export const getResumeItems = (maxExperience = null) => {
  const shownExpItems =
    maxExperience != null
      ? experienceItems.slice(0, maxExperience)
      : experienceItems;

  return [
    <section key="desc" className="pad-horizontal">
      <ul>
        <li>
          Self-driven full-stack engineer with passion for Progressive Web
          Applications, graphics, and seamless user experiences
        </li>
        <li>Open-source project contibutor and business owner</li>
        <li>
          Builds and researches efficient and modular tooling &amp; practices
        </li>
      </ul>
    </section>,

    <h2 key="tech-t" className="resume-title text-hr vertical-margin">
      <span>Technologies</span>
    </h2>,

    <section key="tech" className="pad-horizontal">
      <dl className="expertise-table">
        <div>
          <dt>Expert</dt>
          <dd>React, TypeScript, Rails, Webpack, Babel, CSS, Node.js</dd>
        </div>
        <div>
          <dt>Experienced</dt>
          <dd>PostgreSQL, Docker, Java</dd>
        </div>
        <div>
          <dt>Always learning</dt>
          <dd>Rust to WASM, WebGL, AWS</dd>
        </div>
      </dl>
    </section>,

    <h2 key="exp-t" className="resume-title text-hr vertical-margin">
      <span>Experience</span>
    </h2>,

    ...shownExpItems.map((exp, i) => (
      <section className="pad-horizontal pad-vertical" key={`exp-${i}`}>
        <p className="exp-item__date">
          {exp.from} - {exp.to || 'Present'}
        </p>
        <p className="exp-item__title">
          <a href={exp.link}>{exp.title}</a>
          <span>{exp.role}</span>
        </p>
        {Array.isArray(exp.desc) && exp.desc.length > 0 ? (
          <ul className="exp-item__desc">
            {exp.desc.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
        ) : exp.desc ? (
          <p className="exp-item__desc">{exp.desc}</p>
        ) : null}
      </section>
    )),

    <h2 key="edu-t" className="resume-title text-hr vertical-margin">
      <span>Education</span>
    </h2>,

    <section key="edu" className="pad-horizontal">
      <div>
        <p className="exp-item__date">2015 - 2019</p>
        <p className="exp-item__title">
          <span>University of California, Santa Cruz</span>
          <span>B.S. in Computer Science | Magna Cum Laude</span>
        </p>
        <p className="exp-item__desc">
          Web Development discipline, along with: 3D Graphics, Mobile
          Applications, Artificial Intelligence, Natural Language Processing
        </p>
      </div>
    </section>,
  ];
};
