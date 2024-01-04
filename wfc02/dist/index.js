"use strict";
const TILE_SIZE = 32;
const GRID_SIZE = 20;
const IMAGES = [];
var Socket;
(function (Socket) {
  Socket[(Socket["White"] = 0)] = "White";
  Socket[(Socket["Green"] = 1)] = "Green";
  Socket[(Socket["Blue"] = 2)] = "Blue";
})(Socket || (Socket = {}));
const PIXELS_COORDS = [
  [0, 0],
  [7, 0],
  [15, 0],
  [15, 7],
  [15, 15],
  [7, 15],
  [0, 15],
  [0, 7],
];
const PIXELS_INDEXES = [0, 7, 15, 127, 255, 247, 240, 128];
const TILES = [];
const CELLS = [];
function preload() {
  for (let i = 0; i <= 4; i++) {
    IMAGES.push(loadImage(`images/wfc_rr${i.toString().padStart(2, "0")}.png`));
  }
}
function setup() {
  let canvasRenderer = createCanvas(
    TILE_SIZE * GRID_SIZE,
    TILE_SIZE * GRID_SIZE
  );
  canvasRenderer.parent("container");
  background(200);
  noSmooth();
  initTiles();
  initPlugs();
  initCells();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      noFill;
      stroke(0);
      square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE);
    }
  }
}
function draw() {
  const notCollapsedCells = CELLS.filter(
    (c) => c.choices.length == 1 && !c.collapsed
  );
  if (notCollapsedCells.length > 0) {
    const notCollapsedCell = random(notCollapsedCells);
    collapseCell({ ...notCollapsedCell });
    return;
  }
  const sortedCells = CELLS.filter((c) => c.choices.length > 1).sort(
    (a, b) => a.choices.length - b.choices.length
  );
  if (sortedCells.length < 1) {
    noLoop();
    return;
  }
  const currentCell = random(
    sortedCells.filter((c) => c.choices.length == sortedCells[0].choices.length)
  );
  collapseCell({ ...currentCell });
}
function initPlugs() {
  for (let i = 0; i < TILES.length; i++) {
    for (let j = 0; j < TILES.length; j++) {
      const t1s = TILES[i].sockets;
      const t2s = TILES[j].sockets;
      if (
        [t1s[0], t1s[1], t1s[2]].every(
          (s, k) => s == [t2s[4], t2s[5], t2s[6]].reverse()[k]
        )
      ) {
        TILES[i].plugs.up.push(TILES[j].id);
      }
      if (
        [t1s[2], t1s[3], t1s[4]].every(
          (s, k) => s == [t2s[6], t2s[7], t2s[0]].reverse()[k]
        )
      ) {
        TILES[i].plugs.right.push(TILES[j].id);
      }
      if (
        [t1s[4], t1s[5], t1s[6]].every(
          (s, k) => s == [t2s[0], t2s[1], t2s[2]].reverse()[k]
        )
      ) {
        TILES[i].plugs.down.push(TILES[j].id);
      }
      if (
        [t1s[6], t1s[7], t1s[0]].every(
          (s, k) => s == [t2s[2], t2s[3], t2s[4]].reverse()[k]
        )
      ) {
        TILES[i].plugs.left.push(TILES[j].id);
      }
    }
  }
}
function initTiles() {
  for (let i = 0; i < IMAGES.length; i++) {
    for (let j = 0; j <= 3; j++) {
      TILES.push({
        id: `${i}${j}`,
        image: IMAGES[i],
        rotation: j,
        sockets: computeSockets(IMAGES[i], j),
        plugs: { up: [], right: [], down: [], left: [] },
      });
    }
  }
}
function computeSockets(image, rotation) {
  const sockets = [];
  let pixelsCoords = PIXELS_COORDS.slice(0, 9);
  for (let i = 0; i < rotation * 2; i++) {
    const element = pixelsCoords.shift();
    if (element != undefined) {
      pixelsCoords.push(element);
    }
  }
  for (let i = 0; i < pixelsCoords.length; i++) {
    const color = image.get(pixelsCoords[i][0], pixelsCoords[i][1]);
    switch (Math.floor(color[0] / 30)) {
      case 0:
        sockets.push(Socket.Green);
        break;
      case 8:
        sockets.push(Socket.White);
        break;
      case 2:
        sockets.push(Socket.Blue);
        break;
      default:
        break;
    }
  }
  return sockets;
}
function initCells() {
  const choices = [];
  for (let x = 0; x < IMAGES.length; x++) {
    for (let y = 0; y <= 3; y++) {
      choices.push(`${x}${y}`);
    }
  }
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    CELLS.push({
      index: i,
      collapsed: false,
      choices: choices,
    });
  }
}
function collapseCell(c) {
  fill("red");
  noStroke();
  square(
    (c.index % GRID_SIZE) * TILE_SIZE,
    Math.floor(c.index / GRID_SIZE) * TILE_SIZE,
    TILE_SIZE
  );
  c.choices = [random(c.choices)];
  const currentTile = TILES.filter((t) => t.id == c.choices[0])[0];
  let up = { index: 0, collapsed: true, choices: [] };
  let right = { index: 0, collapsed: true, choices: [] };
  let down = { index: 0, collapsed: true, choices: [] };
  let left = { index: 0, collapsed: true, choices: [] };
  if (c.index >= GRID_SIZE) {
    up = { ...CELLS[c.index - GRID_SIZE] };
    if (!up.collapsed) {
      up.choices = up.choices.filter((x) => currentTile.plugs.up.includes(x));
      if (up.choices.length < 1) {
        return;
      }
    }
  }
  if ((c.index + 1) % GRID_SIZE != 0) {
    right = { ...CELLS[c.index + 1] };
    if (!right.collapsed) {
      right.choices = right.choices.filter((x) =>
        currentTile.plugs.right.includes(x)
      );
      if (right.choices.length < 1) {
        return;
      }
    }
  }
  if (c.index < GRID_SIZE * GRID_SIZE - GRID_SIZE) {
    down = { ...CELLS[c.index + GRID_SIZE] };
    if (!down.collapsed) {
      down.choices = down.choices.filter((x) =>
        currentTile.plugs.down.includes(x)
      );
      if (down.choices.length < 1) {
        return;
      }
    }
  }
  if (c.index % GRID_SIZE != 0) {
    left = { ...CELLS[c.index - 1] };
    if (!left.collapsed) {
      left.choices = left.choices.filter((x) =>
        currentTile.plugs.left.includes(x)
      );
      if (left.choices.length < 1) {
        return;
      }
    }
  }
  if (c.index >= GRID_SIZE && !up.collapsed) {
    CELLS[c.index - GRID_SIZE] = up;
  }
  if ((c.index + 1) % GRID_SIZE != 0 && !right.collapsed) {
    CELLS[c.index + 1] = right;
  }
  if (c.index < GRID_SIZE * GRID_SIZE - GRID_SIZE && !down.collapsed) {
    CELLS[c.index + GRID_SIZE] = down;
  }
  if (c.index % GRID_SIZE != 0 && !left.collapsed) {
    CELLS[c.index - 1] = left;
  }
  translate(
    (c.index % GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5,
    Math.floor(c.index / GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5
  );
  rotate(-currentTile.rotation * HALF_PI);
  image(
    currentTile.image,
    -TILE_SIZE * 0.5,
    -TILE_SIZE * 0.5,
    TILE_SIZE,
    TILE_SIZE
  );
  rotate(currentTile.rotation * HALF_PI);
  translate(
    -((c.index % GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5),
    -(Math.floor(c.index / GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5)
  );
  translate(0, 0);
  c.collapsed = true;
  CELLS[c.index] = c;
}
//# sourceMappingURL=index.js.map
