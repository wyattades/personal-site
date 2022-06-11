import * as _ from 'lodash-es';

import { jsonStorage, wait } from 'lib/utils';

export class ScoardBoard {
  constructor(sketchSlug) {
    this.sketchSlug = sketchSlug;
    this.scores = jsonStorage.get(this.storageKey) || [];
    this.topScores = null;
  }

  get storageKey() {
    return `sketch-leaderboard:${this.sketchSlug}`;
  }

  async finishWithScore(score) {
    this.scores.push({
      score,
      username: window.prompt('Enter a username:'),
    });
    jsonStorage.set(this.storageKey, this.scores);

    await wait(1000);

    this.topScores = _.sortBy(this.scores, (d) => -d.score)
      .slice(0, 5)
      .map((d, i) => ({
        ...d,
        place: i + 1,
      }));
  }

  dispose() {
    this.scores = this.topScores = null;
  }
}
