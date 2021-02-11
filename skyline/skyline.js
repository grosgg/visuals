document.addEventListener("DOMContentLoaded", function(event) {
  // Big Building Windows
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

  // Small Building Windows
  const sbWindows = Array.prototype.slice.call(document.getElementsByClassName('small-building-window'));
  console.log(sbWindows);
  sbWindows.forEach(function(sbWindow, index) {
    for (let y = 1; y <= 9; y++) {
      for (let x = 0; x < 6; x++) {
        clone = sbWindow.cloneNode(false);
        clone.style.top = `${y * 15}px`;
        clone.style.left = `${10 + (x * 31)}px`;
        clone.style.display = 'block';
        clone.style.background = ['#ffff99', '#000066'][Math.floor(Math.random() * 2)]
        sbWindow.parentNode.appendChild(clone);
      }
    }
  });

  // Medium Building Windows
  const mbWindows = Array.prototype.slice.call(document.getElementsByClassName('medium-building-window'));
  console.log(mbWindows);
  mbWindows.forEach(function(mbWindow, index) {
    for (let y = 1; y <= 13; y++) {
      for (let x = 0; x < 10; x++) {
        clone = mbWindow.cloneNode(false);
        clone.style.top = `${y * 15}px`;
        clone.style.left = `${10 + (x * 16)}px`;
        clone.style.display = 'block';
        clone.style.background = ['#ffffcc', '#000066'][Math.floor(Math.random() * 2)]
        mbWindow.parentNode.appendChild(clone);
      }
    }
  });

  // Love Hotel Windows
  const lhWindows = Array.prototype.slice.call(document.getElementsByClassName('love-hotel-window'));
  console.log(lhWindows);
  lhWindows.forEach(function(lhWindow, index) {
    for (let y = 1; y <= 13; y++) {
      for (let x = 0; x < 7; x++) {
        clone = lhWindow.cloneNode(false);
        clone.style.top = `${60 + (y * 15)}px`;
        clone.style.left = `${10 + (x * 22)}px`;
        clone.style.display = 'block';
        clone.style.background = ['#eeeecc', '#000066'][Math.floor(Math.random() * 2)]
        lhWindow.parentNode.appendChild(clone);
      }
    }
  });

});