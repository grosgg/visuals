const WIDTH: number = 800;
const HEIGHT: number = 800;
let wobblesCount: number = 0;
let strokeThickness: number = WIDTH * 0.05;
let strokeRoughness: number = strokeThickness * 0.05;
let linkPoint: [number, number] = [0, 0];
let nextLinkPoint: [number, number] = [0, 0];

function setup() {
  let canvasRenderer: p5.Renderer = createCanvas(WIDTH, HEIGHT);
  canvasRenderer.parent("container")
  background(random(["purple", "pink", "turquoise"]))
  wobblesCount = random([5, 10, 50])
  noSmooth()
  stroke(10)
  fill(240)
  strokeWeight(strokeThickness)
}

function draw() {
  if (linkPoint[0] == 0 && linkPoint[1] == 0) {
    linkPoint = randomCoords()
  }

  nextLinkPoint = randomCoords()

  drawBezierCurve(...linkPoint, ...randomCoords(), ...randomCoords(), ...nextLinkPoint)

  linkPoint = nextLinkPoint

  if (frameCount >= wobblesCount) {
    noLoop()
  }
}

function drawPoint(x: number, y: number, isOutline: boolean) {
  for (let i = 0; i < 5; i++) {
    let roughX: number = x + random(-strokeRoughness, strokeRoughness)
    let roughY: number = y + random(-strokeRoughness, strokeRoughness)

    if (isOutline) {
      stroke(10)
      circle(roughX, roughY, strokeThickness)
    } else {
      stroke(240)
      circle(roughX, roughY, strokeThickness * 0.6)
    }
  }
}

function drawBezierCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
  let curveLength: number = dist(x1, y1, x2, y2)
  strokeWeight(strokeThickness * (WIDTH - curveLength) * 0.003)
  strokeRoughness = strokeThickness * (WIDTH - curveLength) * 0.0005

  for (let i = 0; i < 1; i += 0.01) {
    let x: number = bezierPoint(x1, x2, x3, x4, i)
    let y: number = bezierPoint(y1, y2, y3, y4, i)
    drawPoint(x, y, true)
  }
  for (let i = 0; i < 1; i += 0.01) {
    let x: number = bezierPoint(x1, x2, x3, x4, i)
    let y: number = bezierPoint(y1, y2, y3, y4, i)
    drawPoint(x, y, false)
  }
}

function randomCoords(): [number, number] {
  let x: number = random(WIDTH * 0.1, WIDTH * 0.9)
  let y: number = random(HEIGHT * 0.1, HEIGHT * 0.9)
  return [x, y]
}