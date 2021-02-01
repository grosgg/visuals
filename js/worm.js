xOff = 0;
yOff = 10000;
inc = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  fill(
    map(noise(xOff), 0, 1, 0, 255),
    map(noise(yOff), 0, 1, 0, 255),
    map(noise(xOff) + noise(yOff), 0, 2, 0, 255)
  );

  ellipse(
    map(noise(xOff), 0, 1, 0, width),
    map(noise(yOff), 0, 1, 0, height),
    20,
    20
  );

  xOff += inc;
  yOff += inc;
}

function mousePressed() {
  if(mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
