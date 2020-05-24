export function setUpGrainControl(grainControl, config) {
  grainControl.addEventListener('change', function () {
    config.grainSize = this.value;
  });
  return grainControl;
}

export function setSpectrum(config) {
  config.spectrum = config.fft.analyze().slice(config.slider1, config.slider2);
  return config;
}

export function updateSliderVals(sliderVals, config) {
  config.slider1 = sliderVals.slider1;
  config.slider2 = sliderVals.slider2;
  return config;
}

export function drawFreqs(p5Sketch, config) {
  p5Sketch.noStroke();
  for (let i = 0; i < config.spectrum.length; i++) {
    let r = p5Sketch.map(i, 0, config.spectrum.length, 50, 255);
    let b = p5Sketch.map(i, 0, config.spectrum.length, 255, 50);
    let x = p5Sketch.map(i, 0, config.spectrum.length, p5Sketch.width, 0);
    let y = p5Sketch.map(config.spectrum[i], 0, 255, p5Sketch.height, 0);
    p5Sketch.fill(r, 80, b);
    p5Sketch.ellipse(x, y, config.grainSize);
  }
  return p5Sketch;
}
