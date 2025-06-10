"use strict";
const WIDTH = 800;
const HEIGHT = 800;
let wobblesCount = 0;
let strokeThickness = WIDTH * 0.05;
let strokeRoughness = strokeThickness * 0.05;
let linkPoint = [0, 0];
let nextLinkPoint = [0, 0];
function setup() {
    let canvasRenderer = createCanvas(WIDTH, HEIGHT);
    canvasRenderer.parent("container");
    background(random(["purple", "pink", "turquoise"]));
    wobblesCount = random([5, 10, 50]);
    noSmooth();
    stroke(10);
    fill(240);
    strokeWeight(strokeThickness);
}
function draw() {
    if (linkPoint[0] == 0 && linkPoint[1] == 0) {
        linkPoint = randomCoords();
    }
    nextLinkPoint = randomCoords();
    drawBezierCurve(...linkPoint, ...randomCoords(), ...randomCoords(), ...nextLinkPoint);
    linkPoint = nextLinkPoint;
    if (frameCount >= wobblesCount) {
        noLoop();
    }
}
function drawPoint(x, y, isOutline) {
    for (let i = 0; i < 5; i++) {
        let roughX = x + random(-strokeRoughness, strokeRoughness);
        let roughY = y + random(-strokeRoughness, strokeRoughness);
        if (isOutline) {
            stroke(10);
            circle(roughX, roughY, strokeThickness);
        }
        else {
            stroke(240);
            circle(roughX, roughY, strokeThickness * 0.6);
        }
    }
}
function drawBezierCurve(x1, y1, x2, y2, x3, y3, x4, y4) {
    let curveLength = dist(x1, y1, x2, y2);
    strokeWeight(strokeThickness * (WIDTH - curveLength) * 0.003);
    strokeRoughness = strokeThickness * (WIDTH - curveLength) * 0.0005;
    for (let i = 0; i < 1; i += 0.01) {
        let x = bezierPoint(x1, x2, x3, x4, i);
        let y = bezierPoint(y1, y2, y3, y4, i);
        drawPoint(x, y, true);
    }
    for (let i = 0; i < 1; i += 0.01) {
        let x = bezierPoint(x1, x2, x3, x4, i);
        let y = bezierPoint(y1, y2, y3, y4, i);
        drawPoint(x, y, false);
    }
}
function randomCoords() {
    let x = random(WIDTH * 0.1, WIDTH * 0.9);
    let y = random(HEIGHT * 0.1, HEIGHT * 0.9);
    return [x, y];
}
//# sourceMappingURL=index.js.map