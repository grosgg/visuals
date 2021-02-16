let seed = 0;
let mountains = [];
let hut = {};


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  noiseSeed(seed);
  randomSeed(seed);
}

function setup() {
  frameRate(10);
  if (displayWidth > displayHeight) {
    createCanvas(windowWidth, windowHeight);
  } else {
    createCanvas(displayWidth, displayHeight);
  }
  // console.log({w: width, h: height});
  seed = floor(random(10000));
  noiseSeed(seed);
  randomSeed(seed);

  const colorPreset = random(Mountain.colorPresets)
  for(let i = 0; i < 5; i++) {
    let m = new Mountain(i, colorPreset);
    m.show();
    mountains.push(m);
  }

  hut = new Hut(mountains[mountains.length-1]);
}

function draw() {
  background(255); // Reset background
  // background(100, 0, 220, 150); //purple
  background(0, 100, 230, 150); // blue

  mountains.forEach((m) => m.show());

  hut.show();
  hut.smokeChimney();

  // stroke(255);
  // text(seed, 5, 20);
  // text(frameRate(), 5, 30);
}

function doubleClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
}
