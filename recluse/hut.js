class Hut {
  constructor(mountain) {
    // console.log(mountain);
    this.w = 20;
    this.x = constrain(mountain.highestPoint.x, width / 100, width * 9/10);
    this.y = random(mountain.highestPoint.y + 2 * this.w, height - 4 * this.w);

    this.cx = this.x + this.w * 3/4;
    this.cw = this.w / 6;
    this.ch = - this.w / 2;

    this.smokes = [];
  }

  show() {
    noStroke();
    fill(150, 111, 51);

    // walls
    rect(this.x, this.y, this.w, this.w * 2/3);

    // chimney
    rect(this.cx, this.y, this.cw, this.ch);

    // roof
    fill(165,42,42);
    triangle(
      this.x - this.w / 10, this.y,
      this.x + this.w / 2, this.y - this.w / 2,
      this.x + this.w + this.w / 10, this.y
    );

    // door
    fill(165,42,42);
    rect(this.x + this.w / 10, this.y + this.w * 2/3, this.w / 4, - this.w / 2);

    // window
    this.drawWindow();
  }

  drawWindow() {
    fill(255, random(120, 165), 0);
    rect(this.x + this.w / 2, this.y + this.w / 10, this.w / 3, this.w / 3);
  }

  smokeChimney() {
    let s = new Smoke(this);
    this.smokes.push(s);

    this.smokes.forEach((s) => {
      s.move();
      s.show();
    });

    for(let i = this.smokes.length-1; i > 0; i--) {
      if (this.smokes[i].alpha < 0) { this.smokes.splice(i, 1) }
    }
  }
}

class Smoke {
  constructor(hut) {
    this.x = hut.cx + hut.cw / 2;
    this.y = hut.y + hut.ch;
    this.w = hut.cw;
    this.alpha = 80;
    this.n = random();
  }

  show() {
    fill(100, this.alpha);
    ellipse(this.x, this.y, this.w);
  }

  move(i) {
    this.y -= 3;
    this.x += map(noise(this.y+this.n), 0, 1, -2, 2);
    this.alpha -= 0.4;
  }
}
