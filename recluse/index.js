function setup() {
  createCanvas(displayWidth, displayHeight);
}

function draw() {
  noLoop();
  background(100, 0, 220, 150);
  
  for(let i = 0; i < 5; i++) {
    let m = new Mountain(i);
    m.show();
  }
}

class Mountain {
  constructor(layer) {
    // this.baseHeight = random((layer+1) * height/8, (layer+2) * height/8);
    this.baseHeight = height/7 * (layer+1);
    // this.amplitude = random(height/20*(layer+1)/2, height/4*(layer+1)/2);
    this.amplitude = height/15 * (layer+1) * random(-1,1);
    this.sharpness = random(height/4, height/(8 - layer));
    // this.sharpness = random(height/2 * (layer+1), height/6);
    this.layer = layer;
  }
  
  show() {
    for(let x = 0; x < width; x++) {
      let bh = this.baseHeight;
      let y1 = (sin(x / this.sharpness)) * this.amplitude;
      let n1 = map(noise(x / this.sharpness * (this.layer+1)), 0, 1, 0, this.amplitude/4);
      let n2 = map(noise(x), 0, 1, -5-this.layer , 5+this.layer);

      strokeWeight(2);
      stroke(180 - this.layer*25, 70 - this.layer*10, 0);
      line(x, bh+y1+n1+n2, x, height);
    }
  }
}

class Hut {
  constructor() {}
}
