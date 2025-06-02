"use strict";
const WIDTH = 800;
const HEIGHT = 600;
let wallSize;
let wallOrigin;
let wallColor;
let panelColor;
let floorColor;
let ceilingColor;
let steps = 10;
let currentStep = 0;
function setup() {
    let canvasRenderer = createCanvas(WIDTH, HEIGHT);
    canvasRenderer.parent("container");
    background(200);
    noSmooth();
    steps = floor(random(5, 50));
    wallSize = createVector(0, 0);
    wallSize.x = WIDTH * random(0.02, 0.2);
    wallSize.y = wallSize.x * 0.5625 * random(0.8, 1.2);
    wallOrigin = createVector((WIDTH - wallSize.x) * random(0.1, 0.9), (HEIGHT - wallSize.y) * random(0.1, 0.9));
    wallColor = color(random(50, 150), random(50, 150), random(50, 150));
    panelColor = color(random(0, 150), random(0, 150), random(0, 150));
    floorColor = color(random(0, 50), random(0, 50), random(0, 50));
    ceilingColor = color(random(0, 50), random(0, 50), random(0, 50));
    stroke(floorColor);
    fill(floorColor);
    rect(0, wallOrigin.y + wallSize.y, WIDTH, HEIGHT - (wallOrigin.y + wallSize.y));
    stroke(ceilingColor);
    fill(ceilingColor);
    rect(0, 0, WIDTH, wallOrigin.y);
    stroke(wallColor);
    fill(wallColor);
    rect(wallOrigin.x, wallOrigin.y, wallSize.x, wallSize.y);
}
function draw() {
    let currentStepRatio = (steps - currentStep) / steps;
    let nextStepRatio = (steps - (currentStep + 1)) / steps;
    let currentPanelColor = color(red(panelColor) * (1.5 - currentStepRatio), green(panelColor) * (1.5 - currentStepRatio), blue(panelColor) * (1.5 - currentStepRatio));
    fill(currentPanelColor);
    stroke(currentPanelColor);
    console.log(currentStepRatio);
    quad(wallOrigin.x * currentStepRatio, wallOrigin.y * currentStepRatio, wallOrigin.x * currentStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * currentStepRatio, wallOrigin.x * nextStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * nextStepRatio, wallOrigin.x * nextStepRatio, wallOrigin.y * nextStepRatio);
    quad(WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * currentStepRatio, wallOrigin.y * currentStepRatio, WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * currentStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * currentStepRatio, WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * nextStepRatio, HEIGHT - (HEIGHT - (wallOrigin.y + wallSize.y)) * nextStepRatio, WIDTH - (WIDTH - (wallOrigin.x + wallSize.x)) * nextStepRatio, wallOrigin.y * nextStepRatio);
    currentStep = currentStep + 1;
    if (currentStep > steps) {
        noLoop();
    }
}
//# sourceMappingURL=index.js.map