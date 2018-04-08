document.addEventListener("DOMContentLoaded", function(event) {
  for (let i = 0; i < 5000; i++) {
    let blueprint = document.createElement('div');
    blueprint.className = 'dot';
    document.getElementById('container').appendChild(blueprint);
  }
});

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = menu.style.display == 'block' ? 'none' : 'block';
}

function setField(fieldId) {
  let dots;
  let clone;
  const field = document.getElementById(fieldId);
  console.log(fieldId);
  console.log(field);
  console.log(field.value); 
  switch (fieldId) {
    case 'size':
      dots = Array.prototype.slice.call(document.getElementsByClassName('dot'));
      dots.forEach(function(dot) {
        dot.style.width = field.value + 'px';
        dot.style.height = field.value + 'px';
      });
      break;
    case 'color1':
      dots = Array.prototype.slice.call(document.getElementsByClassName('dot'));
      dots.forEach(function(dot) {
        dot.style.background = field.value;
      });
      break;
    case 'color2':
      document.getElementById('body').style.background = field.value;
      break;
  }
}