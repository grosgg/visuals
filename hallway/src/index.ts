const WIDTH: number = 800;
const HEIGHT: number = 600;

let wallSize: p5.Vector;
let wallOrigin: p5.Vector;
let wallColor: p5.Color;
let panelColor: p5.Color;
let floorColor: p5.Color;
let ceilingColor: p5.Color;
let steps: number = 10;
let currentStep: number = 0;

function setup() {
  let canvasRenderer: p5.Renderer = createCanvas(WIDTH, HEIGHT);
  canvasRenderer.parent("container")
  background(200)
  noSmooth()

  steps = floor(random(5, 50))

  wallSize = createVector(0, 0)
  wallSize.x = WIDTH * random(0.02, 0.2)
  wallSize.y = wallSize.x * 0.5625 * random(0.8, 1.2)
  wallOrigin = createVector((WIDTH - wallSize.x) * random(0.1, 0.9), (HEIGHT - wallSize.y) * random(0.1, 0.9))

  wallColor = color(random(50, 150), random(50, 150), random(50, 150))
  panelColor = color(random(0, 150), random(0, 150), random(0, 150))
  floorColor = color(random(0, 50), random(0, 50), random(0, 50))
  ceilingColor = color(random(0, 50), random(0, 50), random(0, 50))

  stroke(floorColor)
  fill(floorColor)
  rect(0, wallOrigin.y + wallSize.y, WIDTH, HEIGHT - (wallOrigin.y + wallSize.y))

  stroke(ceilingColor)
  fill(ceilingColor)
  rect(0, 0, WIDTH, wallOrigin.y)

  stroke(wallColor)
  fill(wallColor)
  rect(wallOrigin.x, wallOrigin.y, wallSize.x, wallSize.y)
}

function draw() {
  let currentStepRatio: number = (steps - currentStep) / steps;
  let nextStepRatio: number = (steps - (currentStep + 1)) / steps;

  let currentPanelColor: p5.Color = color(
    red(panelColor) * (1.5 - currentStepRatio),
    green(panelColor) * (1.5 - currentStepRatio),
    blue(panelColor) * (1.5 - currentStepRatio)
  )
  fill(currentPanelColor)
  stroke(currentPanelColor)
  
  console.log(currentStepRatio)
  // Left wall
  quad(
    wallOrigin.x * currentStepRatio, wallOrigin.y * currentStepRatio,
    wallOrigin.x * currentStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * currentStepRatio,
    wallOrigin.x * nextStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * nextStepRatio,
    wallOrigin.x * nextStepRatio, wallOrigin.y * nextStepRatio,
  );

  // Right wall
  quad(
    WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * currentStepRatio, wallOrigin.y * currentStepRatio,
    WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * currentStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * currentStepRatio,
    WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * nextStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * nextStepRatio,
    WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * nextStepRatio, wallOrigin.y * nextStepRatio
  );

  currentStep = currentStep + 1;
  if (currentStep > steps) {
    noLoop();
  }
}
