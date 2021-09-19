import dynamic from 'next/dynamic';

const importer = () => import('./physicsModule');

export const BlockText = dynamic(() => importer().then((d) => d.BlockText), {
  ssr: false,
});

export const HTMLPhysics = dynamic(
  () => importer().then((d) => d.HTMLPhysics),
  { ssr: false },
);
