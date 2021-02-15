class Mountain {
  static colorPresets = [
    { red: 180, green: 70, blue: 0, factorRed: 25, factorGreen: 10, factorBlue: 0 }, // orange
    { red: 60, green: 120, blue: 60, factorRed: 5, factorGreen: 20, factorBlue: 5 }, // green
    // { red: 0, green: 40, blue: 160, factorRed: 0, factorGreen: 10, factorBlue: 20 }, // blue
    // { red: 250, green: 250, blue: 250, factorRed: 20, factorGreen: 20, factorBlue: 20 }, // white
    // { red: 250, green: 180, blue: 190, factorRed: 20, factorGreen: 20, factorBlue: 20 }, // pink
  ];
  constructor(layer, colorPreset) {
    const dim = height;
    const div = width > height ? 7 : 6;

    // this.baseHeight = random((layer+1) * height/8, (layer+2) * height/8);
    this.baseHeight = dim/div * (layer+1);
    // this.amplitude = random(dim/20*(layer+1)/2, dim/4*(layer+1)/2);
    this.amplitude = dim/15 * (layer+1) * random(-1,1);
    this.sharpness = random(dim/4, dim/(8 - layer));
    // this.sharpness = random(dim/2 * (layer+1), dim/6);
    this.colorPreset = colorPreset;
    this.layer = layer;
    this.highestPoint = { x: 0, y: this.baseHeight };
    // console.log(this.colorPreset);
    // console.log(layer);
  }
  
  show() {
    for(let x = 0; x < width; x++) {
      let bh = this.baseHeight;
      let y1 = (sin(x / this.sharpness)) * this.amplitude;
      let n1 = map(noise(x / this.sharpness * (this.layer+1)), 0, 1, 0, this.amplitude/4);
      let n2 = map(noise(x), 0, 1, -5-this.layer , 5+this.layer);
      let h = bh + y1 + n1 + n2;

      strokeWeight(2);
      // stroke(180 - this.layer*25, 70 - this.layer*10, 0);
      // console.log(this.colorPreset.red - this.layer * this.colorPreset.factorRed);

      stroke(
        this.colorPreset.red - this.layer * this.colorPreset.factorRed,
        this.colorPreset.green - this.layer * this.colorPreset.factorGreen,
        this.colorPreset.blue - this.layer * this.colorPreset.factorBlue
      );

      if (h < this.highestPoint.y) { this.highestPoint = {x: x, y: h}; }
      line(x, bh+y1+n1+n2, x, height);
    }
  }
}
