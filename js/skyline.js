document.addEventListener("DOMContentLoaded", function(event) {
  const bbWindows = Array.prototype.slice.call(document.getElementsByClassName('big-building-window'));
  console.log(bbWindows);
  bbWindows.forEach(function(bbWindow, index) {
    for (let y = 1; y <= 25; y++) {
      for (let x = 1; x <= 10; x++) {
        clone = bbWindow.cloneNode(false);
        clone.style.top = `${y * 15}px`;
        clone.style.left = `${x * 13}px`;
        clone.style.display = 'block';
        clone.style.background = ['#ffffcc', '#000066'][Math.floor(Math.random() * 2)]
        bbWindow.parentNode.appendChild(clone);
      }
    }
  });
});