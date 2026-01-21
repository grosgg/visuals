function setup() {
  const ns = 0.03;
  const show_altitude = false;
  const resolution = 512;
  const zoom_factor = 1;
  const water_level = 0.4;
  const debug_view = true;

  createCanvas(resolution * zoom_factor, resolution * zoom_factor);
  stroke(0);
  textSize(zoom_factor / 2);

  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      const edge_distance = min(x, y, resolution - x, resolution - y);

      const edge_offset = map(edge_distance, resolution * 0.3, 0, 0, 1);

      const edged_altitude = noise(ns * x, ns * y) - edge_offset;

      const water_altitude = map(edged_altitude, -0.5, 1, 0, 0.9);

      const altitude = water_altitude;

      if (debug_view) {
        if (altitude <= water_level) {
          fill(
            50 - abs(altitude) * 255,
            100 - abs(altitude) * 255,
            255 - abs(altitude) * 255
          );
        } else {
          fill(0, altitude * 255, 0);
        }
      } else {
        fill(altitude * 255, 0, 0);
      }
      strokeWeight(0);
      square(x * zoom_factor, y * zoom_factor, zoom_factor);

      if (show_altitude) {
        strokeWeight(1);
        fill(0);
        text(
          altitude.toFixed(1),
          x * zoom_factor,
          y * zoom_factor + zoom_factor
        );
      }
    }
  }
}

function draw() {}
