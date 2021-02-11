let size = 40;
let offset = 0;
let factor = 200;

function setup() {
  // createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  strokeWeight(6);

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      let n1 = noise((x + offset), y);
      let n2 = noise((x + offset) / factor, y / factor);
      stroke(
        map(n1, 0, 1, 0, 255),
        map(n1, 0, 1, 0, n1 * 200),
        map(n1, 0, 1, n1 * 100, 255)
      );

      if (n2 > 0.5) {
        line(x, y, x + size, y + size);
      } else {
        line(x, y + size, x + size, y);
      }
    }
  }

  offset += 0.02;
  // stroke(255);
  // text(floor(frameRate()), 5, 20);
}

function keyPressed() {
  if (keyCode === ENTER) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
