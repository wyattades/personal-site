/** @type {SketchFactory} */
export default function boingoBug({ p5, height }) {
  let pipe1 = null;
  let pipe2 = null;
  let bug = null;
  let on = false;
  let dead = false;
  let flap = false;
  let score = 0;
  let maxTiltAngle = p5.PI * 0.35;

  const setupGame = () => {
    bug = new Bug(80, 250, 0);
    pipe1 = new Pipe(650);
    pipe2 = new Pipe(450);
    score = 0;
  };

  p5.setup = () => {
    p5.createCanvas(((height * 2) / 3) | 0, height);
    p5.textAlign(p5.CENTER, p5.CENTER);
    setupGame();
  };

  p5.draw = () => {
    p5.background('#52C8FC');
    if ((on === true) & (dead === false)) {
      pipe1.move();
      pipe2.move();
      bug.move();
    }
    pipe1.hit(bug);
    pipe2.hit(bug);
    bug.display();
    pipe2.display();
    pipe1.display();
    p5.fill('#AF8730');
    p5.noStroke();
    p5.rectMode(p5.CORNERS);
    p5.rect(0, p5.height - 30, p5.width, p5.height);
    p5.fill('#15D320');
    p5.rect(0, p5.height - 30, p5.width, p5.height - 25);
    pipe2.displayground();
    if ((on === false) & (dead === true)) {
      p5.fill(0);
      p5.textSize(40);
      p5.text('YOU ARE DEAD', p5.width / 2, 190);
      p5.textSize(20);
      p5.text('Press [SPACE] to Restart', p5.width / 2, 225);
    }
    if (on === false && dead === false) {
      p5.textSize(20);
      p5.fill(0);
      p5.text('Press [SPACE] to Boing', p5.width / 2, 70);
    }
    p5.fill(0);
    p5.textSize(20);
    p5.text(score, p5.width / 2, p5.height - 13);
  };

  p5.keyPressed = () => {
    if (p5.keyCode === 32) {
      if (on === false && dead === false) {
        on = true;
      }
      if (on === true && dead === false && flap === false) {
        bug.jump();
        flap = true;
      }
      if (on === false && dead === true) {
        dead = false;
        setupGame();
      }
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === 32 && on === true && dead === false) {
      flap = false;
      bug.stopjump();
    }
  };

  class Bug {
    constructor(TempX, TempY, Tempspeed) {
      this.x = 0;
      this.y = 0;
      this.speed = 0;
      this.boing = false;
      this.c = false;

      this.x = TempX;
      this.y = TempY;
      this.speed = Tempspeed;
    }
    move() {
      this.y += this.speed;
      this.speed += 0.2;
      if (this.y >= p5.height - 46) {
        this.y = p5.height - 46;
        dead = true;
        on = false;
      }
    }
    display() {
      p5.rectMode(p5.CENTER);
      p5.fill('#E02F02');
      p5.stroke(0, 0, 0, 100);
      p5.push();
      p5.translate(this.x, this.y);
      p5.rotate(p5.constrain(this.speed * 0.1, -maxTiltAngle, maxTiltAngle));
      p5.ellipse(0, 0, 30, 30);
      p5.fill(255);
      p5.noStroke();
      p5.ellipse(3, -2, 12, 12);
      p5.noStroke();
      p5.fill(255);
      p5.rect(12, 6, 6, 4);
      p5.strokeWeight(4);
      p5.stroke(0);
      p5.line(8, 0 - 14, 15, -18);
      p5.line(20, 0 - 14, 15, -18);
      p5.line(0, 0 - 14, 2, -20);
      p5.line(9, 0 - 24, 2, -20);
      p5.strokeWeight(1);
      p5.stroke(200);
      if (flap === true) {
        p5.arc(-12, 0, 11, 17, 0, 5 * p5.QUARTER_PI, p5.OPEN);
      }
      if (flap === false) {
        p5.arc(-14, -4, 17, 11, 2 * p5.QUARTER_PI, 7 * p5.QUARTER_PI, p5.OPEN);
      }
      if (dead === true) {
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.line(0, -5, 6, 1);
        p5.line(6, -5, 0, 1);
      }
      if (dead === false) {
        p5.noStroke();
        p5.fill(0);
        p5.ellipse(4, -2, 7, 7);
      }
      p5.pop();
    }
    jump() {
      this.boing = true;
      if (this.boing === true) {
        this.speed = -4.2;
      }
    }
    stopjump() {
      this.boing = false;
    }
  }

  class Pipe {
    constructor(tempX) {
      this.x = 0;
      this.y = 0;
      this.scored = false;

      this.x = tempX;
    }
    move() {
      this.x -= 1.3;
      if (this.x < -35) {
        this.x = p5.width + 35;
      }
      if (this.x >= p5.width + 35) {
        this.y = p5.random(-180, 70);
        this.scored = false;
      }
      if (bug.x > this.x && this.scored === false) {
        this.scored = true;
        score++;
      }
    }
    hit(b) {
      if (
        b.x + 15 >= this.x - 35 &&
        b.x - 15 <= this.x + 35 &&
        (b.y + 15 >= this.y + 350 || b.y - 15 <= this.y + 250)
      ) {
        dead = true;
        on = false;
      }
    }
    display() {
      p5.fill('#177C04');
      p5.noStroke();
      p5.rectMode(p5.CENTER);
      p5.rect(this.x, this.y, 60, 455);
      p5.rect(this.x, this.y + 600, 60, 455);
      p5.rect(this.x, this.y + 360, 70, 20);
      p5.rect(this.x, this.y + 240, 70, 20);
    }
    displayground() {
      p5.fill('#25892B');
      p5.rectMode(p5.CORNERS);
      for (let i = -50; i < 50; i++) {
        p5.rect(
          this.x + 10 * i,
          p5.height - 30,
          this.x + 10 * i - 5,
          p5.height - 25,
        );
      }
    }
  }
}
