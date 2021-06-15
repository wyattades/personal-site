import { ArrayList } from 'java-to-javascript/lib/polyfills';

// This source code was converted directly from Java (specifically Processing)
// using npm module `java-to-javascript`

export default function asteroids(p5, width, height) {
  let p = null;
  let bg = null;
  let bullets = null;
  let asteroids = null;
  let powerups = null;
  let press = false;
  let game = false;
  let dead = false;
  let timeB = 0;
  let timeA = 0;
  let score = 0;
  let highscore = 0;

  const setupGame = () => {
    p = new Player(
      p5.width / 2,
      p5.height / 2,
      0,
      0,
      6,
      0.1,
      0.5,
      0.6,
      40,
      12,
      p5.color(255, 255, 255),
    );
    bg = new Badguy(-400, p5.height / 2, 0, 0, 60, p5.color(0, 255, 0), 0.6, 3);
    dead = false;
    game = true;
    score = 0;
    bg.destroyed = false;
    bg.addedPu = false;
    bullets = new ArrayList();
    asteroids = new ArrayList();
    powerups = new ArrayList();
  };

  p5.setup = () => {
    p5.createCanvas(width, height);
    p5.noCursor();
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  const collision = (a, b) => {
    let DIST = p5.dist(a.x, a.y, b.x, b.y);
    return a.d / 2 + b.d / 2 >= DIST;
  };

  p5.draw = () => {
    p5.background(0);

    const millis = p5.millis();
    if (game === true) {
      bg.checkDestroyed();
      for (let i = bullets.size() - 1; i >= 0; i--) {
        let b = bullets.get(i);
        if (collision(b, bg)) {
          bg.reduce(4);
          bullets.remove(i);
          continue;
        }
        for (let j = asteroids.size() - 1; j >= 0; j--) {
          let a = asteroids.get(j);
          if (collision(b, a)) {
            a.reduce(30);
            bullets.remove(i);
            break;
          }
        }
      }
      for (let k = powerups.size() - 1; k >= 0; k--) {
        let pu = powerups.get(k);
        pu.fade();
        pu.display();
        if (pu.faded()) {
          powerups.remove(k);
        } else if (collision(p, pu)) {
          score += pu.points;
          powerups.remove(k);
        }
      }
      for (let j = asteroids.size() - 1; j >= 0; j--) {
        let a = asteroids.get(j);
        a.move();
        a.display();
        if (collision(a, p)) {
          dead = true;
        }
        if (a.destroyed()) {
          asteroids.remove(j);
          let r = p5.random(0, 10);
          if (r >= 0 && r <= 4) {
            powerups.add(
              new Powerup(a.x, a.y, 30, p5.color(255, 0, 0), 1, p5.color(255)),
            );
          } else if (r >= 9 && r <= 10) {
            powerups.add(
              new Powerup(
                a.x,
                a.y,
                20,
                p5.color(255, 255, 0),
                5,
                p5.color(255),
              ),
            );
          }
        }
      }
      for (let i = bullets.size() - 1; i >= 0; i--) {
        let b = bullets.get(i);
        b.move();
        b.display();
        if (b.outside()) {
          bullets.remove(b);
        }
      }
      if (dead === false) {
        p.move();
        p.display();
        if (score >= 10) {
          if (bg.destroyed === false) {
            bg.follow();
            bg.move();
            bg.display();
            if (collision(p, bg)) {
              dead = true;
            }
          }
          if (bg.destroyed === true && bg.addedPu === false) {
            powerups.add(
              new Powerup(
                bg.x,
                bg.y,
                20,
                p5.color(0, 255, 0),
                10,
                p5.color(255),
              ),
            );
            bg.addedPu = true;
          }
        }
        if (press === true) {
          if (millis > timeB) {
            timeB = millis + 200;
            let xpos = p.x + p5.cos(p.angle + p5.PI / 2) * p.d;
            let ypos = p.y + p5.sin(p.angle + p5.PI / 2) * p.d;
            bullets.add(
              new Bullet(xpos, ypos, 12, 12, 7, p5.color(255, 255, 255)),
            );
          }
        }
        if (millis > timeA) {
          timeA = millis + 200;
          let angle = p5.random(0, 2 * p5.PI);
          let xpos =
            p5.width / 2 +
            (p5.cos(angle) * p5.sqrt(p5.sq(p5.height) + p5.sq(p5.width))) / 2 +
            p5.random(50, 150);
          let ypos =
            p5.height / 2 +
            (p5.sin(angle) * p5.sqrt(p5.sq(p5.height) + p5.sq(p5.width))) / 2 +
            p5.random(50, 150);
          let randomS = p5.random(1, 4);
          let randomA = p5.random(-90, 90);
          asteroids.add(
            new Asteroid(
              xpos,
              ypos,
              -1 * randomS * p5.cos(angle + randomA),
              p5.random(-3, 3) + -1 * randomS * p5.sin(angle + randomA),
              p5.random(70, 200),
              p5.color(180),
            ),
          );
        }
      }
      if (dead === true) {
        p5.textSize(60);
        p5.stroke(255);
        p5.fill(255);
        p5.text('Press [SPACE] to Restart', p5.width / 2, p5.height / 2);
      }
    }
    if (game === false && dead === false) {
      p5.textSize(60);
      p5.stroke(255);
      p5.text('Press [SPACE] to Begin', p5.width / 2, p5.height / 2);
      p5.textSize(40);
      p5.text(
        'HINT: use WASD to move your player, \nand use the mouse to shoot asteroids',
        p5.width / 2,
        p5.height / 2 + 200,
      );
    }
    if (highscore <= score) {
      highscore = score;
    }
    p5.fill(255);
    p5.strokeWeight(2);
    p5.textSize(40);
    p5.text(score, 60, 80);
    p5.text(highscore, p5.width - 80, 80);
    p5.textSize(25);
    p5.text('Score:', 60, 40);
    p5.text('HighScore:', p5.width - 80, 40);
  };

  p5.mousePressed = () => {
    if (dead === false && game === true && p5.mouseButton === p5.LEFT) {
      press = true;
    }
  };

  p5.mouseReleased = () => {
    if (p5.mouseButton === p5.LEFT) {
      press = false;
    }
  };

  p5.keyPressed = () => {
    if (p5.keyCode === 87) {
      p.up = true;
    } else if (p5.keyCode === 65) {
      p.left = true;
    } else if (p5.keyCode === 83) {
      p.down = true;
    } else if (p5.keyCode === 68) {
      p.right = true;
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === 87) {
      p.up = false;
    } else if (p5.keyCode === 65) {
      p.left = false;
    } else if (p5.keyCode === 83) {
      p.down = false;
    } else if (p5.keyCode === 68) {
      p.right = false;
    } else if (p5.keyCode === 32) {
      if ((game === false && dead === false) || dead === true) {
        setupGame();
      }
    }
  };

  class Asteroid {
    constructor(Tx, Ty, Txs, Tys, Td, Tc) {
      this.x = 0;
      this.y = 0;
      this.xs = 0;
      this.ys = 0;
      this.c = null;
      this.d = 0;

      this.x = Tx;
      this.y = Ty;
      this.xs = Txs;
      this.ys = Tys;
      this.d = Td;
      this.c = Tc;
    }
    move() {
      this.x += this.xs;
      this.y += this.ys;
    }
    display() {
      p5.fill(this.c);
      p5.ellipse(this.x, this.y, this.d, this.d);
    }
    reduce(amount) {
      this.d -= amount;
      if (p5.abs(this.xs) > 0.5) {
        this.xs /= 1.5;
      }
      if (p5.abs(this.ys) > 0.5) {
        this.ys /= 1.5;
      }
    }
    destroyed() {
      return this.d <= 50;
    }
  }

  class Badguy {
    constructor(Tx, Ty, Txs, Tys, Td, Tc, Tbounce, Tmaxs) {
      this.x = 0;
      this.y = 0;
      this.xs = 0;
      this.ys = 0;
      this.bounce = 0;
      this.maxs = 0;
      this.d = 0;
      this.c = null;
      this.destroyed = false;
      this.addedPu = false;

      this.x = Tx;
      this.y = Ty;
      this.xs = Txs;
      this.ys = Tys;
      this.d = Td;
      this.c = Tc;
      this.bounce = Tbounce;
      this.maxs = Tmaxs;
    }
    move() {
      this.x += this.xs;
      this.y += this.ys;
      if (this.xs >= this.maxs) {
        this.xs = this.maxs;
      }
      if (this.xs <= -this.maxs) {
        this.xs = -this.maxs;
      }
      if (this.ys >= this.maxs) {
        this.ys = this.maxs;
      }
      if (this.ys <= -this.maxs) {
        this.ys = -this.maxs;
      }
      if (this.x - this.d / 2 <= 0) {
        this.x = this.d / 2;
        this.xs = this.xs * -this.bounce;
      }
      if (this.x + this.d / 2 >= p5.width) {
        this.x = p5.width - this.d / 2;
        this.xs = this.xs * -this.bounce;
      }
      if (this.y - this.d / 2 <= 0) {
        this.y = this.d / 2;
        this.ys = this.ys * -this.bounce;
      }
      if (this.y + this.d / 2 >= p5.height) {
        this.y = p5.height - this.d / 2;
        this.ys = this.ys * -this.bounce;
      }
    }
    checkDestroyed() {
      if (this.d <= 16) {
        this.destroyed = true;
      }
    }
    reduce(r) {
      this.d -= r;
    }
    follow() {
      if (this.x < p.x) {
        this.xs += 0.1;
      }
      if (this.x > p.x) {
        this.xs += -0.1;
      }
      if (this.y < p.y) {
        this.ys += 0.1;
      }
      if (this.y > p.y) {
        this.ys += -0.1;
      }
    }
    display() {
      p5.fill(this.c);
      p5.ellipse(this.x, this.y, this.d, this.d);
    }
  }

  class Bullet {
    constructor(Tx, Ty, Txs, Tys, Td, Tc) {
      this.x = 0;
      this.y = 0;
      this.xs = 0;
      this.ys = 0;
      this.d = 0;
      this.c = null;

      this.x = Tx;
      this.y = Ty;
      this.xs = Txs * p5.cos(p.angle + p5.PI / 2);
      this.ys = Tys * p5.sin(p.angle + p5.PI / 2);
      this.d = Td;
      this.c = Tc;
    }
    move() {
      this.x += this.xs;
      this.y += this.ys;
    }
    display() {
      p5.fill(this.c);
      p5.ellipse(this.x, this.y, this.d, this.d);
    }
    outside() {
      return (
        this.x - this.d / 2 > p5.width ||
        this.x + this.d / 2 < 0 ||
        this.y - this.d / 2 > p5.height ||
        this.y + this.d / 2 < 0
      );
    }
  }

  class Player {
    constructor(Tx, Ty, Txs, Tys, Tmaxs, Tslow, Tfast, Tbounce, Td, Tcd, Tc) {
      this.up = false;
      this.down = false;
      this.left = false;
      this.right = false;
      this.faster = false;
      this.x = 0;
      this.y = 0;
      this.xs = 0;
      this.ys = 0;
      this.maxs = 0;
      this.slow = 0;
      this.fast = 0;
      this.bounce = 0;
      this.angle = 0;
      this.d = 0;
      this.cd = 0;
      this.c = null;

      this.x = Tx;
      this.y = Ty;
      this.xs = Txs;
      this.ys = Tys;
      this.d = Td;
      this.cd = Tcd;
      this.maxs = Tmaxs;
      this.slow = Tslow;
      this.fast = Tfast;
      this.bounce = Tbounce;
      this.c = Tc;
    }
    display() {
      p5.strokeWeight(1.5);
      p5.stroke(this.c);
      p5.fill(0);
      p5.ellipse(this.x, this.y, this.d, this.d);
      p5.strokeWeight(1);
      this.angle = p5.atan2(p5.mouseY - this.y, p5.mouseX - this.x) - p5.PI / 2;
      p5.push();
      p5.translate(this.x, this.y);
      p5.rotate(this.angle);
      p5.rectMode(p5.CENTER);
      p5.fill(255);
      p5.rect(0, this.d / 2, this.d / 7, this.d / 3);
      p5.pop();
      p5.noFill();
      p5.ellipse(p5.mouseX, p5.mouseY, this.cd, this.cd);
      p5.line(
        p5.mouseX - this.cd / 2,
        p5.mouseY,
        p5.mouseX + this.cd / 2,
        p5.mouseY,
      );
      p5.line(
        p5.mouseX,
        p5.mouseY - this.cd / 2,
        p5.mouseX,
        p5.mouseY + this.cd / 2,
      );
    }
    bounceOffBoundary() {
      if (this.x - this.d / 2 <= 0) {
        this.x = this.d / 2;
        this.xs = this.xs * -this.bounce;
      }
      if (this.x + this.d / 2 >= p5.width) {
        this.x = p5.width - this.d / 2;
        this.xs = this.xs * -this.bounce;
      }
      if (this.y - this.d / 2 <= 0) {
        this.y = this.d / 2;
        this.ys = this.ys * -this.bounce;
      }
      if (this.y + this.d / 2 >= p5.height) {
        this.y = p5.height - this.d / 2;
        this.ys = this.ys * -this.bounce;
      }
    }
    maxSpeed() {
      if (this.xs >= this.maxs) {
        this.xs = this.maxs;
      }
      if (this.ys >= this.maxs) {
        this.ys = this.maxs;
      }
      if (this.xs <= -this.maxs) {
        this.xs = -this.maxs;
      }
      if (this.ys <= -this.maxs) {
        this.ys = -this.maxs;
      }
    }
    keyMove() {
      if (this.up) {
        this.faster = true;
        this.ys -= this.fast;
      } else {
        this.faster = false;
      }
      if (this.left) {
        this.xs -= this.fast;
        this.faster = true;
      } else {
        this.faster = false;
      }
      if (this.down) {
        this.ys += this.fast;
        this.faster = true;
      } else {
        this.faster = false;
      }
      if (this.right) {
        this.xs += this.fast;
        this.faster = true;
      } else {
        this.faster = false;
      }
    }
    move() {
      this.keyMove();
      this.bounceOffBoundary();
      this.maxSpeed();
      if (this.faster === false) {
        if (this.xs < 0) {
          this.xs += this.slow;
        }
        if (this.xs > 0) {
          this.xs -= this.slow;
        }
        if (this.ys < 0) {
          this.ys += this.slow;
        }
        if (this.ys > 0) {
          this.ys -= this.slow;
        }
        if (this.xs < this.slow && this.xs > -this.slow) {
          this.xs = 0;
        }
        if (this.ys < this.slow && this.ys > -this.slow) {
          this.ys = 0;
        }
      }
      this.x += this.xs;
      this.y += this.ys;
    }
  }

  class Powerup {
    constructor(Tx, Ty, Td, Tcf, Tpoints, Tcs) {
      this.x = 0;
      this.y = 0;
      this.d = 0;
      this.points = 0;
      this.f = 255;
      this.cs = null;
      this.cf = null;
      this.puAdded = false;

      this.x = Tx;
      this.y = Ty;
      this.d = Td;
      this.cs = Tcs;
      this.points = Tpoints;
      this.cf = Tcf;
    }
    fade() {
      this.f--;
    }
    display() {
      p5.fill(this.cf, this.f);
      p5.stroke(this.cs, this.f);
      p5.ellipse(this.x, this.y, this.d, this.d);
    }
    faded() {
      return this.f <= 10;
    }
  }
}
