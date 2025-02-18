import type { Timestamp } from "firebase/firestore";
import * as _ from "lodash-es";

import { type Collection, collection, dbNow } from "~/lib/db";
import { sessionJsonStorage } from "~/lib/utils/json-storage";

export type ScoreEntry = {
  score: number;
  username: string;
  session: string;
  created_at: Timestamp;
};

export class ScoreBoard {
  topScores: (ScoreEntry & { id: string | null; place: number })[] | null =
    null;

  db: Collection<ScoreEntry>;

  constructor(readonly sketchSlug: string) {
    this.db = collection<ScoreEntry>(
      `sketch_scoreboards/${this.sketchSlug}/entries`,
    );
  }

  async finishWithScore(score: number) {
    this.topScores = null;

    const username = sessionJsonStorage.fetch(
      "sketch-leaderboard-username",
      () => {
        return window.prompt("Enter a username for the scoreboard:") || null;
      },
    );

    let savedScoreId = null;
    if (username && score != null) {
      const session = sessionJsonStorage.fetch(
        "sketch-leaderboard-session",
        () => Math.random().toString().slice(2) + "-" + Date.now().toString(),
      );

      savedScoreId = await this.db.add({
        score,
        username,
        session,
        created_at: dbNow(),
      });
    }

    let scores: (ScoreEntry & { id: string | null })[] = await this.db.get({
      order: { score: "desc", created_at: "desc" },
    });

    let latest: (ScoreEntry & { id: string | null }) | undefined;
    if (savedScoreId) {
      [latest] = _.remove(scores, (s) => s.id === savedScoreId);
    } else if (score != null) {
      latest = {
        id: null,
        score,
        username: username || "YOU",
        session: "",
        created_at: dbNow(),
      };
    }

    scores = _.uniqBy(scores, (d) => d.username);

    // insert into already-sorted array
    if (latest) {
      const i = scores.findIndex((s) => latest.score <= s.score);
      if (i === -1) scores.push(latest);
      else scores.splice(i, 0, latest);
    }

    // get the top 5 scores
    this.topScores = scores.slice(0, 5).map((s, i) => ({ ...s, place: i + 1 }));

    // add our latest score if it's not already in topScores
    if (latest && !this.topScores.some((s) => s.id === latest.id))
      this.topScores.push({ ...latest, place: this.topScores.length + 1 });
  }

  dispose() {
    this.topScores = null;
  }
}
