import { ArrayList } from "java-to-javascript/lib/polyfills";

// This source code was converted directly from Java (specifically Processing)
// using npm module `java-to-javascript`

/** @type {SketchFactory} */
export default function arcDodger({ p5, width, height, scoreBoard }) {
  let target = null;
  let pies = null;
  let center = null;
  let gapAngle = 0;
  let growthSpeed = 0;
  let ringThickness = 0;
  let previousAngle = 0;
  let rotateSpeed = 0;
  let rotateDifference = 0;
  let ANGLE = 0;
  let time = 0;
  let startTime = 0;
  let leftKey = false;
  let rightKey = false;
  let spaceBar = false;
  let play = false;
  let difficultyTime = 0;
  let colorScheme = [
    p5.color(255, 0, 0),
    p5.color(255, 128, 0),
    p5.color(255, 255, 0),
    p5.color(0, 255, 0),
    p5.color(0, 255, 255),
    p5.color(0, 0, 255),
    p5.color(128, 0, 255),
    p5.color(255, 0, 255),
  ];

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.rectMode(p5.CENTER);
    p5.textAlign(p5.CENTER);
    p5.textSize(40);
    p5.ellipseMode(p5.CENTER);
    p5.noStroke();
    p5.noSmooth();
    p5.frameRate(30);
    pies = new ArrayList();
    center = p5.createVector(p5.width / 2, p5.height / 2 - 60);
    time = 0;
    gapAngle = p5.PI / 3;
    growthSpeed = 5;
    ringThickness = 30;
    rotateSpeed = 0.033;
    rotateDifference = p5.PI / 16;
    previousAngle = p5.PI / 2;
    ANGLE = 0;
    leftKey = rightKey = spaceBar = false;
    play = true;
    for (let i = 17; i >= 0; i--) {
      pies.add(new Pie(i * ringThickness, p5.PI / 2, colorSchemeSample()));
    }
    target = new Target(center.x, (5 * p5.height) / 6);
    startTime = p5.millis() / 1000;
    difficultyTime = p5.millis();
  };

  p5.draw = () => {
    p5.background(0);

    let justDied = false;

    if (play === true) {
      const millis = p5.millis();
      time = millis / 1000 - startTime;
      if (millis - difficultyTime > 10000 && p5.floor(time) >= 10) {
        let difficultyChange = 1.2;
        if (time > 40) {
          difficultyChange = 1.1;
        }
        rotateSpeed *= difficultyChange;
        growthSpeed *= difficultyChange;
        difficultyTime = millis;
      }
      let pF = pies.get(pies.size() - 1);
      if (leftKey) {
        ANGLE -= rotateSpeed;
      }
      if (rightKey) {
        ANGLE += rotateSpeed;
      }
      if (pF.radius >= ringThickness) {
        if (p5.random(0.0, 4.0) < 1.0) {
          rotateDifference *= -1;
        }
        previousAngle += rotateDifference;
        pies.add(
          new Pie(
            pF.radius - ringThickness,
            previousAngle,
            colorSchemeSample(),
          ),
        );
      }
      for (const p of pies) {
        p.move();
        if (p.collideTarget(target.pos.y - center.y)) {
          justDied = true;
        }
      }
      for (let i = pies.size() - 1; i >= 0; i--) {
        let p = pies.get(i);
        if (p.radius > p5.width / 1.3) {
          pies.remove(i);
        }
      }
      target.updateAngle(0.05);
    } else {
      target.die();

      if (spaceBar) {
        p5.setup();
      }
    }
    p5.push();
    p5.translate(center.x, center.y);
    p5.rotate(ANGLE);
    for (const p of pies) {
      p.display();
    }
    p5.pop();
    target.display();
    p5.fill(255, 190);
    p5.textSize(40);
    p5.text(time.toFixed(2), p5.width / 2, center.y / 2);

    if (!play && scoreBoard.topScores?.length) {
      p5.textSize(30);
      p5.fill(255, 230);
      p5.text("Top Scores:", p5.width / 2, center.y / 2 + 40);
      let i = 0;
      for (const { score, place, username } of scoreBoard.topScores) {
        p5.text(
          `${place}. ${username || "???"} - ${score}s`,
          p5.width / 2,
          center.y / 2 + 75 + i * 32,
        );
        i++;
      }
    }

    if (justDied) {
      play = false;
      scoreBoard.finishWithScore(Math.round(time * 100) / 100);
    }
  };

  const colorSchemeSample = () => {
    return p5.lerpColor(
      colorScheme[p5.floor((time / 10) % colorScheme.length)],
      colorScheme[p5.floor((time / 10 + 1) % colorScheme.length)],
      p5.random(1),
    );
  };

  p5.keyPressed = () => {
    if (p5.keyCode === 37) {
      leftKey = true;
    } else if (p5.keyCode === 39) {
      rightKey = true;
    } else if (p5.keyCode === 32) {
      spaceBar = true;
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === 37) {
      leftKey = false;
    } else if (p5.keyCode === 39) {
      rightKey = false;
    } else if (p5.keyCode === 32) {
      spaceBar = false;
    }
  };

  class Pie {
    constructor(i_radius, i_angle, i_FILL) {
      this.FILL = null;
      this.radius = 0;
      this.angle = 0;
      this.state = false;

      this.FILL = i_FILL;
      this.radius = i_radius;
      this.angle = i_angle;
      this.state = true;
    }
    display() {
      p5.fill(0);
      p5.ellipse(0, 0, 2 * this.radius - 1, 2 * this.radius - 1);
      p5.fill(this.FILL);
      p5.push();
      p5.rotate(this.angle);
      p5.arc(
        0,
        0,
        2 * this.radius,
        2 * this.radius,
        gapAngle / 2,
        p5.TWO_PI - gapAngle / 2,
      );
      p5.pop();
    }
    move() {
      if (this.angle < 0) {
        this.angle += p5.TWO_PI;
      }
      this.radius += growthSpeed;
    }
    collideTarget(targetDist) {
      return (
        targetDist > this.radius - ringThickness - 10 &&
        targetDist < this.radius + 10 &&
        !(
          ((ANGLE + this.angle) % p5.TWO_PI) - gapAngle / 2 < p5.PI / 2 &&
          ((ANGLE + this.angle) % p5.TWO_PI) + gapAngle / 2 > p5.PI / 2
        )
      );
    }
  }

  class Target {
    constructor(i_x, i_y) {
      this.pos = null;
      this.angle = 0;
      this.radius = 0;
      this.FILL = null;

      this.pos = p5.createVector(i_x, i_y);
      this.angle = 0;
      this.FILL = p5.color(225);
      this.radius = 10;
    }
    updateAngle(amount) {
      this.angle += amount;
    }
    die() {
      if (this.radius > 0) {
        this.angle -= 0.2;
        this.radius -= 0.5;
      }
    }
    display() {
      p5.fill(this.FILL);
      p5.push();
      p5.translate(this.pos.x, this.pos.y);
      p5.rotate(this.angle);
      p5.rect(0, 0, 2 * this.radius, 2 * this.radius);
      p5.pop();
    }
  }
}
