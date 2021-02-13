function setup() {
  createCanvas(displayWidth, displayHeight);
}

function draw() {
  noLoop();
  background(100, 0, 220, 150);
  
  for(let i = 0; i < 4; i++) {
    let m = new Mountain(i);
    m.show();
  }
}

class Mountain {
  constructor(layer) {
    this.baseHeight = random((layer+1) * height/6, (layer+2) * height/6);
    this.amplitude = random(10, 50);
    this.sharpness = random(30, 100);
    this.layer = layer;
  }
  
  show() {
    for(let x = 0; x < width; x++) {
      let bh = this.baseHeight;
      let y = sin(x / this.sharpness) * this.amplitude;
      let n = map(noise(x), 0, 1, -10 , 10);

      strokeWeight(2);
      stroke(180 - this.layer*40, 100, 70);
      line(x, bh+y+n, x, height);
    }
  }
}

class Hut {
  constructor() {}
}
