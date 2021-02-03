function setup() {
  createCanvas(400, 400);
  translate(width / 2, height / 2);
  strokeWeight(2);
  
  beginShape();
  for(let x = 0; x < TWO_PI; x += 0.01) {
    vertex(
      sin(x) * map(noise(x), 0, 1, width / 3, width / 4),
      cos(x) * height / 2.5
    );
  }
  endShape();
  
  const leftEyeSize = random(30, 50);
  beginShape();
  for(let x = 0; x < TWO_PI; x += 0.01) {
    vertex(
      sin(x) * leftEyeSize + map(noise(x), 0, 1, 5, 10) - width / 6,
      cos(x) * leftEyeSize - width / 8
    );
  }
  endShape();
  
  const rightEyeSize = random(30, 50);
  beginShape();
  for(let x = 0; x < TWO_PI; x += 0.01) {
    vertex(
      sin(x) * rightEyeSize + map(noise(x), 0, 1, 5, 10) + width / 6,
      cos(x) * rightEyeSize - width / 8
    );
  }
  endShape();
  
  fill('black');
  const leftPupilSize = random(5, 20);
  beginShape();
  for(let x = 0; x < TWO_PI; x += 0.05) {
    vertex(
      sin(x) * leftPupilSize - width / 6,
      cos(x) * leftPupilSize - width / 8
    );
  }
  endShape();

  const rightPupilSize = random(5, 20);
  beginShape();
  for(let x = 0; x < TWO_PI; x += 0.05) {
    vertex(
      sin(x) * rightPupilSize + width / 6,
      cos(x) * rightPupilSize - width / 8
    );
  }
  endShape();
  noFill();
  
  fill('white');
  const noseWidth = random(30, 100);
  const noseHeight = random(20, 40);
  beginShape();
  for(let x = 0; x < PI; x += 0.05) {
    vertex(
      sin(x) * map(noise(x), 0, 1, 0.9, 1.1) * noseWidth,
      cos(x) * noseHeight
    );
  }
  endShape();
  
  beginShape();
  for(let x = -width / 8; x < width / 8; x += 25){
    vertex(x, map(noise(x), 0, 1, -20, 20) + height / 6);
  }
  endShape();

  button = createButton('Generate');
  button.position(10, height + 10);
  button.mousePressed(reloadPage);
}

function reloadPage() {
  window.location.reload();
}
