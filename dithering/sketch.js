let myShaderCode;
let img;
let filterShader;
let slider;
let input;

function preload() {
  myShaderCode = loadStrings("shader.frag");
  img = loadImage("sakura_branch.jpg");
}

function setup() {
  frameRate(24);
  createCanvas(img.width, img.height, WEBGL);
  imageMode(CENTER);
  filterShader = createFilterShader(myShaderCode.join("\n"));
  noStroke();

  input = createFileInput(handleImage);
  input.position(10, 10);
  slider = createSlider(0, 100, 50);
  slider.position(10, 40);
  slider.size(100);
}

function draw() {
  filterShader.setUniform("brightness", slider.value() / 1000.0);
  clear();
  background(0);
  push();
  resizeCanvas(img.width, img.height);
  image(img, 0, 0, width, height);
  pop();
  filter(filterShader);
}

function handleImage(file) {
  if (file.type === "image") {
    img = createImg(file.data, "");
    img.hide();
  } else {
    img = null;
  }
}
