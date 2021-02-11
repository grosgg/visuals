function setPalette(className) {
  document.body.className = className;
}

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.style.display = menu.style.display == 'block' ? 'none' : 'block';
}
