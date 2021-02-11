let xOff = 0;
let yOff = 10000;
let zOff = 20000;
let inc = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  fill('hotpink');

  const nX = noise(xOff);
  const nY = noise(yOff);
  const nZ = noise(zOff);

  ellipse(
    map(nX, 0, 1, 0, width),
    map(nY, 0, 1, 0, height),
    map(nZ, 0, 1, 10, 100),
    map(nZ, 0, 1, 10, 100)
  );

  fill('black');
  ellipse(
    map(nX, 0, 1, 0, width) - map(nZ, 0, 1, 5, 50) / 4,
    map(nY, 0, 1, 0, height) - map(nZ, 0, 1, 5, 50) / 4,
    map(nZ, 0, 1, 1, 10),
    map(nZ, 0, 1, 1, 10)
  );
  ellipse(
    map(nX, 0, 1, 0, width) + map(nZ, 0, 1, 5, 50) / 4,
    map(nY, 0, 1, 0, height) - map(nZ, 0, 1, 5, 50) / 4,
    map(nZ, 0, 1, 1, 10),
    map(nZ, 0, 1, 1, 10)
  );

  arc(
    map(nX, 0, 1, 0, width),
    map(nY, 0, 1, 0, height),
    map(nZ, 0, 1, 5, 50) / 1.5,
    map(nZ, 0, 1, 5, 50) / 1.5,
    0,
    PI,
    CHORD);


  xOff += inc;
  yOff += inc;
  zOff += inc;
}

function mousePressed() {
  if(mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
