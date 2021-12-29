import { ArrayList } from 'java-to-javascript/lib/polyfills';

// This source code was converted directly from Java (specifically Processing)
// using npm module `java-to-javascript`

export default function hitBlockDie({ p5, width, height, P5 }) {
  let ship = null;
  let left = false;
  let right = false;
  let asteroids = null;
  let wall = null;
  let spawnDeltaTime = 0;
  let spawnTime = 0;

  p5.setup = () => {
    p5.createCanvas(width, height);
    ship = new Ship(
      p5.createVector(p5.width / 2, (5 * p5.height) / 6),
      p5.createVector(0, -1),
      20,
      p5.color(230, 230, 0),
    );
    left = right = false;
    asteroids = new ArrayList();
    wall = new Wall(p5.height, p5.color(255));
    p5.rectMode(p5.CORNERS);
    spawnDeltaTime = 160;
    p5.textAlign(p5.CENTER);
  };

  const newAsteroid = () => {
    if (p5.random(0, 1) < 0.35) {
      return new Asteroid(
        p5.createVector(p5.random(0, p5.width), ship.pos.y - p5.height),
        p5.random(90, 120),
        p5.color(255, 0, 0),
        true,
      );
    }
    return new Asteroid(
      p5.createVector(p5.random(0, p5.width), ship.pos.y - p5.height),
      p5.random(90, 120),
      p5.color(0, 0, 255),
      false,
    );
  };

  p5.draw = () => {
    p5.background(0);
    if (left && right) {
      ship.vel.setMag(Ship.boostVel);
      ship.boost = true;
    } else {
      ship.boost = false;
      ship.vel.setMag(Ship.slowVel);
      if (left) {
        ship.vel.rotate(-Ship.rotateSpeed);
      } else if (right) {
        ship.vel.rotate(Ship.rotateSpeed);
      }
    }
    ship.move();
    if (p5.millis() - spawnTime > spawnDeltaTime) {
      spawnTime = p5.millis() + p5.random(-100, 100);
      asteroids.add(newAsteroid());
      spawnDeltaTime -= 0.25;
    }
    for (let i = 0; i < asteroids.size(); i++) {
      let a = asteroids.get(i);
      let dist = ship.pos.dist(a.pos);
      if (dist < ship.size / 2 + a.size / 2) {
        if (a.killer || ship.boost === false) {
          p5.setup();
        } else {
          asteroids.remove(a);
        }
      } else if (a.belowWall(wall.y)) {
        asteroids.remove(a);
      }
    }
    wall.move();
    if (ship.belowWall(wall.y) || ship.pos.x < 0 || ship.pos.x > p5.width) {
      p5.setup();
    }
    p5.push();
    p5.translate(0, p5.height - 200 - ship.pos.y);
    for (const a of asteroids) {
      a.display();
    }
    ship.display();
    wall.display();
    p5.pop();
    p5.fill(255);
    p5.text(
      'Use left and right arrow keys to turn, and press both to boost.',
      p5.width / 2,
      30,
    );
  };

  p5.keyPressed = () => {
    if (p5.keyCode === p5.LEFT_ARROW) {
      left = true;
    } else if (p5.keyCode === p5.RIGHT_ARROW) {
      right = true;
    }
  };

  p5.keyReleased = () => {
    if (p5.keyCode === p5.LEFT_ARROW) {
      left = false;
    } else if (p5.keyCode === p5.RIGHT_ARROW) {
      right = false;
    }
  };

  class Asteroid {
    constructor(pos, size, c, killer) {
      this.killer = false;
      this.pos = null;
      this.size = 0;
      this.c = null;

      this.pos = pos;
      this.size = size;
      this.killer = killer;
      this.c = c;
    }
    display() {
      p5.fill(this.c);
      p5.stroke(0);
      p5.ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
    belowWall(y) {
      return this.pos.y - this.size / 2 > y;
    }
  }

  class Ship {
    constructor(pos, vel, size, c) {
      this.pos = null;
      this.vel = null;
      this.accel = null;
      this.boost = false;
      this.size = 0;
      this.c = null;
      this.body = null;
      this.trails = null;
      this.trailtime = 0;

      this.pos = pos;
      this.boost = false;
      this.vel = vel;
      this.accel = p5.createVector(0, 0);
      this.size = size;
      this.c = c;
      this.trails = new ArrayList();
      for (let i = 0; i < 8; i++) {
        this.trails.add(new Trail(this.pos, this.size, p5.color(255)));
      }
    }
    display() {
      if (p5.millis() - this.trailtime > 30) {
        this.trails.remove(this.trails.size() - 1);
        let d = p5.createVector(this.size / 2, 0);
        d.rotate(this.vel.heading());
        this.trails.add(
          0,
          new Trail(P5.Vector.sub(this.pos.copy(), d), this.size, 255),
        );
        this.trailtime = p5.millis();
      }
      for (const t of this.trails) {
        t.update();
        t.display();
      }
      p5.fill(this.c);
      p5.stroke(0);
      p5.push();
      p5.translate(this.pos.x, this.pos.y);
      p5.rotate(this.vel.heading());
      p5.triangle(
        -this.size / 2,
        -this.size / 2,
        -this.size / 2,
        this.size / 2,
        this.size / 2,
        0,
      );
      p5.pop();
    }
    move() {
      this.vel.add(this.accel);
      this.pos.add(this.vel);
      this.accel.set(0, 0, 0);
    }
    belowWall(y) {
      return this.pos.y - this.size / 2 > y;
    }
  }
  Ship.slowVel = 4;
  Ship.boostVel = 7;
  Ship.rotateSpeed = 0.04;

  class Trail {
    constructor(pos, size, c) {
      this.pos = null;
      this.size = 0;
      this.fade = 0;
      this.c = null;

      this.pos = pos;
      this.size = size;
      this.c = c;
      this.fade = 255;
    }
    update() {
      this.fade -= 20;
      this.size -= 0.3;
    }
    display() {
      p5.noStroke();
      p5.fill(this.c, this.fade);
      p5.ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
  }

  class Wall {
    constructor(y, c) {
      this.y = 0;
      this.c = null;

      this.y = y;
      this.c = c;
    }
    display() {
      p5.fill(this.c);
      p5.noStroke();
      p5.rect(0, 2 * p5.height, p5.width, this.y);
    }
    move() {
      this.y -= Wall.speed;
    }
  }
  Wall.speed = 5;
}
