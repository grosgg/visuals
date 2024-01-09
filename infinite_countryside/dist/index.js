"use strict";
const TILE_SIZE = 32;
const GRID_WIDTH = 8;
const GRID_HEIGHT = 10;
let vOffset = 0;
let colorLayer;
let previousIndex = 0;
let imgEmpty;
let imgGrass;
let imgBush;
let imgPine;
let imgPines;
let imgHouse;
let imgHouses;
let imgBuilding;
var TileName;
(function (TileName) {
    TileName[TileName["Empty"] = 0] = "Empty";
    TileName[TileName["Grass"] = 1] = "Grass";
    TileName[TileName["Bush"] = 2] = "Bush";
    TileName[TileName["Pine"] = 3] = "Pine";
    TileName[TileName["Pines"] = 4] = "Pines";
    TileName[TileName["House"] = 5] = "House";
    TileName[TileName["Houses"] = 6] = "Houses";
    TileName[TileName["Building"] = 7] = "Building";
})(TileName || (TileName = {}));
const TILENAMES = [
    TileName.Empty,
    TileName.Grass,
    TileName.Bush,
    TileName.Pine,
    TileName.Pines,
    TileName.House,
    TileName.Houses,
    TileName.Building,
];
const TILES = [];
const CELLS = [];
function preload() {
    imgEmpty = loadImage("images/grass/empty.png");
    imgGrass = loadImage("images/grass/grass.png");
    imgBush = loadImage("images/grass/bush.png");
    imgPine = loadImage("images/forest/pine.png");
    imgPines = loadImage("images/forest/pines.png");
    imgHouse = loadImage("images/house/house.png");
    imgHouses = loadImage("images/house/houses.png");
    imgBuilding = loadImage("images/house/building.png");
}
function setup() {
    let canvasRenderer = createCanvas(TILE_SIZE * GRID_WIDTH, TILE_SIZE * (GRID_HEIGHT - 2));
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
}
function draw() {
    const notCollapsedCells = CELLS.filter(c => c.choices.length == 1 && !c.collapsed);
    if (notCollapsedCells.length > 0) {
        const notCollapsedCell = random(notCollapsedCells);
        collapseCell({ ...notCollapsedCell });
        return;
    }
    const sortedCells = CELLS.filter(c => c.choices.length > 1).sort((a, b) => a.choices.length - b.choices.length);
    drawAllCells();
    image(colorLayer, 0, 0, TILE_SIZE * GRID_WIDTH, TILE_SIZE * (GRID_HEIGHT - 2));
    if (sortedCells.length < 1) {
        if (vOffset >= TILE_SIZE) {
            addRow();
        }
        else {
            vOffset += 1;
        }
        return;
    }
    if (sortedCells.length < GRID_WIDTH) {
        vOffset += 1;
    }
    const currentCell = random(sortedCells.filter(c => c.choices.length == sortedCells[0].choices.length));
    collapseCell({ ...currentCell });
}
function initTiles() {
    TILES.push({
        name: TileName.Empty,
        image: imgEmpty,
        up: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House, TileName.Houses, TileName.Building],
        right: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House, TileName.Houses],
        down: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House, TileName.Houses, TileName.Building],
        left: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House, TileName.Houses],
    }, {
        name: TileName.Grass,
        image: imgGrass,
        up: [TileName.Empty, TileName.Grass, TileName.Bush],
        right: [TileName.Empty, TileName.Grass, TileName.Bush],
        down: [TileName.Empty, TileName.Grass, TileName.Bush],
        left: [TileName.Empty, TileName.Grass, TileName.Bush],
    }, {
        name: TileName.Bush,
        image: imgBush,
        up: [TileName.Bush, TileName.Grass],
        right: [TileName.Bush, TileName.Grass],
        down: [TileName.Bush, TileName.Grass],
        left: [TileName.Bush, TileName.Grass],
    }, {
        name: TileName.Pine,
        image: imgPine,
        up: [TileName.Empty, TileName.Pine, TileName.Pines],
        right: [TileName.Empty, TileName.Pine, TileName.Pines],
        down: [TileName.Empty, TileName.Pine, TileName.Pines],
        left: [TileName.Empty, TileName.Pine, TileName.Pines],
    }, {
        name: TileName.Pines,
        image: imgPines,
        up: [TileName.Pine, TileName.Pines],
        right: [TileName.Pine, TileName.Pines],
        down: [TileName.Pine, TileName.Pines],
        left: [TileName.Pine, TileName.Pines],
    }, {
        name: TileName.House,
        image: imgHouse,
        up: [TileName.Empty],
        right: [TileName.Empty, TileName.Houses, TileName.Building],
        down: [TileName.Empty],
        left: [TileName.Empty, TileName.Houses, TileName.Building],
    }, {
        name: TileName.Houses,
        image: imgHouses,
        up: [TileName.Empty],
        right: [TileName.Empty, TileName.House, TileName.Building],
        down: [TileName.Empty],
        left: [TileName.Empty, TileName.House, TileName.Building],
    }, {
        name: TileName.Building,
        image: imgBuilding,
        up: [TileName.Empty],
        right: [TileName.House, TileName.Houses, TileName.Building],
        down: [TileName.Empty],
        left: [TileName.House, TileName.Houses, TileName.Building],
    });
}
function initCells() {
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        CELLS.push({
            index: i,
            collapsed: false,
            choices: TILENAMES
        });
    }
}
function collapseCell(c) {
    if (c.index == previousIndex) {
        resetLastRow();
        return;
    }
    previousIndex = c.index;
    fill("red");
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
function addRow() {
    for (let i = 0; i < GRID_WIDTH; i++) {
        CELLS.shift();
    }
    for (let i = 0; i < GRID_WIDTH; i++) {
        CELLS.push({
            index: i,
            collapsed: false,
            choices: TILENAMES
        });
    }
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        CELLS[i].index = i;
    }
    for (let i = GRID_WIDTH * GRID_HEIGHT - 2 * GRID_WIDTH; i < GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH; i++) {
        collapseCell(CELLS[i]);
    }
    vOffset = 1;
}
function resetLastRow() {
    for (let i = GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        CELLS[i].choices = TILENAMES;
        CELLS[i].collapsed = false;
    }
    for (let i = GRID_WIDTH * GRID_HEIGHT - 2 * GRID_WIDTH; i < GRID_WIDTH * GRID_HEIGHT - GRID_WIDTH; i++) {
        collapseCell(CELLS[i]);
    }
}
function drawCell(c) {
    const currentTile = TILES.filter(t => t.name == c.choices[0])[0];
    image(currentTile.image, (c.index % GRID_WIDTH) * TILE_SIZE, Math.floor(c.index / GRID_WIDTH) * TILE_SIZE - vOffset, TILE_SIZE, TILE_SIZE);
}
function drawAllCells() {
    for (let i = 0; i < GRID_WIDTH * GRID_HEIGHT; i++) {
        drawCell(CELLS[i]);
    }
}
//# sourceMappingURL=index.js.map