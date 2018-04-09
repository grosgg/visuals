document.addEventListener("DOMContentLoaded", function(event) {
  for (let i = 0; i < 2000; i++) {
    let blueprint = document.createElement('div');
    blueprint.className = 'dot';
    document.getElementById('container').appendChild(blueprint);
  }

  const dots = Array.prototype.slice.call(document.getElementsByClassName('dot'));
  setInterval(function() {
    for (let i = 0; i < 100; i++) {
      dots[Math.floor(Math.random() * dots.length)].style.opacity = Math.floor(Math.random() * 2);
    }
  }, 2000);
});

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = menu.style.display == 'block' ? 'none' : 'block';
}

function setField(fieldId) {
  let dots;
  let clone;
  const field = document.getElementById(fieldId);
  // console.log(fieldId);
  // console.log(field);
  // console.log(field.value); 
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

function setCircle(active) {
  dots = Array.prototype.slice.call(document.getElementsByClassName('dot'));
  if (!!active) {
    dots.forEach(function(dot) { dot.classList.add("circle"); });
  } else {
    dots.forEach(function(dot) { dot.classList.remove("circle"); });
  }
}

function pickPreset(preset) {
  switch(preset) {
    case 'terminal':
      setPreset('#246E1D', '#000000', '20', 'square');
      break;
    case 'bubbletea':
      setPreset('#B27CDB', '#FFF6C9', '40', 'circle');
      break;
    case 'random':
      setPreset(
        '#'+(Math.random()*0xFFFFFF<<0).toString(16),
        '#'+(Math.random()*0xFFFFFF<<0).toString(16),
        Math.random() * (100 - 20) + 20,
        ['square', 'circle'][Math.floor(Math.random() * 2)]
      );
      break;
  }
}

function setPreset(color1, color2, size, shape) {
  document.getElementById('color1').value = color1; setField('color1');
  document.getElementById('color2').value = color2; setField('color2');
  document.getElementById('size').value = size; setField('size');
  document.getElementById(shape).checked = true; setCircle(shape == 'circle');
}