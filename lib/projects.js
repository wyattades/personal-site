const r = require.context('images/project_images', true);
const imageManifest = {};
for (const k of r.keys()) {
  imageManifest[k.replace(/(^[^/]+\/|\.\w+$)/g, '')] = r(k).default;
}

const projects = [
  {
    id: 'vanly',
    title: 'Vanly',
    url: 'https://vanly.app',
    desc: 'A platform for people sleeping in their vehicles to find overnight parking',
  },
  {
    id: 'megabyte',
    title: 'MegaByte',
    url: 'https://triplebyte.github.io/megabyte-game',
    desc: 'A quick platformer where you answer coding questions. Made for a Triplebyte marketing effort',
    isGame: true,
  },
  {
    id: 'wing-it-online',
    title: 'Wing It - Online',
    url: 'https://wing-it-beyond.netlify.app',
    desc: 'Online version of the card-game "Wing It Beyond" for the game studio Flying Leap Games',
    isGame: true,
  },
  {
    id: 'articulus',
    title: 'Articulus',
    source: 'https://github.com/wyattades/articulus',
    url: 'https://articulus.vercel.app',
    desc: 'A sandbox physics game where you connect rediculous machines together',
    isGame: true,
  },
  {
    id: 'tely',
    title: 'Tely',
    source: 'https://github.com/wyattades/tely',
    url: 'https://tely.vercel.app',
    desc: 'A platform for creating lists of media, integrated with Discord servers! Tely currently supports \
  aggregating and sharing any movie, TV show, or Spotify song.',
  },
  {
    id: 'generative-line-art',
    title: 'Generative Line Art',
    source: 'https://github.com/wyattades/generative-line-art',
    url: 'https://wyattades.github.io/generative-line-art',
    desc: 'Create line art using this simple yet versatile line art generation tool. Export \
  the result as a scalable vector graphic (SVG)!',
  },
  {
    id: 'webpack-boiler',
    title: 'webpack-boiler',
    image: 'npm',
    source: 'https://github.com/wyattades/webpack-boiler',
    url: 'https://www.npmjs.com/package/webpack-boiler',
    desc: 'Webpack configuration boilerplate. Great for easily configuring React or vanilla Progressive Web Apps',
  },
  {
    id: 'java-to-javascript',
    title: 'Java to Javascript',
    image: 'npm',
    source: 'https://github.com/wyattades/java-to-javascript',
    url: 'https://www.npmjs.com/package/java-to-javascript',
    desc: 'Convert Java Classes to ES6 Classes',
  },
  {
    id: 'rails-macro',
    title: 'rails.macro',
    image: 'npm',
    source: 'https://github.com/wyattades/rails.macro',
    url: 'https://www.npmjs.com/package/rails.macro',
    desc: 'A babel macro to let JavaScript code access Ruby on Rails named routes',
  },
  {
    id: 'inf-p2p',
    title: 'Infinite world web physics game',
    source: 'https://github.com/wyattades/inf-p2p',
    url: 'https://wyattades.github.io/inf-p2p',
    desc: 'Messing around with 3D WebGL, car physics, and infinite world generation',
    // "First-person, infinite random terrain, HTML. It's cool just click it",
    isGame: true,
  },
  {
    id: 'shared-docs',
    title: 'Collaboritive Text Editor',
    url: 'https://shared-docs-protodemo.vercel.app',
    desc: "An online text editor that supports multiple users editing and viewing at the same time. Uses Firebase's webhooks to synchronize data.",
  },
  {
    id: 'logic-gates',
    title: 'Logic Gates',
    url: 'https://logicgates.vercel.app',
    source: 'https://github.com/wyattades/logic-gates',
    desc: 'A sandbox for simulating logic gates.\n\nFeatures:\n\n- Connect and visualize logic gate inputs and outputs\n- Configure number of input and output bits\n- "Bundle" the current logic as a new logic-gate',
  },

  {
    id: 'gameshare',
    title: 'GameShare',
    source: 'https://github.com/wyattades/GameShare',
    url: 'https://gameshare-app.herokuapp.com',
    desc: 'GameShare streamlines the way people play online multiplayer games by letting \
  the players create their own experience. Edit, play, and share games instantly with \
  your friends!',
  },
  {
    id: 'daily_learner',
    title: 'Daily Learner',
    source: 'https://github.com/wyattades/daily_learner',
    url: 'https://dailylearner.pythonanywhere.com',
    desc: "A webapp for entering arbitrary data in a way that's accessible to anyone. \
  Easily perform analytics and predictions using machine learning. Currently supports \
  two types of Linear Models and a Blackbox Model.",
  },
  {
    id: 'reinforcement-learning',
    title: 'Bipedal Walker - Reinforcement Learning',
    source: 'https://github.com/WilliamRitson/AI-Obstacle-Maneuvering',
    desc: "The goal of this project was to use reinforcement learning to train a physics-based \
    agent (the bipedal walker) to maneuver over terrain and obstacles (the OpenAI gym environments).\n\n\
    We didn't reach our goal (reaching over 300 units of distance for 100 consecutive runs) but I \
    got to make some fun GIFs out of it ^",
  },
  {
    id: 'trebuchet',
    title: 'Floating Arm Trebuchet',
    desc: 'Built a [floating arm trebuchet](https://en.wikipedia.org/wiki/Floating_arm_trebuchet) \
    from scratch in high school! First I modeled the trebuchet in Autodesk Inventor, then added \
    physics constraints and ran the simulation as seen in the GIF above.\n\nThe actual build \
    consisted of: metal square tubing for the frame, sheet metal for scaffolding, and wooden \
    lathed wheels with ball bearings. It ended up being able to throw a small metal sphere over 300ft!',
  },
  {
    id: 'aggregor',
    title: 'Aggregor',
    source: 'https://github.com/wyattades/aggregor_app',
    url: 'https://aggregor.vercel.app',
    desc: 'Aggregor combines other news and social feeds into one infinite-scrolling page. \
  The user can view and manage multiple personal news feeds. This project mainly served as \
  a learning experience and proof of concept for a fully cross-platform react app i.e. the \
  same code-base is used on desktop browser, mobile browser, android, and ios.',
  },

  {
    id: 'bsoe_map',
    title: 'BSOE Interactive Map',
    source: 'https://github.com/wyattades/bsoe_map',
    url: 'https://buildingmaps.soe.ucsc.edu/',
    desc: 'This is a tool for generating interactive floor-map webpages. The example shows \
  UCSC Baskin School of Engineering building maps.',
  },
  {
    id: 'map_maker',
    title: 'JSON Game-Map Maker',
    source: 'https://github.com/wyattades/json_map_generator',
    url: 'http://wyattades.github.io/json_map_generator',
    desc: 'Create simple maps made of rectangular walls, and output a JSON array (can also \
  generate map using inputted JSON).',
  },
  {
    id: 'orgchart',
    title: 'Organization Chart',
    source: 'https://github.com/wyattades/org-chart-module',
    url: 'https://wyattades.github.io/org-chart-module/',
    desc: 'Create embedded Org Charts using this simple javascript library. These charts have \
  a simplistic material design and are intuitively interactive.',
  },
  {
    id: 'minshell',
    title: 'MinShell',
    source: 'https://github.com/wyattades/minshell',
    desc: 'A minimalist command-line shell that supports some of the basic features of Bash. \
  Compile the tiny source-code on your OS to try it out!',
  },

  {
    url: 'https://github.com/wyattades/WarmVector_Client_Singleplayer/releases',
    id: 'warmvector',
    isGame: true,
    noListing: true,
    title: 'WarmVector',
    desc: 'Shooting bad guys, randomly generated levels, destructable terrain. Created with my own 2D Java game engine',
  },
  {
    id: 'arc-dodger',
    p5Sketch: true,
    isGame: true,
    noListing: true,
    title: 'Arc Dodger',
    desc: "Colorful arcs are comin', and they're comin' strong! This one’s addicting...",
    help: 'Avoid the colored pie! Use the LEFT and RIGHT arrow keys to move, and press SPACE to restart',
  },
  {
    id: 'minesweeper',
    title: 'MineSweeper',
    url: 'https://minesweeper-online.vercel.app',
    source: 'https://github.com/wyattades/minesweeper',
    desc: 'Minesweeper game, built in React/TypeScript',
    isGame: true,
    noListing: true,
  },
  {
    id: 'asteroids',
    p5Sketch: true,
    isGame: true,
    noListing: true,
    title: 'Asteroids',
    desc: 'Shoot those asteroids',
  },
  {
    id: 'boingo-bug',
    p5Sketch: true,
    isGame: true,
    noListing: true,
    title: 'Boingo Bug',
    desc: 'Flappy bird but worse',
  },
  {
    id: 'hit-block-die',
    p5Sketch: true,
    isGame: true,
    noListing: true,
    title: 'Hit-Block-Die',
    desc: 'Dodge those red things!',
  },

  {
    id: 'games',
    noPage: true,
    title: 'More Games ...',
  },
];

for (const p of projects) {
  if (p.p5Sketch && !p.source) {
    p.source = `https://github.com/wyattades/personal-site/blob/master/lib/sketches/${p.id}.js`;
  }

  if (p.image === null) continue;
  if (p.image && p.image.startsWith('/')) continue;

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

export default projects;
