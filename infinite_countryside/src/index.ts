const TILE_SIZE: number = 32
const GRID_WIDTH: number = 10
const GRID_HEIGHT: number = 17

let vOffset: number = 0
let colorLayer: p5.Graphics
let previousIndex: number = 0

let imgEmpty: p5.Image
let imgGrass: p5.Image
let imgBush: p5.Image
let imgPine: p5.Image
let imgPines: p5.Image
let imgHouse: p5.Image

enum TileName { Empty, Grass, Bush, Pine, Pines, House }
const TILENAMES : TileName[] = [
  TileName.Empty,
  TileName.Grass,
  TileName.Bush,
  TileName.Pine,
  TileName.Pines,
  TileName.House,
]

interface Tile {
  name: TileName
  image: p5.Image,
  up: TileName[],
  right: TileName[],
  down: TileName[],
  left: TileName[]
}

interface Cell {
  index: number,
  collapsed : boolean,
  choices: TileName[]
}

const TILES : Tile[] = []
const CELLS : Cell[] = []

function preload() {
  imgEmpty = loadImage("images/grass/empty.png")
  imgGrass = loadImage("images/grass/grass.png")
  imgBush = loadImage("images/grass/bush.png")
  imgPine = loadImage("images/forest/pine.png")
  imgPines = loadImage("images/forest/pines.png")
  imgHouse = loadImage("images/house/house.png")
}

function setup() {
  let canvasRenderer: p5.Renderer = createCanvas(TILE_SIZE*GRID_WIDTH, TILE_SIZE*(GRID_HEIGHT-2))
  canvasRenderer.parent("container")

  colorLayer = createGraphics(TILE_SIZE*GRID_WIDTH, TILE_SIZE*(GRID_HEIGHT-2));
  colorLayer.fill(random([0, 255]), random([0, 255]), random([0, 255]), 50)
  colorLayer.rect(0, 0, TILE_SIZE*GRID_WIDTH, TILE_SIZE*(GRID_HEIGHT-2))

  background(200)
  noSmooth()

  initTiles()
  initCells()

  // console.log(TILES)
  // console.log(CELLS)

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      // Grid
      noFill
      stroke(0)
      square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE)
    }
  }

  const seedCell: Cell = CELLS[1]
  seedCell.choices = [TileName.Empty]
  collapseCell(seedCell)
}

function draw() {
  // Get cells with 1 entropy but not collapsed
  const notCollapsedCells: Cell[] = CELLS.filter(c => c.choices.length == 1 && !c.collapsed)

  if (notCollapsedCells.length > 0) {
    const notCollapsedCell: Cell = random(notCollapsedCells)
    collapseCell({ ...notCollapsedCell })
    return
  }

  // Get cells with the least entropy
  const sortedCells: Cell[] = CELLS.filter(c => c.choices.length > 1).sort((a , b) => a.choices.length - b.choices.length)

  // Draw cells
  drawAllCells()
  image(colorLayer, 0, 0, TILE_SIZE*GRID_WIDTH, TILE_SIZE*(GRID_HEIGHT-2));
  
  // Shift down if no more cells to draw
  if (sortedCells.length < 1) {
    if (vOffset >= TILE_SIZE ) {
      addRow()
    } else {
      vOffset += 1
    }
    return
  }

  if (sortedCells.length < GRID_WIDTH) {
    vOffset += 1
  }

  // Pick and collapse a random cell from sorted cells
  const currentCell: Cell = random(sortedCells.filter(c => c.choices.length == sortedCells[0].choices.length))
  collapseCell({ ...currentCell })
}

function initTiles() {
  TILES.push({
    name: TileName.Empty,
    image: imgEmpty,
    up: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House],
    right: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House],
    down: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House],
    left: [TileName.Empty, TileName.Grass, TileName.Pine, TileName.House],
  },{
    name: TileName.Grass,
    image: imgGrass,
    up: [TileName.Empty, TileName.Grass, TileName.Bush],
    right: [TileName.Empty, TileName.Grass, TileName.Bush],
    down: [TileName.Empty, TileName.Grass, TileName.Bush],
    left: [TileName.Empty, TileName.Grass, TileName.Bush],
  },{
    name: TileName.Bush,
    image: imgBush,
    up: [TileName.Bush, TileName.Grass],
    right: [TileName.Bush, TileName.Grass],
    down: [TileName.Bush, TileName.Grass],
    left: [TileName.Bush, TileName.Grass],
  },{
    name: TileName.Pine,
    image: imgPine,
    up: [TileName.Empty, TileName.Pine, TileName.Pines],
    right: [TileName.Empty, TileName.Pine, TileName.Pines],
    down: [TileName.Empty, TileName.Pine, TileName.Pines],
    left: [TileName.Empty, TileName.Pine, TileName.Pines],
  },{
    name: TileName.Pines,
    image: imgPines,
    up: [TileName.Pine, TileName.Pines],
    right: [TileName.Pine, TileName.Pines],
    down: [TileName.Pine, TileName.Pines],
    left: [TileName.Pine, TileName.Pines],
  },{
    name: TileName.House,
    image: imgHouse,
    up: [TileName.Empty],
    right: [TileName.Empty, TileName.House],
    down: [TileName.Empty],
    left: [TileName.Empty, TileName.House],
  })
}

function initCells() {
  for (let i = 0; i < GRID_WIDTH*GRID_HEIGHT; i++) {
    CELLS.push({
      index: i,
      collapsed: false,
      choices: TILENAMES
    })
  }
}

function collapseCell(c: Cell) {
  // If we keep processing the same cell, it means we are stuck and need to reset the full row
  if (c.index == previousIndex) {
    resetLastRow()
    return
  }
  previousIndex = c.index

  // Visualize cell
  fill("red"); noStroke();
  square((c.index % GRID_WIDTH) * TILE_SIZE,
    Math.floor(c.index / GRID_WIDTH) * TILE_SIZE,
    TILE_SIZE,
  )

  // Random pick
  c.choices = [random(c.choices)]

  // Get tile template
  const currentTile: Tile = TILES.filter(t => t.name == c.choices[0])[0]

  let up: Cell = { index: 0, collapsed: true, choices: [] }
  let right: Cell = { index: 0, collapsed: true, choices: [] }
  let down: Cell = { index: 0, collapsed: true, choices: [] }
  let left: Cell = { index: 0, collapsed: true, choices: [] }

  // Prepare changes to neighbours + rollback if needed
  if (c.index >= GRID_WIDTH) {
    up = { ...CELLS[c.index - GRID_WIDTH]}
    if (!up.collapsed) {
      up.choices = up.choices.filter(x => currentTile.up.includes(x))
      if (up.choices.length < 1) { return }
    }
  }
  if ((c.index + 1) % GRID_WIDTH != 0) {
    right = { ...CELLS[c.index + 1] }
    if (!right.collapsed) {
      right.choices = right.choices.filter(x => currentTile.right.includes(x))
      if (right.choices.length < 1) { return }
    }
  }
  if (c.index < GRID_WIDTH*GRID_HEIGHT - GRID_WIDTH) {
    down = { ...CELLS[c.index + GRID_WIDTH] }
    if (!down.collapsed) {
      down.choices = down.choices.filter(x => currentTile.down.includes(x))
      if (down.choices.length < 1) { return }
    }
  }
  if ((c.index) % GRID_WIDTH != 0) {
    left = { ...CELLS[c.index - 1] }
    if (!left.collapsed) {
      left.choices = left.choices.filter(x => currentTile.left.includes(x))
      if (left.choices.length < 1) { return }
    }
  }

  // Apply changes
  if (c.index >= GRID_WIDTH && !up.collapsed) {
    CELLS[c.index - GRID_WIDTH] = up
  }
  if ((c.index + 1) % GRID_WIDTH != 0 && !right.collapsed) {
    CELLS[c.index + 1] = right
  }
  if (c.index < GRID_WIDTH*GRID_HEIGHT - GRID_WIDTH && !down.collapsed) {
    CELLS[c.index + GRID_WIDTH] = down
  }
  if ((c.index) % GRID_WIDTH != 0 && !left.collapsed) {
    CELLS[c.index - 1] = left
  }

  c.collapsed = true
  CELLS[c.index] = c
}

function addRow() {
  // Remove first row
  for (let i = 0; i < GRID_WIDTH; i++) {
    CELLS.shift()
  }
  // Add new row at the bottom
  for (let i = 0; i < GRID_WIDTH; i++) {
    CELLS.push({
      index: i,
      collapsed: false,
      choices: TILENAMES
    })
  }
  // Reindex cells
  for (let i = 0; i < GRID_WIDTH*GRID_HEIGHT; i++) {
    CELLS[i].index = i
  }
  // Recollapse previously bottom row
  for (let i = GRID_WIDTH*GRID_HEIGHT - 2*GRID_WIDTH; i < GRID_WIDTH*GRID_HEIGHT - GRID_WIDTH; i++) {
    collapseCell(CELLS[i])
  }
  // Reset vOffset
  vOffset = 1
}

function resetLastRow() {
  for (let i = GRID_WIDTH*GRID_HEIGHT - GRID_WIDTH; i < GRID_WIDTH*GRID_HEIGHT; i++) {
    CELLS[i].choices = TILENAMES
    CELLS[i].collapsed = false
  }
  // Recollapse previously bottom row
  for (let i = GRID_WIDTH*GRID_HEIGHT - 2*GRID_WIDTH; i < GRID_WIDTH*GRID_HEIGHT - GRID_WIDTH; i++) {
    collapseCell(CELLS[i])
  }  
}

function drawCell(c: Cell) {
  // Get tile template
  const currentTile: Tile = TILES.filter(t => t.name == c.choices[0])[0]

  image(
    currentTile.image,
    (c.index % GRID_WIDTH) * TILE_SIZE,
    Math.floor(c.index / GRID_WIDTH) * TILE_SIZE - vOffset,
    TILE_SIZE,
    TILE_SIZE
  )
}

function drawAllCells() {
  for (let i = 0; i < GRID_WIDTH*GRID_HEIGHT; i++) {
    drawCell(CELLS[i])
  }
}