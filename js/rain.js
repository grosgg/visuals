let size = 0;
let space = 10;
let offset = 0;

let rainSound;

function preload() {
  rainSound = loadSound('sounds/rain_loop.mp3');
}

function setup() {
  // createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight);
  rainSound.loop();
  rainSound.pause();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  let n = noise(offset);
  // let n = 0.9;
  background(map(n, 0, 1, 255, 70));
  stroke(map(n, 0, 1, 205, 20));
  strokeWeight(map(n, 0, 1, 6, 1));

  for (let y = 0; y < height; y += space) {
    for (let x = 0; x < width; x += space) {
      if (random(1) < map(n, 0, 1, 0, 0.25)) {
        line(x, y, x + size, y + size);
      }
    }
  }

  offset += 0.004;
  frameRate(map(n, 0, 1, 5, 30));
  size = map(n, 0, 1, 5, 60);
  space = map(n, 0, 1, 70, 15);
  rainSound.setVolume(n);

  // stroke(255);
  // text(floor(frameRate()), 5, 20);
}

function keyPressed() {
  if (keyCode === ENTER) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function mousePressed() {
  rainSound.isPlaying() ? rainSound.pause() : rainSound.play();
}
