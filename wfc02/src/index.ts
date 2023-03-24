const TILE_SIZE: number = 32
const GRID_SIZE: number = 20

const IMAGES : p5.Image[] = []

enum Socket { White, Green, Blue }

const PIXELS_COORDS: [number, number][] = [
  [0, 0], [7, 0], [15, 0], [15, 7],
  [15, 15], [7, 15], [0, 15], [0, 7]
]
const PIXELS_INDEXES: number[] = [0, 7, 15, 127, 255, 247, 240, 128]


interface Tile {
  id: string,
  image: p5.Image,
  rotation: number,
  sockets: Socket[],
  plugs: {
    up: string[], 
    right: string[],
    down: string[],
    left: string[]
  }
}

interface Cell {
  index: number,
  collapsed : boolean,
  choices: string[]
}

const TILES : Tile[] = []
const CELLS : Cell[] = []

function preload() {
  for (let i = 0; i <= 23; i++) {
    IMAGES.push(loadImage(`images/wfc_rr${i.toString().padStart(2, "0")}.png`)) 
  }
}

function setup() {
  let canvasRenderer: p5.Renderer = createCanvas(TILE_SIZE*GRID_SIZE, TILE_SIZE*GRID_SIZE);
  canvasRenderer.parent("container")
  background(200)
  noSmooth()

  initTiles()
  initPlugs()
  // console.log(TILES)
  initCells()
  // console.log(CELLS)

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      // Grid
      noFill
      stroke(0)
      square(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE)
    }
  }

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

function initPlugs() : void {
  for (let i = 0; i < TILES.length; i++) {
    for (let j = 0; j < TILES.length; j++) {
      const t1s : Socket[] = TILES[i].sockets
      const t2s : Socket[] = TILES[j].sockets
      if ([t1s[0], t1s[1], t1s[2]].every((s, k) => s == [t2s[4], t2s[5], t2s[6]].reverse()[k])) {
        TILES[i].plugs.up.push(TILES[j].id)
      }
      if ([t1s[2], t1s[3], t1s[4]].every((s, k) => s == [t2s[6], t2s[7], t2s[0]].reverse()[k])) {
        TILES[i].plugs.right.push(TILES[j].id)
      }
      if ([t1s[4], t1s[5], t1s[6]].every((s, k) => s == [t2s[0], t2s[1], t2s[2]].reverse()[k])) {
        TILES[i].plugs.down.push(TILES[j].id)
      }
      if ([t1s[6], t1s[7], t1s[0]].every((s, k) => s == [t2s[2], t2s[3], t2s[4]].reverse()[k])) {
        TILES[i].plugs.left.push(TILES[j].id)
      }
    }
  }
}

function initTiles() : void {
  for (let i = 0; i < IMAGES.length; i++) {
    for (let j = 0; j <= 3; j++) {
      TILES.push({
        id: `${i}${j}`,
        image: IMAGES[i],
        rotation: j,
        sockets: computeSockets(IMAGES[i], j),
        plugs: { up: [], right: [], down: [], left: [] }
      })
    }
    
  }
}

function computeSockets (image: p5.Image, rotation: number) : Socket[] {
  const sockets : Socket[] = []
  let pixelsCoords : [number, number][] = PIXELS_COORDS.slice(0, 9)

  for (let i = 0; i < rotation * 2; i++) {
    const element : [number, number]|undefined = pixelsCoords.shift()
    if (element != undefined) { pixelsCoords.push(element) }
  }
  for (let i = 0; i < pixelsCoords.length; i++) {
    const color = image.get(pixelsCoords[i][0], pixelsCoords[i][1])

    // Due to loss of exact color value when exporting from Piskel, we guess only from a rough red value
    switch (Math.floor(color[0] / 30)) {
      case 0:
        sockets.push(Socket.Green)
        break;
      case 8:
        sockets.push(Socket.White)
        break;
      case 2:
        sockets.push(Socket.Blue)
        break;
      default:
        break;
    }
  }
  return sockets
}

function initCells() {
  const choices : string[] = []
  for (let x = 0; x < IMAGES.length; x++) {
    for (let y = 0; y <= 3; y++) {
      choices.push(`${x}${y}`)
    }
  }

  for (let i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
    CELLS.push({
      index: i,
      collapsed: false,
      choices: choices
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
  const currentTile: Tile = TILES.filter(t => t.id == c.choices[0])[0]

  let up: Cell = { index: 0, collapsed: true, choices: [] }
  let right: Cell = { index: 0, collapsed: true, choices: [] }
  let down: Cell = { index: 0, collapsed: true, choices: [] }
  let left: Cell = { index: 0, collapsed: true, choices: [] }

  // Prepare changes to neighbours + rollback if needed
  if (c.index >= GRID_SIZE) {
    up = { ...CELLS[c.index - GRID_SIZE]}
    if (!up.collapsed) {
      up.choices = up.choices.filter(x => currentTile.plugs.up.includes(x))
      if (up.choices.length < 1) { return }
    }
  }
  if ((c.index + 1) % GRID_SIZE != 0) {
    right = { ...CELLS[c.index + 1] }
    if (!right.collapsed) {
      right.choices = right.choices.filter(x => currentTile.plugs.right.includes(x))
      if (right.choices.length < 1) { return }
    }
  }
  if (c.index < GRID_SIZE*GRID_SIZE - GRID_SIZE) {
    down = { ...CELLS[c.index + GRID_SIZE] }
    if (!down.collapsed) {
      down.choices = down.choices.filter(x => currentTile.plugs.down.includes(x))
      if (down.choices.length < 1) { return }
    }
  }
  if ((c.index) % GRID_SIZE != 0) {
    left = { ...CELLS[c.index - 1] }
    if (!left.collapsed) {
      left.choices = left.choices.filter(x => currentTile.plugs.left.includes(x))
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
  translate((c.index % GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5, Math.floor(c.index / GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5)
  rotate(-currentTile.rotation * HALF_PI)
  image(
    currentTile.image,
    - TILE_SIZE * 0.5,
    - TILE_SIZE * 0.5,
    TILE_SIZE,
    TILE_SIZE
    )

  rotate(currentTile.rotation * HALF_PI)
  translate(-((c.index % GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5), -(Math.floor(c.index / GRID_SIZE) * TILE_SIZE + TILE_SIZE * 0.5))
  translate(0, 0)

  c.collapsed = true
  CELLS[c.index] = c
}