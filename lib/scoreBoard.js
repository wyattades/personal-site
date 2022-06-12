import * as _ from 'lodash-es';

import { sessionJsonStorage } from 'lib/utils/jsonStorage';
import { collection, dbNow } from 'lib/db';

export class ScoardBoard {
  topScores = null;

  constructor(sketchSlug) {
    this.sketchSlug = sketchSlug;
    this.db = collection(`sketch_scoreboards/${this.sketchSlug}/entries`);
  }

  async finishWithScore(score) {
    this.topScores = null;

    const username = sessionJsonStorage.fetch(
      'sketch-leaderboard-username',
      () => {
        return window.prompt('Enter a username for the scoreboard:') || null;
      },
    );

    let savedScoreId = null;
    if (username && score != null) {
      const session = sessionJsonStorage.fetch(
        'sketch-leaderboard-session',
        () => Math.random().toString().slice(2) + '-' + Date.now().toString(),
      );

      savedScoreId = await this.db.add({
        score,
        username,
        session,
        created_at: dbNow(),
      });
    }

    let scores = await this.db.get({
      order: { score: 'desc', created_at: 'desc' },
    });

    let latest = null;
    if (savedScoreId) {
      [latest] = _.remove(scores, (s) => s.id === savedScoreId);
    } else if (score != null) {
      latest = {
        id: null,
        score,
        username: username || 'YOU',
      };
    }

    scores = _.uniqBy(scores, (d) => d.username);

    // insert into already-sorted array
    if (latest) {
      const i = scores.findIndex((s) => latest.score <= s.score);
      if (i === -1) scores.push(latest);
      else scores.splice(i, 0, latest);
    }

    scores.forEach((d, i) => {
      d.place = i + 1;
    });

    // get the top 5 scores
    this.topScores = scores.slice(0, 5);

    // add our latest score if it's not already in topScores
    if (latest && !this.topScores.includes(latest)) this.topScores.push(latest);
  }

  dispose() {
    this.topScores = null;
  }
}
