// NOTE: must be a relative path; Turbopack's `require.context` does not
// resolve the `~/*` tsconfig alias, and silently returns zero matches.
const r = require.context("../images/project_images", true);
const imageManifest: Record<
  string,
  {
    src: string;
    width: number;
    height: number;
    blurDataURL?: string;
  }
> = {};
for (const k of r.keys()) {
  imageManifest[k.replace(/(^[^/]+\/|\.\w+$)/g, "")] = r(k).default;
}

export type ProjectItem = {
  id: string;
  title: string;
  type: ProjectType;
  topics: ProjectTopic[];
  source?: string;
  url?: string;
  download?: string;
  /** markdown string (see `src/components/markdown.tsx`) or React nodes */
  desc?: string | React.ReactNode[];
  /** markdown string (see `src/components/markdown.tsx`) */
  help?: string;
  hideImage?: boolean;
  image?: string | null;
  imageW?: number;
  imageH?: number;
  imageBlurDataURL?: string | null;
  p5Sketch?: boolean;
};

export const projectTypes = [
  "Product",
  "Game",
  "Library",
  "Experiment",
  "Physical",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const projectTopics = [
  "AI/ML",
  "Collaboration",
  "Developer Tools",
  "Graphics",
  "Mobile",
] as const;

export type ProjectTopic = (typeof projectTopics)[number];

const projects: ProjectItem[] = [
  {
    id: "vanly",
    title: "Vanly",
    type: "Product",
    topics: ["AI/ML", "Mobile"],
    url: "https://vanly.app",
    desc: `A platform for people sleeping in their vehicles to find safe overnight parking. I co-founded Vanly, served as CTO, and helped build it from 2019 until we sold the company in April 2025. 🎉

Available on the [App Store](https://apps.apple.com/us/app/vanly-rv-vanlife-parking/id1583417008) and [Google Play](https://play.google.com/store/apps/details?id=com.vanly.mobileapp).

Built with Next.js, Firestore, TensorFlow for price recommendations, Stripe, and Capacitor for the mobile apps.`,
  },

  {
    id: "cyperful",
    title: "Cyperful",
    type: "Library",
    topics: ["Developer Tools"],
    source: "https://github.com/stepful/cyperful",
    url: "https://rubygems.org/gems/cyperful",
    desc: `The Capybara visual debugger. Cyperful adds a Cypress-like interface to Ruby system tests, including live test steps, API requests, console logs, interactive pausing, automatic restarts, and video recording.`,
  },
  {
    id: "soft-bodies",
    title: "Soft Bodies",
    type: "Experiment",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/soft-bodies",
    url: "https://soft.everett.works",
    desc: "A soft-body physics sandbox whose solver is Rust compiled to WebAssembly, running in a Web Worker so the simulation never blocks the UI. Squishiness, friction, gravity, and solver quality are all tunable live, and you can draw or import SVG shapes to drop into the world.",
  },
  {
    id: "mining-game",
    title: "Deep Drill Mining",
    type: "Game",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/mining-game",
    url: "https://deep-drill-mining.vercel.app",
    desc: "A browser-based mining game with procedurally generated, dynamically destructible terrain, 2D physics, and isometric 3D rendering.",
  },
  {
    id: "rogue-rs",
    title: "Rogue.rs",
    type: "Game",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/rogue-rs",
    url: "https://wyattades.github.io/rogue-rs/",
    desc: "A roguelike written in Rust and compiled to WebAssembly, with hand-rolled renderers that draw the same game three ways: plain text, HTML, and Canvas 2D. Dungeons are procedurally generated from a seed you can enter to replay a level.",
  },
  {
    id: "articulus",
    title: "Articulus",
    type: "Game",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/articulus",
    url: "https://articulus.vercel.app",
    desc: "A sandbox physics game where you connect rediculous machines together",
  },
  {
    id: "inf-p2p",
    title: "Infinite world web physics game",
    type: "Game",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/inf-p2p",
    url: "https://wyattades.github.io/inf-p2p",
    desc: "Messing around with 3D WebGL, car physics, and infinite world generation",
    // "First-person, infinite random terrain, HTML. It's cool just click it",
  },
  {
    id: "warmvector",
    type: "Game",
    topics: ["Graphics"],
    url: "https://warmvector-java.vercel.app",
    source: "https://github.com/wyattades/warmvector_java",
    title: "WarmVector",
    desc: "Shooting bad guys, randomly generated levels, destructable terrain. Created with my own 2D Java game engine.\n\nClick the link to see the Java engine running in CheerpJ (a Java to WASM compiler).",
  },
  // {
  //   id: "warmvector-rs",
  //   type: "Game",
  //   topics: ["Graphics"],
  //   url: "https://warmvector.vercel.app",
  //   source: "https://github.com/wyattades/warmvector.rs",
  //   title: "WarmVector.rs",
  //   desc: "A rewrite of WarmVector in Rust on the Bevy game engine, compiled to WebAssembly. Uses Rapier for 2D physics and boolean polygon geometry to carve destructible terrain out of procedurally generated levels.",
  // },

  {
    id: "wing-it-online",
    title: "Wing It - Online",
    type: "Game",
    topics: [],
    url: "https://wing-it-beyond.netlify.app",
    desc: 'Online version of the card-game "Wing It Beyond" for the game studio Flying Leap Games',
  },
  {
    id: "tely",
    title: "Tely",
    type: "Product",
    topics: ["Collaboration"],
    source: "https://github.com/wyattades/tely",
    url: "https://tely.vercel.app",
    desc: `A platform for creating lists of media, integrated with Discord servers! Tely currently supports 
aggregating and sharing any movie, TV show, or Spotify song.`,
  },
  {
    id: "megabyte",
    title: "MegaByte",
    type: "Game",
    topics: [],
    // dead link (404) as of Sep 2026
    // url: "https://triplebyte.github.io/megabyte-game",
    desc: "A quick platformer where you answer coding questions. Made for a Triplebyte marketing effort",
  },
  {
    id: "generative-line-art",
    title: "Generative Line Art",
    type: "Experiment",
    topics: ["Graphics"],
    source: "https://github.com/wyattades/generative-line-art",
    url: "https://wyattades.github.io/generative-line-art",
    desc: `Create line art using this simple yet versatile line art generation tool. Export 
the result as a scalable vector graphic (SVG)!`,
  },
  {
    id: "shared-docs",
    title: "Collaboritive Text Editor",
    type: "Product",
    topics: ["Collaboration"],
    url: "https://shared-docs-protodemo.vercel.app",
    desc: `An online text editor that supports multiple users editing and viewing at the same time. Uses Firebase's webhooks to synchronize data.`,
  },
  {
    id: "logic-gates",
    title: "Logic Gates",
    type: "Experiment",
    topics: ["Developer Tools"],
    url: "https://logicgates.vercel.app",
    source: "https://github.com/wyattades/logic-gates",
    desc: `A sandbox for simulating logic gates.

Features:

- Connect and visualize logic gate inputs and outputs

- Configure number of input and output bits

- "Bundle" the current logic as a new logic-gate`,
  },

  {
    id: "gameshare",
    title: "GameShare",
    type: "Product",
    topics: ["Collaboration"],
    source: "https://github.com/wyattades/GameShare",
    // dead link (Heroku 503) as of Sep 2026
    // url: "https://gameshare-app.herokuapp.com",
    desc: `GameShare streamlines the way people play online multiplayer games by letting 
the players create their own experience. Edit, play, and share games instantly with 
your friends!`,
  },
  {
    id: "daily_learner",
    title: "Daily Learner",
    type: "Product",
    topics: ["AI/ML"],
    source: "https://github.com/wyattades/daily_learner",
    // dead link (404) as of Sep 2026
    // url: "https://dailylearner.pythonanywhere.com",
    desc: `A webapp for entering arbitrary data in a way that's accessible to anyone. 
Easily perform analytics and predictions using machine learning. Currently supports 
two types of Linear Models and a Blackbox Model.`,
  },
  {
    id: "reinforcement-learning",
    title: "Bipedal Walker - Reinforcement Learning",
    type: "Experiment",
    topics: ["AI/ML", "Graphics"],
    source: "https://github.com/WilliamRitson/AI-Obstacle-Maneuvering",
    desc: `The goal of this project was to use reinforcement learning to train a physics-based 
agent (the bipedal walker) to maneuver over terrain and obstacles (the OpenAI gym environments).

We didn't reach our goal (reaching over 300 units of distance for 100 consecutive runs) but I 
got to make some fun GIFs out of it ^`,
  },
  {
    id: "trebuchet",
    title: "Floating Arm Trebuchet",
    type: "Physical",
    topics: ["Graphics"],
    desc: `Built a [floating arm trebuchet](https://en.wikipedia.org/wiki/Floating_arm_trebuchet) 
from scratch in high school! First I modeled the trebuchet in Autodesk Inventor, then added 
physics constraints and ran the simulation as seen in the GIF above.
    
The actual build consisted of: metal square tubing for the frame, sheet metal for scaffolding, and wooden 
lathed wheels with ball bearings. It ended up being able to throw a small metal sphere over 300ft!`,
  },
  {
    id: "aggregor",
    title: "Aggregor",
    type: "Product",
    topics: ["Mobile"],
    source: "https://github.com/wyattades/aggregor_app",
    url: "https://aggregor.vercel.app",
    desc: `Aggregor combines other news and social feeds into one infinite-scrolling page. 
The user can view and manage multiple personal news feeds. This project mainly served as 
a learning experience and proof of concept for a fully cross-platform react app i.e. the 
same code-base is used on desktop browser, mobile browser, android, and ios.`,
  },
  {
    id: "java-to-javascript",
    title: "Java to Javascript",
    type: "Library",
    topics: ["Developer Tools"],
    image: "npm",
    source: "https://github.com/wyattades/java-to-javascript",
    url: "https://www.npmjs.com/package/java-to-javascript",
    desc: "Convert Java Classes to ES6 Classes",
  },
  {
    id: "rails-macro",
    title: "rails.macro",
    type: "Library",
    topics: ["Developer Tools"],
    image: "npm",
    source: "https://github.com/wyattades/rails.macro",
    url: "https://www.npmjs.com/package/rails.macro",
    desc: "A babel macro to let JavaScript code access Ruby on Rails named routes",
  },
  //   {
  //     id: "bsoe_map",
  //     title: "BSOE Interactive Map",
  //     source: "https://github.com/wyattades/bsoe_map",
  //     url: "https://buildingmaps.soe.ucsc.edu/",
  //     desc: `This is a tool for generating interactive floor-map webpages. The example shows
  // UCSC Baskin School of Engineering building maps.`,
  //   },
  {
    id: "map_maker",
    title: "JSON Game-Map Maker",
    type: "Product",
    topics: ["Developer Tools", "Graphics"],
    source: "https://github.com/wyattades/json_map_generator",
    url: "http://wyattades.github.io/json_map_generator",
    desc: `Create simple maps made of rectangular walls, and output a JSON array (can also 
generate map using inputted JSON).`,
  },
  //   {
  //     id: "orgchart",
  //     title: "Organization Chart",
  //     source: "https://github.com/wyattades/org-chart-module",
  //     url: "https://wyattades.github.io/org-chart-module/",
  //     desc: `Create embedded Org Charts using this simple javascript library. These charts have
  // a simplistic material design and are intuitively interactive.`,
  //   },
  //   {
  //     id: "minshell",
  //     title: "MinShell",
  //     source: "https://github.com/wyattades/minshell",
  //     desc: `A minimalist command-line shell that supports some of the basic features of Bash.
  // Compile the tiny source-code on your OS to try it out!`,
  //   },

  {
    id: "arc-dodger",
    p5Sketch: true,
    title: "Arc Dodger",
    type: "Game",
    topics: ["Graphics"],
    desc: "Colorful arcs are comin', and they're comin' strong! This one’s addicting...",
    help: "Avoid the colored pie! Use the LEFT and RIGHT arrow keys to move, and press SPACE to restart",
  },
  {
    id: "tetris",
    p5Sketch: true,
    title: "Tetris",
    type: "Game",
    topics: [],
    desc: "It's just Tetris, yo",
    help: `Controls:

- LEFT and RIGHT arrow keys to move

- Z and X to rotate

- DOWN arrow key to drop faster`,
  },
  {
    id: "minesweeper",
    title: "MineSweeper",
    type: "Game",
    topics: [],
    url: "https://minesweeper-online.vercel.app",
    source: "https://github.com/wyattades/minesweeper",
    desc: "Minesweeper game, built in React/TypeScript",
  },
  {
    id: "asteroids",
    p5Sketch: true,
    title: "Asteroids",
    type: "Game",
    topics: [],
    desc: "Shoot those asteroids",
  },
  {
    id: "boingo-bug",
    p5Sketch: true,
    title: "Boingo Bug",
    type: "Game",
    topics: [],
    desc: "Flappy bird but worse",
  },
  {
    id: "hit-block-die",
    p5Sketch: true,
    title: "Hit-Block-Die",
    type: "Game",
    topics: [],
    desc: "Dodge those red things!",
  },

  // TODO: Add tanks game
  // {
  //   id: "tanks",
  //   p5Sketch: true,
  //   isGame: true,
  //   noListing: true,
  //   title: "Tanks",
  //   desc: "Tanks game, built in React/TypeScript",
  // },
];

for (const p of projects) {
  if (p.p5Sketch && !p.source) {
    p.source = `https://github.com/wyattades/personal-site/blob/main/src/lib/sketches/${p.id}.js`;
  }

  if (p.image === null) continue;
  if (p.image?.startsWith("/")) continue;

  const m = imageManifest[p.image || p.id];
  if (!m) {
    p.image = null;
    continue;
  }

  p.image = m.src;
  p.imageW = m.width;
  p.imageH = m.height;
  p.imageBlurDataURL = m.blurDataURL || null;
}

export { projects };
