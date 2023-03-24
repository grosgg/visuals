"use strict";
const TILE_SIZE = 32;
const GRID_SIZE = 20;
let imgEmpty;
let imgSingle;
let imgLeft;
let imgMiddle;
let imgRight;
let imgTunnel;
let imgSurface;
let imgDeep;
let imgHalfSky;
let imgSky;
let imgCloudLeft;
let imgCloudMiddle;
let imgCloudRight;
var TileName;
(function (TileName) {
    TileName[TileName["Empty"] = 0] = "Empty";
    TileName[TileName["Single"] = 1] = "Single";
    TileName[TileName["Left"] = 2] = "Left";
    TileName[TileName["Middle"] = 3] = "Middle";
    TileName[TileName["Right"] = 4] = "Right";
    TileName[TileName["Tunnel"] = 5] = "Tunnel";
    TileName[TileName["Surface"] = 6] = "Surface";
    TileName[TileName["Deep"] = 7] = "Deep";
    TileName[TileName["HalfSky"] = 8] = "HalfSky";
    TileName[TileName["Sky"] = 9] = "Sky";
    TileName[TileName["SkySpace"] = 10] = "SkySpace";
    TileName[TileName["CloudLeft"] = 11] = "CloudLeft";
    TileName[TileName["CloudMiddle"] = 12] = "CloudMiddle";
    TileName[TileName["CloudRight"] = 13] = "CloudRight";
})(TileName || (TileName = {}));
const TILES = [];
const CELLS = [];
function preload() {
    imgEmpty = loadImage("images/empty.png");
    imgSingle = loadImage("images/single.png");
    imgLeft = loadImage("images/left.png");
    imgMiddle = loadImage("images/middle.png");
    imgRight = loadImage("images/right.png");
    imgTunnel = loadImage("images/tunnel.png");
    imgSurface = loadImage("images/surface.png");
    imgDeep = loadImage("images/deep.png");
    imgHalfSky = loadImage("images/half_sky.png");
    imgSky = loadImage("images/sky.png");
    imgCloudLeft = loadImage("images/cloud_left.png");
    imgCloudMiddle = loadImage("images/cloud_middle.png");
    imgCloudRight = loadImage("images/cloud_right.png");
}
function setup() {
    let canvasRenderer = createCanvas(TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
    canvasRenderer.parent("container");
    background(200);
    noSmooth();
    initTiles();
    initCells();
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            noFill;
            stroke(0);
            square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE);
        }
    }
    const seedCell = random(CELLS);
    seedCell.choices = [TileName.HalfSky];
    collapseCell(seedCell);
}
function draw() {
    const notCollapsedCells = CELLS.filter(c => c.choices.length == 1 && !c.collapsed);
    if (notCollapsedCells.length > 0) {
        const notCollapsedCell = random(notCollapsedCells);
        collapseCell({ ...notCollapsedCell });
        return;
    }
    const sortedCells = CELLS.filter(c => c.choices.length > 1).sort((a, b) => a.choices.length - b.choices.length);
    if (sortedCells.length < 1) {
        noLoop();
        return;
    }
    const currentCell = random(sortedCells.filter(c => c.choices.length == sortedCells[0].choices.length));
    collapseCell({ ...currentCell });
}
function initTiles() {
    TILES.push({
        name: TileName.Empty,
        image: imgEmpty,
        up: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.HalfSky],
        right: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Single],
        down: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Middle, TileName.Right, TileName.Surface, TileName.Single],
        left: [TileName.Empty, TileName.Tunnel, TileName.Right, TileName.Single]
    }, {
        name: TileName.Single,
        image: imgSingle,
        up: [TileName.Empty, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.Deep, TileName.Surface],
        right: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single],
        down: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single, TileName.Left, TileName.Middle, TileName.Right],
        left: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single]
    }, {
        name: TileName.Left,
        image: imgLeft,
        up: [TileName.Empty, TileName.Deep, TileName.Surface],
        right: [TileName.Middle, TileName.Right],
        down: [TileName.Empty, TileName.Deep],
        left: [TileName.Empty, TileName.Deep]
    }, {
        name: TileName.Middle,
        image: imgMiddle,
        up: [TileName.Empty, TileName.Deep, TileName.Surface],
        right: [TileName.Middle, TileName.Right],
        down: [TileName.Empty, TileName.Deep],
        left: [TileName.Middle, TileName.Left]
    }, {
        name: TileName.Right,
        image: imgRight,
        up: [TileName.Empty, TileName.Deep, TileName.Surface],
        right: [TileName.Empty, TileName.Deep],
        down: [TileName.Empty, TileName.Deep],
        left: [TileName.Middle, TileName.Left]
    }, {
        name: TileName.Tunnel,
        image: imgTunnel,
        up: [TileName.Empty],
        right: [TileName.Empty],
        down: [TileName.Empty, TileName.Surface],
        left: [TileName.Empty]
    }, {
        name: TileName.Surface,
        image: imgSurface,
        up: [TileName.Empty, TileName.Tunnel],
        right: [TileName.Surface, TileName.Deep, TileName.Single],
        down: [TileName.Deep],
        left: [TileName.Surface, TileName.Deep, TileName.Single]
    }, {
        name: TileName.Deep,
        image: imgDeep,
        up: [TileName.Surface, TileName.Deep, TileName.Single],
        right: [TileName.Deep, TileName.Surface, TileName.Single, TileName.Left],
        down: [TileName.Deep, TileName.Single, TileName.Left, TileName.Middle, TileName.Right],
        left: [TileName.Deep, TileName.Surface, TileName.Single, TileName.Right]
    }, {
        name: TileName.HalfSky,
        image: imgHalfSky,
        up: [TileName.SkySpace],
        right: [TileName.HalfSky],
        down: [TileName.Empty],
        left: [TileName.HalfSky]
    }, {
        name: TileName.Sky,
        image: imgSky,
        up: [TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
        right: [TileName.Sky, TileName.CloudLeft],
        down: [TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
        left: [TileName.Sky, TileName.CloudRight]
    }, {
        name: TileName.SkySpace,
        image: imgSky,
        up: [TileName.Sky, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
        right: [TileName.SkySpace],
        down: [TileName.HalfSky, TileName.Sky, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
        left: [TileName.SkySpace]
    }, {
        name: TileName.CloudLeft,
        image: imgCloudLeft,
        up: [TileName.SkySpace],
        right: [TileName.CloudMiddle, TileName.CloudRight],
        down: [TileName.SkySpace],
        left: [TileName.Sky]
    }, {
        name: TileName.CloudMiddle,
        image: imgCloudMiddle,
        up: [TileName.SkySpace],
        right: [TileName.CloudRight, TileName.CloudMiddle],
        down: [TileName.SkySpace],
        left: [TileName.CloudLeft, TileName.CloudMiddle]
    }, {
        name: TileName.CloudRight,
        image: imgCloudRight,
        up: [TileName.SkySpace],
        right: [TileName.Sky],
        down: [TileName.SkySpace],
        left: [TileName.CloudLeft, TileName.CloudMiddle]
    });
}
function initCells() {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        CELLS.push({
            index: i,
            collapsed: false,
            choices: [TileName.Empty, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.Tunnel, TileName.Surface, TileName.Deep, TileName.HalfSky, TileName.Sky, TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight]
        });
    }
}
function collapseCell(c) {
    fill("red");
    noStroke();
    square((c.index % GRID_SIZE) * TILE_SIZE, Math.floor(c.index / GRID_SIZE) * TILE_SIZE, TILE_SIZE);
    c.choices = [random(c.choices)];
    const currentTile = TILES.filter(t => t.name == c.choices[0])[0];
    let up = { index: 0, collapsed: true, choices: [] };
    let right = { index: 0, collapsed: true, choices: [] };
    let down = { index: 0, collapsed: true, choices: [] };
    let left = { index: 0, collapsed: true, choices: [] };
    if (c.index >= GRID_SIZE) {
        up = { ...CELLS[c.index - GRID_SIZE] };
        if (!up.collapsed) {
            up.choices = up.choices.filter(x => currentTile.up.includes(x));
            if (up.choices.length < 1) {
                return;
            }
        }
    }
    if ((c.index + 1) % GRID_SIZE != 0) {
        right = { ...CELLS[c.index + 1] };
        if (!right.collapsed) {
            right.choices = right.choices.filter(x => currentTile.right.includes(x));
            if (right.choices.length < 1) {
                return;
            }
        }
    }
    if (c.index < GRID_SIZE * GRID_SIZE - GRID_SIZE) {
        down = { ...CELLS[c.index + GRID_SIZE] };
        if (!down.collapsed) {
            down.choices = down.choices.filter(x => currentTile.down.includes(x));
            if (down.choices.length < 1) {
                return;
            }
        }
    }
    if ((c.index) % GRID_SIZE != 0) {
        left = { ...CELLS[c.index - 1] };
        if (!left.collapsed) {
            left.choices = left.choices.filter(x => currentTile.left.includes(x));
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
    if ((c.index) % GRID_SIZE != 0 && !left.collapsed) {
        CELLS[c.index - 1] = left;
    }
    image(currentTile.image, (c.index % GRID_SIZE) * TILE_SIZE, Math.floor(c.index / GRID_SIZE) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    c.collapsed = true;
    CELLS[c.index] = c;
}
//# sourceMappingURL=index.js.map