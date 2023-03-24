const TILE_SIZE: number = 32
const GRID_SIZE: number = 20

let imgEmpty: p5.Image
let imgSingle: p5.Image
let imgLeft: p5.Image
let imgMiddle: p5.Image
let imgRight: p5.Image
let imgTunnel: p5.Image
let imgSurface: p5.Image
let imgDeep: p5.Image
let imgHalfSky: p5.Image
let imgSky: p5.Image
let imgCloudLeft: p5.Image
let imgCloudMiddle: p5.Image
let imgCloudRight: p5.Image

enum TileName { Empty, Single, Left, Middle, Right, Tunnel, Surface, Deep, HalfSky, Sky, SkySpace, CloudLeft, CloudMiddle, CloudRight }

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
  imgEmpty = loadImage("images/empty.png")
  imgSingle = loadImage("images/single.png")
  imgLeft = loadImage("images/left.png")
  imgMiddle = loadImage("images/middle.png")
  imgRight = loadImage("images/right.png")
  imgTunnel = loadImage("images/tunnel.png")
  imgSurface = loadImage("images/surface.png")
  imgDeep = loadImage("images/deep.png")
  imgHalfSky = loadImage("images/half_sky.png")
  imgSky = loadImage("images/sky.png")
  imgCloudLeft = loadImage("images/cloud_left.png")
  imgCloudMiddle = loadImage("images/cloud_middle.png")
  imgCloudRight = loadImage("images/cloud_right.png")
}

function setup() {
  let canvasRenderer: p5.Renderer = createCanvas(TILE_SIZE*GRID_SIZE, TILE_SIZE*GRID_SIZE);
  canvasRenderer.parent("container")
  background(200)
  noSmooth()

  initTiles()
  initCells()

  // console.log(TILES)
  // console.log(CELLS)

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // Grid
      noFill
      stroke(0)
      square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE)
    }
  }

  const seedCell: Cell = random(CELLS)
  seedCell.choices = [TileName.HalfSky]
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

  // Stop draw loop if no more cells to draw
  if (sortedCells.length < 1) { noLoop(); return; }

  // Pick and collapse a random cell from sorted cells
  const currentCell: Cell = random(sortedCells.filter(c => c.choices.length == sortedCells[0].choices.length))
  collapseCell({ ...currentCell })
}

function initTiles() {
  TILES.push({
    name: TileName.Empty,
    image: imgEmpty,
    up: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.HalfSky],
    right: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Single],
    down: [TileName.Empty, TileName.Tunnel, TileName.Left, TileName.Middle, TileName.Right, TileName.Surface, TileName.Single],
    left: [TileName.Empty, TileName.Tunnel, TileName.Right, TileName.Single]
  },{
    name: TileName.Single,
    image: imgSingle,
    up: [TileName.Empty, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.Deep, TileName.Surface],
    right: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single],
    down: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single, TileName.Left, TileName.Middle, TileName.Right],
    left: [TileName.Empty, TileName.Surface, TileName.Deep, TileName.Single]
  },{
    name: TileName.Left,
    image: imgLeft,
    up: [TileName.Empty, TileName.Deep, TileName.Surface],
    right: [TileName.Middle, TileName.Right],
    down: [TileName.Empty, TileName.Deep],
    left: [TileName.Empty, TileName.Deep]
  },{
    name: TileName.Middle,
    image: imgMiddle,
    up: [TileName.Empty, TileName.Deep, TileName.Surface],
    right: [TileName.Middle, TileName.Right],
    down: [TileName.Empty, TileName.Deep],
    left: [TileName.Middle, TileName.Left]
  },{
    name: TileName.Right,
    image: imgRight,
    up: [TileName.Empty, TileName.Deep, TileName.Surface],
    right: [TileName.Empty, TileName.Deep],
    down: [TileName.Empty, TileName.Deep],
    left: [TileName.Middle, TileName.Left]
  },{
    name: TileName.Tunnel,
    image: imgTunnel,
    up: [TileName.Empty],
    right: [TileName.Empty],
    down: [TileName.Empty, TileName.Surface],
    left: [TileName.Empty]
  },{
    name: TileName.Surface,
    image: imgSurface,
    up: [TileName.Empty, TileName.Tunnel],
    right: [TileName.Surface, TileName.Deep, TileName.Single],
    down: [TileName.Deep],
    left: [TileName.Surface, TileName.Deep, TileName.Single]
  },{
    name: TileName.Deep,
    image: imgDeep,
    up: [TileName.Surface, TileName.Deep, TileName.Single],
    right: [TileName.Deep, TileName.Surface, TileName.Single, TileName.Left],
    down: [TileName.Deep, TileName.Single, TileName.Left, TileName.Middle, TileName.Right],
    left: [TileName.Deep, TileName.Surface, TileName.Single, TileName.Right]
  },{
    name: TileName.HalfSky,
    image: imgHalfSky,
    up: [TileName.SkySpace],
    right: [TileName.HalfSky],
    down: [TileName.Empty],
    left: [TileName.HalfSky]
  },{
    name: TileName.Sky,
    image: imgSky,
    up: [TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
    right: [TileName.Sky, TileName.CloudLeft],
    down: [TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
    left: [TileName.Sky, TileName.CloudRight]
  },{
    name: TileName.SkySpace,
    image: imgSky,
    up: [TileName.Sky, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
    right: [TileName.SkySpace],
    down: [TileName.HalfSky, TileName.Sky, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight],
    left: [TileName.SkySpace]
  },{
    name: TileName.CloudLeft,
    image: imgCloudLeft,
    up: [TileName.SkySpace],
    right: [TileName.CloudMiddle, TileName.CloudRight],
    down: [TileName.SkySpace],
    left: [TileName.Sky]
  },{
    name: TileName.CloudMiddle,
    image: imgCloudMiddle,
    up: [TileName.SkySpace],
    right: [TileName.CloudRight, TileName.CloudMiddle],
    down: [TileName.SkySpace],
    left: [TileName.CloudLeft, TileName.CloudMiddle]
  },{
    name: TileName.CloudRight,
    image: imgCloudRight,
    up: [TileName.SkySpace],
    right: [TileName.Sky],
    down: [TileName.SkySpace],
    left: [TileName.CloudLeft, TileName.CloudMiddle]
  })
}

function initCells() {
  for (let i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
    CELLS.push({
      index: i,
      collapsed: false,
      choices: [TileName.Empty, TileName.Left, TileName.Middle, TileName.Right, TileName.Single, TileName.Tunnel, TileName.Surface, TileName.Deep, TileName.HalfSky, TileName.Sky, TileName.SkySpace, TileName.CloudLeft, TileName.CloudMiddle, TileName.CloudRight]
    })
  }
}

function collapseCell(c: Cell) {
  // Visualize cell
  fill("red"); noStroke();
  square((c.index % GRID_SIZE) * TILE_SIZE,
    Math.floor(c.index / GRID_SIZE) * TILE_SIZE,
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
  if (c.index >= GRID_SIZE) {
    up = { ...CELLS[c.index - GRID_SIZE]}
    if (!up.collapsed) {
      up.choices = up.choices.filter(x => currentTile.up.includes(x))
      if (up.choices.length < 1) { return }
    }
  }
  if ((c.index + 1) % GRID_SIZE != 0) {
    right = { ...CELLS[c.index + 1] }
    if (!right.collapsed) {
      right.choices = right.choices.filter(x => currentTile.right.includes(x))
      if (right.choices.length < 1) { return }
    }
  }
  if (c.index < GRID_SIZE*GRID_SIZE - GRID_SIZE) {
    down = { ...CELLS[c.index + GRID_SIZE] }
    if (!down.collapsed) {
      down.choices = down.choices.filter(x => currentTile.down.includes(x))
      if (down.choices.length < 1) { return }
    }
  }
  if ((c.index) % GRID_SIZE != 0) {
    left = { ...CELLS[c.index - 1] }
    if (!left.collapsed) {
      left.choices = left.choices.filter(x => currentTile.left.includes(x))
      if (left.choices.length < 1) { return }
    }
  }

  // Apply changes
  if (c.index >= GRID_SIZE && !up.collapsed) {
    CELLS[c.index - GRID_SIZE] = up
  }
  if ((c.index + 1) % GRID_SIZE != 0 && !right.collapsed) {
    CELLS[c.index + 1] = right
  }
  if (c.index < GRID_SIZE*GRID_SIZE - GRID_SIZE && !down.collapsed) {
    CELLS[c.index + GRID_SIZE] = down
  }
  if ((c.index) % GRID_SIZE != 0 && !left.collapsed) {
    CELLS[c.index - 1] = left
  }

  // Draw cell
  image(
    currentTile.image,
    (c.index % GRID_SIZE) * TILE_SIZE,
    Math.floor(c.index / GRID_SIZE) * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  )

  c.collapsed = true
  CELLS[c.index] = c
}