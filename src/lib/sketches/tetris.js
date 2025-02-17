/** @type {SketchFactory} */
export default function tetris({ p5, width, height }) {
  const SHAPES = [
    {
      name: 'Cube',
      points: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    },
    {
      name: 'Hockey',
      points: [
        [0, -1],
        [0, 0],
        [0, 1],
        [1, 1],
      ],
    },
    {
      name: 'Stick',
      points: [
        [0, -1],
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    },
    {
      name: 'ZigZag',
      points: [
        [0, -1],
        [0, 0],
        [1, 0],
        [1, 1],
      ],
    },
  ];

  // 0: 2, 4
  // 1: 4, -2
  // 2: -2, -4
  // 3: -4, 2
  function rotateCoords([x, y], rotation) {
    rotation %= 4;
    while (rotation < 0) rotation += 4;

    if (rotation === 0) return [x, y];
    if (rotation === 1) return [y, -x];
    if (rotation === 2) return [-x, -y];
    if (rotation === 3) return [-y, x];
    throw new Error('oops');
  }

  class Piece {
    constructor() {
      this.shape = p5.random(SHAPES);
      this.x = Math.round(GRID_W / 2);
      this.y = 0;
      this.color = p5.color(p5.random(0, 255), 75, 60);
      this.rotation = 0; // 0 = up, 1 = right, 2 = down, etc.
    }

    *iteratePoints(dx = 0, dy = 0, dr = 0) {
      for (const coords of this.shape.points) {
        const [sx, sy] = rotateCoords(coords, this.rotation + dr);
        yield [this.x + sx + dx, this.y + sy + dy];
      }
    }

    outOfBounds(dirX = null, dirY = null, deltaRot = 0) {
      for (const [sx, sy] of this.iteratePoints(
        dirX ?? 0,
        dirY ?? 0,
        deltaRot,
      )) {
        if (dirY != null && sy >= GRID_H) return true;
        if (dirX != null && (sx < 0 || sx >= GRID_W)) return true;
      }

      return this.hittingOthers(dirX ?? 0, dirY ?? 0, deltaRot);
    }

    hittingOthers(dirX, dirY, deltaRot = 0) {
      for (let row = 0; row < GRID_H; row++) {
        for (let col = 0; col < GRID_W; col++) {
          const voxel = voxels[row][col];
          if (!voxel) continue;
          for (const [sx, sy] of this.iteratePoints(dirX, dirY, deltaRot)) {
            if (sx === col && sy === row) return true;
          }
        }
      }
      // for (const other of pieces) {
      //   if (other == this) continue;
      //   for (const [ox, oy] of other.iteratePoints()) {
      //     for (const [sx, sy] of this.iteratePoints()) {
      //       if (sx + dirX == ox && sy + dirY == oy) return true;
      //     }
      //   }
      // }
      return false;
    }
  }

  let activePiece = null;

  const GRID_W = 12;
  const GRID_H = 24;
  // const BLOCK_SIZE = 24;
  const BLOCK_SIZE = Math.min(width / GRID_W, height / GRID_H);

  let pieces = [];

  let voxels;

  p5.setup = () => {
    p5.createCanvas(GRID_W * BLOCK_SIZE, GRID_H * BLOCK_SIZE);
    p5.colorMode(p5.HSL);

    activePiece = new Piece();
    pieces.push(activePiece);

    voxels = Array.from({ length: GRID_H }).map(() =>
      Array.from({ length: GRID_W }).fill(null),
    );
  };

  function drawPieces() {
    for (const piece of pieces) {
      p5.fill(piece.color);
      for (const [sx, sy] of piece.iteratePoints()) {
        p5.rect(sx * BLOCK_SIZE, sy * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    for (let row = 0; row < GRID_H; row++) {
      for (let col = 0; col < GRID_W; col++) {
        const voxel = voxels[row][col];
        if (!voxel) continue;

        p5.fill(voxel.color);
        p5.rect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  let autoMoveTimer = -1;
  let manualDropTimer = -1;

  let completedPieces = 0;

  let gameOver = false;

  p5.draw = () => {
    p5.background(40);
    p5.textAlign(p5.CENTER);

    const now = p5.millis();

    if (gameOver) {
      drawPieces();
      p5.textSize(42);
      p5.fill(0, 100, 50);
      p5.text('GAME OVER', p5.width / 2, p5.height / 2);
      p5.textSize(20);
      p5.fill(0, 100, 100);
      p5.text('Press [SPACE] to restart', p5.width / 2, p5.height / 2 + 40);
    } else {
      const autoDropEvery = p5.map(completedPieces, 0, 10, 300, 70, true);
      const manualDropEvery = Math.min(autoDropEvery, 100);

      if (!p5.keyIsDown(p5.DOWN_ARROW) && now - autoMoveTimer > autoDropEvery) {
        dropPiece();
        autoMoveTimer = now;
      }

      if (
        p5.keyIsDown(p5.DOWN_ARROW) &&
        now - manualDropTimer > manualDropEvery
      ) {
        dropPiece();
        manualDropTimer = now;
      }

      drawPieces();
    }
  };

  function movePiece(dirX) {
    if (!activePiece.outOfBounds(dirX, 0)) activePiece.x += dirX;
  }

  function dropPiece(dirY = 1) {
    if (activePiece.outOfBounds(0, dirY)) {
      console.log('hit rock bottom');

      for (const [sx, sy] of activePiece.iteratePoints()) {
        if (voxels[sy]?.[sx] === undefined) {
          gameOver = true;
          return;
        }

        voxels[sy][sx] = {
          // x: sx,
          // y: sy,
          color: activePiece.color,
        };
      }

      activePiece = new Piece();
      pieces = [activePiece];
      completedPieces += 1;

      wipeRows();
    } else {
      activePiece.y += dirY;
    }
  }

  function rotatePiece(deltaRot) {
    if (!activePiece.outOfBounds(0, 0, deltaRot)) {
      // FIXME
      // activePiece.x += (activePiece.x > GRID_W / 2 ? -1 : 1);
      activePiece.rotation += deltaRot;
    }
  }

  function wipeRows() {
    const toRemoveRows = [];
    for (let row = 0; row < GRID_H; row++) {
      let fullRow = true;
      for (let col = 0; col < GRID_W; col++) {
        const voxel = voxels[row][col];
        if (!voxel) {
          fullRow = false;
          break;
        }
      }
      if (fullRow) toRemoveRows.unshift(row);
    }

    // bottom rows first
    for (const row of toRemoveRows) {
      voxels.splice(row, 1);
    }
    voxels.unshift(
      ...Array.from({ length: toRemoveRows.length }).map(() =>
        Array.from({ length: GRID_W }).fill(null),
      ),
    );
  }

  p5.keyPressed = () => {
    if (gameOver) {
      if (p5.key === ' ') {
        p5.setup();
      }
      return;
    }

    if (p5.keyCode === p5.LEFT_ARROW) {
      movePiece(-1);
    } else if (p5.keyCode === p5.RIGHT_ARROW) {
      movePiece(1);
    } else if (p5.keyCode === p5.DOWN_ARROW) {
      dropPiece();
    } else if (p5.key === 'z') {
      rotatePiece(-1);
    } else if (p5.key === 'x') {
      rotatePiece(1);
    }
  };
}
