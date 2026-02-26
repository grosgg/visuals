import p5 from 'p5';

const WIDTH = 500;
const HEIGHT = 600;

const sides = ["top", "right", "bottom", "left"] as const;
type Side = typeof sides[number];
const placements = ["symetric", "alternate"] as const;
type Placement = typeof placements[number];
const palettes = [
  ["#FFF2D0", "#FFB2B2", "#E36A6A"],
  ["#84B179", "#A2CB8B", "#C7EABB", "#E8F5BD"]
];

let palette: string[];
let twigSourcePoint: p5.Vector;
let twigDestinationPoint: p5.Vector;
let twigLength: number;
let twigWidth: number;
let twigWaviness: number;
let twigTangleness: number;
let twigLeavesPlacement: Placement;
let leafPointiness: number;
let leafLength: number;
let leafMessiness: number;

let twigPoints: p5.Vector[] = [];

const sketch = (p: p5) => {
  p.setup = () => {
    p.angleMode(p5.DEGREES);
    const canvas = p.createCanvas(WIDTH, HEIGHT);
    canvas.parent("app");

    palette = p.shuffle(p.random(palettes));
    p.background(palette[0]);
    p.noSmooth();

    p.noFill();
    p.stroke(0);
    p.strokeWeight(2);

    const twigSourceSide: Side = p.random(sides);
    const twigDestinationSide: Side = getOppositeSide(twigSourceSide);

    twigSourcePoint = pickPointOnSide(twigSourceSide, p);
    twigDestinationPoint = pickPointOnSide(twigDestinationSide, p);

    twigWaviness = p.floor(p.random(1, 6))
    twigTangleness = p.floor(p.random(8, 32));

    leafMessiness = p.random([0.2, 0.5, 0.8]);
    leafLength = twigTangleness < 10 ? p.random(0.04, 0.15) * WIDTH : p.random(0.04, 0.08) * WIDTH;
    leafPointiness = p.random(0, 0.95);
    twigLeavesPlacement = leafPointiness < 0.8 ? p.random(placements) : "symetric";

    twigLength = p.random(0.4, 0.9);
    twigWidth = p.floor(p.random(WIDTH * 0.005, WIDTH * 0.01));

    const twigSourceToDestinationDifference = p.createVector(
      twigDestinationPoint.x - twigSourcePoint.x,
      twigDestinationPoint.y - twigSourcePoint.y
    );

    const twigSourceToDestinationSegment = p.createVector(
      twigSourceToDestinationDifference.x / twigTangleness,
      twigSourceToDestinationDifference.y / twigTangleness,
    );

    for (let i = 1; i <= p.floor(twigTangleness * twigLength); i++) {
      twigPoints.push(p.createVector(
        twigSourcePoint.x + twigSourceToDestinationSegment.x * (i + 0) + p.random(-WIDTH * 0.01 * twigWaviness, WIDTH * 0.01 * twigWaviness),
        twigSourcePoint.y + twigSourceToDestinationSegment.y * (i + 0) + p.random(-WIDTH * 0.01 * twigWaviness, WIDTH * 0.01 * twigWaviness)
      ))
    }

    console.log({
      twigWaviness,
      twigTangleness,
      twigLeavesPlacement,
      leafMessiness
    })

    p.stroke("black");
    p.strokeWeight(twigWidth);
    p.beginShape();
    p.splineVertex(twigSourcePoint.x, twigSourcePoint.y);
    for (let i = 0; i < twigPoints.length; i++) {
      p.splineVertex(twigPoints[i].x, twigPoints[i].y);
    }
    p.endShape();

    p.strokeWeight(twigWidth);
    p.stroke("black");
    p.fill(palette[1]);
    for (let i = twigPoints.length - 1; i > 0; i--) {
      const twigDirection = p.createVector(
        twigPoints[i].x - twigPoints[i - 1].x,
        twigPoints[i].y - twigPoints[i - 1].y,
      )
      const verticalVector = p.createVector(0, -1);
      const leafOrder = twigLeavesPlacement == "alternate" ? (i % 2 == 0 ? [1] : [-1]) : [-1, 1];
      const leafShuffle = p.shuffle(leafOrder);
      for (let j = 0; j < leafShuffle.length; j++) {
        drawLeaf(twigPoints[i], verticalVector.angleBetween(twigDirection) + leafShuffle[j], p);
      }
    }

    p.noFill();
    p.strokeWeight(4);
    p.rect(0, 0, WIDTH, HEIGHT);
    p.noLoop();

    addDownloadButton(p);
  };
};

const pickPointOnSide = (side: Side, p: p5): p5.Vector => {
  switch (side) {
    case "top": return p.createVector(p.random() * WIDTH, 0);
    case "right": return p.createVector(WIDTH, p.random() * HEIGHT);
    case "bottom": return p.createVector(p.random() * WIDTH, HEIGHT)
    case "left": return p.createVector(0, p.random() * HEIGHT);
  }
}

const getOppositeSide = (side: Side): Side => {
  switch (side) {
    case "top": return "bottom";
    case "right": return "left";
    case "bottom": return "top";
    case "left": return "right";
  }
}

const drawLeaf = (origin: p5.Vector, angle: number, p: p5): void => {
  const messedAngle = angle + p.random(-leafMessiness, leafMessiness);
  p.push();

  p.translate(origin.x, origin.y);
  p.rotate(messedAngle);

  p.beginShape();
  p.splineVertex(0, 0);
  p.splineVertex(0 - (1 - leafPointiness) * leafLength, (-0.5 + leafPointiness * 0.3) * leafLength);
  p.splineVertex(0, 0 - leafLength);
  p.splineVertex((1 - leafPointiness) * leafLength, (-0.5 + leafPointiness * 0.3) * leafLength);
  p.splineVertex(0, 0);
  p.endShape();

  if (leafPointiness < 0.9) {
    p.strokeWeight(twigWidth * 0.5);
    p.line(0, 0, 0, -0.8 * leafLength);
  }
  p.pop();
}

const addDownloadButton = (p: p5) => {
  const buttons = document.getElementById("buttons");
  if (buttons == null) { return }

  const button: HTMLButtonElement = document.createElement("button");
  button.textContent = "Download";
  button.type = "button";

  button.addEventListener("click", () => {
    p.saveCanvas('twig_' + Date.now() + '.png')
  });

  buttons.appendChild(button);
}

new p5(sketch);