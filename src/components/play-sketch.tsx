import { useEffect, useRef } from "react";
import { useAsync } from "react-use";

import { withErrorBoundary } from "~/components/error-boundary";
import type { ProjectItem } from "~/lib/projects";
import { ScoreBoard } from "~/lib/score-board";
import { wait } from "~/lib/utils";

const HEIGHT = 600;

const PlaySketch_: React.FC<{ game: ProjectItem }> = ({ game }) => {
  const {
    loading,
    error,
    value: modules,
  } = useAsync(async () => {
    const [p5, sketch] = await Promise.all([
      import("p5"),
      import(`~/lib/sketches/${game.id}`),
      wait(1500), // wait for animation to finish
    ]);
    return { projectId: game.id, p5: p5.default, sketch: sketch.default };
  }, [game.id]);

  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!modules) return;

    const w = containerRef.current!.clientWidth;
    // const h = containerRef.current.clientHeight;

    const { projectId, sketch, p5: P5 } = modules;

    const scoreBoard = new ScoreBoard(projectId);

    const sketchInstance = new P5(
      (p5) => sketch({ p5, width: w, height: HEIGHT, P5, scoreBoard }),
      sketchRef.current!,
    );

    return () => {
      sketchInstance.remove();
      scoreBoard.dispose();
    };
  }, [modules]);

  let content;
  if (error) {
    console.error(error);
    content = <p className="shadowed error">Failed to load game :(</p>;
  } else if (loading)
    content = <div className="loading shadowed" style={{ height: HEIGHT }} />;
  else
    content = (
      <div
        ref={sketchRef}
        className="shadowed"
        style={{ height: HEIGHT, display: "inline-block", margin: "0 auto" }}
      />
    );

  return (
    <div ref={containerRef} className="text-center">
      {content}
    </div>
  );
};

export const PlaySketch = withErrorBoundary(PlaySketch_);
