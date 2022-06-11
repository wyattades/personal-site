import dynamic from 'next/dynamic';

export const BlockText = dynamic(
  () => import('./physicsModule').then((d) => d.BlockText),
  {
    ssr: false,
  },
);

export const HTMLPhysics = dynamic(
  () => import('./physicsModule').then((d) => d.HTMLPhysics),
  { ssr: false },
);
