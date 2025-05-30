import dynamic from "next/dynamic";

export const BlockText = dynamic(
  () => import("./physics-module").then((d) => d.BlockText),
  { ssr: false },
);

export const HTMLPhysics = dynamic(
  () => import("./physics-module").then((d) => d.HTMLPhysics),
  { ssr: false },
);
