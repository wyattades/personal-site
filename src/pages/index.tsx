import { useRef, useState } from "react";
import { useDebounce as useDebounceFn } from "react-use";

import { AnimatedItems, useOutTransition } from "~/components/animated-items";
import { BodyProps } from "~/components/body-props";
import { Layout } from "~/components/layout";
import { useHoveredLink } from "~/components/link";
import { BlockText } from "~/components/physics-import";

let welcomeCounter = 0;
const WELCOMES = [
  "Welcome",
  "Howdy",
  "Bienvenue",
  "Hola",
  "Bonjour",
  "Hi there",
];
const genWelcome = () => {
  console.log("genWelcome", welcomeCounter);
  return WELCOMES[welcomeCounter++ % WELCOMES.length]!;
};

const IndexPageInner = () => {
  const outTransition = useOutTransition();

  const [hoveredLink] = useHoveredLink();
  const hoveredText =
    hoveredLink && hoveredLink !== "Home" ? hoveredLink : null;

  const [text, setText] = useState(genWelcome);
  const first = useRef(true);
  useDebounceFn(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      setText(hoveredText ?? genWelcome());
    },
    200,
    [hoveredText],
  );

  return (
    <div className="layers">
      <BlockText text={outTransition ? "" : text} />

      <AnimatedItems>
        <div className="title-wrapper">
          <h1>Wyatt Ades</h1>
        </div>
      </AnimatedItems>

      <style jsx>{`
        .title-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }
        h1 {
          margin-top: 250px;
          text-transform: uppercase;
          text-align: center;
          pointer-events: all;
        }
      `}</style>
    </div>
  );
};

export default function IndexPage() {
  return (
    <Layout noLayout outsideTransition={<BodyProps className="index-page" />}>
      <IndexPageInner />
    </Layout>
  );
}
