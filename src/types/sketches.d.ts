import type P5 from "p5";

import type { ScoreBoard } from "lib/scoreBoard";

declare global {
  type SketchFactory = (args: {
    p5: P5;
    width: number;
    height: number;
    scoreBoard: ScoreBoard;
  }) => void;
}
