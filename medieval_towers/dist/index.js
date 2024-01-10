"use strict";
const TILE_SIZE = 32;
const GRID_WIDTH = 14;
const GRID_HEIGHT = 20;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
let colorLayer;
let previousIndexes = [];
let secondPass = false;
let imgEmpty;
let imgGround;
let imgWall;
let imgWallWorn;
let imgRoof;
let imgDoor;
let imgWindow1;
let imgWindow2;
let imgWindow3;
let imgBridgeCenter;
let imgFlag1;
let imgFlag2;
var TileName;
(function (TileName) {
    TileName[TileName["Empty"] = 0] = "Empty";
    TileName[TileName["Ground"] = 1] = "Ground";
    TileName[TileName["Wall"] = 2] = "Wall";
    TileName[TileName["Roof"] = 3] = "Roof";
    TileName[TileName["Door"] = 4] = "Door";
    TileName[TileName["Window"] = 5] = "Window";
    TileName[TileName["Hole"] = 6] = "Hole";
    TileName[TileName["HoleRoof"] = 7] = "HoleRoof";
    TileName[TileName["BridgeCenter"] = 8] = "BridgeCenter";
    TileName[TileName["Flag"] = 9] = "Flag";
})(TileName || (TileName = {}));
const TILENAMES = [
    TileName.Empty,
    TileName.Wall,
    TileName.Roof,
    TileName.Door,
    TileName.Window,
    TileName.Hole,
    TileName.HoleRoof,
    TileName.Flag,
];
const TILES = [];
const CELLS = [];
function preload() {
    imgEmpty = loadImage("images/ground/empty.png");
    imgGround = loadImage("images/ground/ground.png");
    imgWall = loadImage("images/bricks/wall.png");
    imgWallWorn = loadImage("images/bricks/wall_worn.png");
    imgRoof = loadImage("images/roof/stone.png");
    imgDoor = loadImage("images/bricks/door.png");
    imgWindow1 = loadImage("images/bricks/window1.png");
    imgWindow2 = loadImage("images/bricks/window2.png");
    imgWindow3 = loadImage("images/bricks/window3.png");
    imgBridgeCenter = loadImage("images/bridge/center.png");
    imgFlag1 = loadImage("images/roof/flag1.png");
    imgFlag2 = loadImage("images/roof/flag2.png");
}
function setup() {
    let canvasRenderer = createCanvas(TILE_SIZE * GRID_WIDTH, TILE_SIZE * GRID_HEIGHT);
    canvasRenderer.parent("container");
    colorLayer = createGraphics(TILE_SIZE * GRID_WIDTH, TILE_SIZE * (GRID_HEIGHT - 2));
    colorLayer.fill(random([0, 255]), random([0, 255]), random([0, 255]), 50);
    colorLayer.rect(0, 0, TILE_SIZE * GRID_WIDTH, TILE_SIZE * (GRID_HEIGHT - 2));
    background(200);
    noSmooth();
    initTiles();
    initCells();
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            noFill;
            stroke(0);
            square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE);
        }
    }
    CELLS[CELLS.length - 1].choices = [TileName.Ground];
}
function draw() {
    const notCollapsedCells = CELLS.filter(c => c.choices.length == 1 && !c.collapsed);
    if (notCollapsedCells.length > 0) {
        const notCollapsedCell = random(notCollapsedCells);
        collapseCell({ ...notCollapsedCell });
        return;
    }
    const remainingCells = CELLS.filter(c => c.choices.length > 1);
    drawAllCells();
    image(colorLayer, 0, 0, TILE_SIZE * GRID_WIDTH, TILE_SIZE * GRID_HEIGHT);
    if (remainingCells.length < 1 && !secondPass) {
        startSecondPass();
        secondPass = true;
        return;
    }
    if (remainingCells.length < 1) {
        noLoop();
        return;
    }
    const currentCell = remainingCells.sort((a, b) => b.index - a.index)[0];
    collapseCell({ ...currentCell });
}
function initTiles() {
    TILES.push({
        name: TileName.Empty,
        images: [imgEmpty],
        up: [TileName.Empty],
        right: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Window, TileName.Flag],
        down: [TileName.Empty, TileName.Ground, TileName.Roof, TileName.Flag],
        left: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Window, TileName.Flag],
    }, {
        name: TileName.Ground,
        images: [imgGround],
        up: [TileName.Empty, TileName.Wall, TileName.Door],
        right: [TileName.Ground],
        down: [],
        left: [TileName.Ground],
    }, {
        name: TileName.Wall,
        images: [imgWall, imgWallWorn],
        up: [TileName.Wall, TileName.Roof, TileName.Window, TileName.HoleRoof, TileName.Flag],
        right: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Door, TileName.Window, TileName.Hole, TileName.HoleRoof],
        down: [TileName.Ground, TileName.Wall, TileName.Door, TileName.Window, TileName.Hole],
        left: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Door, TileName.Window, TileName.Hole, TileName.HoleRoof],
    }, {
        name: TileName.Roof,
        images: [imgRoof],
        up: [TileName.Empty],
        right: [TileName.Empty, TileName.Wall, TileName.Roof],
        down: [TileName.Wall],
        left: [TileName.Empty, TileName.Wall, TileName.Roof],
    }, {
        name: TileName.Door,
        images: [imgDoor],
        up: [TileName.Wall],
        right: [TileName.Wall],
        down: [TileName.Ground],
        left: [TileName.Wall],
    }, {
        name: TileName.Window,
        images: [imgWindow1, imgWindow2, imgWindow3],
        up: [TileName.Wall, TileName.HoleRoof],
        right: [TileName.Empty, TileName.Wall, TileName.Window, TileName.Hole],
        down: [TileName.Wall, TileName.Hole],
        left: [TileName.Empty, TileName.Wall, TileName.Window, TileName.Hole],
    }, {
        name: TileName.Hole,
        images: [imgEmpty],
        up: [TileName.Hole, TileName.Wall, TileName.Window],
        right: [TileName.Wall, TileName.Window],
        down: [TileName.Hole, TileName.HoleRoof],
        left: [TileName.Wall, TileName.Window],
    }, {
        name: TileName.HoleRoof,
        images: [imgRoof],
        up: [TileName.Hole],
        right: [TileName.Wall, TileName.Window],
        down: [TileName.Wall, TileName.Window],
        left: [TileName.Wall, TileName.Window],
    }, {
        name: TileName.Flag,
        images: [imgFlag1, imgFlag2],
        up: [TileName.Empty],
        right: [TileName.Empty],
        down: [TileName.Wall],
        left: [TileName.Empty],
    });
}
function initCells() {
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        CELLS.push({
            index: i,
            collapsed: false,
            choices: choicesForIndex(i)
        });
    }
}
function collapseCell(c) {
    if (previousIndexes.find(i => i == c.index) && !secondPass) {
        resetColumn(c.index);
        previousIndexes.length = 0;
        return;
    }
    previousIndexes.push(c.index);
    if (previousIndexes.length > 1) {
        previousIndexes.shift();
    }
    fill(color(255, 0, 0));
    noStroke();
    square((c.index % GRID_WIDTH) * TILE_SIZE, Math.floor(c.index / GRID_WIDTH) * TILE_SIZE, TILE_SIZE);
    c.choices = [random(c.choices)];
    const currentTile = TILES.filter(t => t.name == c.choices[0])[0];
    let up = { index: 0, collapsed: true, choices: [] };
    let right = { index: 0, collapsed: true, choices: [] };
    let down = { index: 0, collapsed: true, choices: [] };
    let left = { index: 0, collapsed: true, choices: [] };
    if (c.index >= GRID_WIDTH) {
        up = { ...CELLS[c.index - GRID_WIDTH] };
        if (!up.collapsed) {
            up.choices = up.choices.filter(x => currentTile.up.includes(x));
            if (up.choices.length < 1) {
                return;
            }
        }
    }
    if ((c.index + 1) % GRID_WIDTH != 0) {
        right = { ...CELLS[c.index + 1] };
        if (!right.collapsed) {
            right.choices = right.choices.filter(x => currentTile.right.includes(x));
            if (right.choices.length < 1) {
                return;
            }
        }
    }
    if (c.index < GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH) {
        down = { ...CELLS[c.index + GRID_WIDTH] };
        if (!down.collapsed) {
            down.choices = down.choices.filter(x => currentTile.down.includes(x));
            if (down.choices.length < 1) {
                return;
            }
        }
    }
    if ((c.index) % GRID_WIDTH != 0) {
        left = { ...CELLS[c.index - 1] };
        if (!left.collapsed) {
            left.choices = left.choices.filter(x => currentTile.left.includes(x));
            if (left.choices.length < 1) {
                return;
            }
        }
    }
    if (c.index >= GRID_WIDTH && !up.collapsed) {
        CELLS[c.index - GRID_WIDTH] = up;
    }
    if ((c.index + 1) % GRID_WIDTH != 0 && !right.collapsed) {
        CELLS[c.index + 1] = right;
    }
    if (c.index < GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH && !down.collapsed) {
        CELLS[c.index + GRID_WIDTH] = down;
    }
    if ((c.index) % GRID_WIDTH != 0 && !left.collapsed) {
        CELLS[c.index - 1] = left;
    }
    c.collapsed = true;
    CELLS[c.index] = c;
}
function resetColumn(index) {
    const column = index % GRID_WIDTH;
    for (let i = 0; i < GRID_HEIGHT; i++) {
        CELLS[i * GRID_WIDTH + column].choices = choicesForIndex(i * GRID_WIDTH + column);
        CELLS[i * GRID_WIDTH + column].collapsed = false;
        collapseCell(CELLS[max(i * GRID_WIDTH + column - 1, 0)]);
        collapseCell(CELLS[min(i * GRID_WIDTH + column + 1, CELLS.length - 1)]);
    }
}
function choicesForIndex(index) {
    if (index < GRID_WIDTH) {
        return [TileName.Empty];
    }
    if (index >= GRID_SIZE - GRID_WIDTH) {
        return [TileName.Ground];
    }
    if (index % GRID_WIDTH == 0 && index < (GRID_SIZE - GRID_WIDTH)) {
        return [TileName.Empty];
    }
    if (index % GRID_WIDTH == GRID_WIDTH - 1 && index < (GRID_SIZE - GRID_WIDTH)) {
        return [TileName.Empty];
    }
    if (index > (GRID_WIDTH * GRID_HEIGHT) / 2) {
        return TILENAMES.filter(t => t != TileName.Roof && t != TileName.Flag);
    }
    return TILENAMES;
}
function startSecondPass() {
    const secondCells = CELLS.filter(c => c.choices[0] == TileName.Roof
        || c.choices[0] == TileName.Ground
        || c.choices[0] == TileName.Flag);
    for (let i = 0; i < secondCells.length; i++) {
        CELLS[secondCells[i].index].collapsed = false;
    }
    const emptyCells = CELLS.filter(c => c.choices[0] == TileName.Empty);
    for (let i = 0; i < emptyCells.length; i++) {
        CELLS[emptyCells[i].index].collapsed = false;
        if (emptyCells[i].index > GRID_WIDTH
            && emptyCells[i].index % GRID_WIDTH
            && (emptyCells[i].index + 1) % GRID_WIDTH) {
            CELLS[emptyCells[i].index].choices = [TileName.Empty, TileName.BridgeCenter];
        }
    }
    TILES.shift();
    TILES.push({
        name: TileName.Empty,
        images: [imgEmpty],
        up: [TileName.Empty, TileName.BridgeCenter],
        right: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Window],
        down: [TileName.Empty, TileName.BridgeCenter],
        left: [TileName.Empty, TileName.Wall, TileName.Roof, TileName.Window],
    }, {
        name: TileName.BridgeCenter,
        images: [imgBridgeCenter],
        up: [TileName.Empty],
        right: [TileName.Wall, TileName.Window, TileName.BridgeCenter],
        down: [TileName.Empty],
        left: [TileName.Wall, TileName.Window, TileName.BridgeCenter],
    });
}
function drawCell(c) {
    const currentTile = TILES.filter(t => t.name == c.choices[0])[0];
    image(random(currentTile.images), (c.index % GRID_WIDTH) * TILE_SIZE, Math.floor(c.index / GRID_WIDTH) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}
function drawAllCells() {
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        drawCell(CELLS[i]);
    }
}
//# sourceMappingURL=index.js.map