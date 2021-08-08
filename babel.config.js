// const threeModules = [
//   ...require('fs')
//     .readFileSync('node_modules/three/src/Three.js', 'utf8')
//     .matchAll(/export \{\s*(\w+(?:,\s*\w+)*)\s*\} from '\.\/([\w/-]+)\.js';/gm),
// ].reduce((obj, m) => {
//   for (const key of m[1].split(/,\s*/)) obj[key] = m[2];
//   return obj;
// }, {});
// console.log(threeModules);

// [
//   'import',
//   {
//     libraryName: 'three',
//     camel2DashComponentName: false,
//     transformToDefaultImport: false,
//     customName: (name) => {
//       if (name.endsWith('Material'))
//         return `three/src/materials/${name}.js`;
//       if (name.endsWith('Geometry'))
//         return `three/src/geometries/${name}.js`;
//       return `three/src/${threeModules[name] || name}.js`;
//     },
//   },
//   'import-three',
// ],

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'import',
      {
        libraryName: '@react-icons',
        camel2DashComponentName: false,
        transformToDefaultImport: false,
        customName: (name) => {
          const rootDir = '@react-icons/all-files';

          for (const [prefix, dir] of [
            ['Io', 'io5'],
            ['IoIos', 'io'],
          ]) {
            if (name.startsWith(prefix)) {
              return `${rootDir}/${dir}/${name}.js`;
            }
          }

          const match = name.match(/^[A-Z][a-z0-9]*/);
          if (match) {
            return `${rootDir}/${match[0].toLowerCase()}/${name}.js`;
          }

          return rootDir;
        },
      },
      'import-react-icons',
    ],
    [
      'import',
      {
        libraryName: 'react-use',
        libraryDirectory: 'lib',
        camel2DashComponentName: false,
      },
      'import-react-use',
    ],
  ],
};
