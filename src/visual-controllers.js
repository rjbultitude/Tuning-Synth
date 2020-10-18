import { getDOMEls } from './dom-els';
import { updateUI } from './utils';

export function setUpGrainControl(config) {
  const { grainControl } = getDOMEls();
  grainControl.addEventListener(
    'change',
    function () {
      config.grainSize = this.value;
      updateUI(config.grainSize, grainControl);
    },
    false
  );
  return grainControl;
}

export function setSpectrum(config) {
  config.spectrum = config.fft
    .analyze()
    .slice(config.sliders.one, config.sliders.two);
  // config.spectrum = config.fft.analyze();
  return config;
}

export function updateSliderVals(sliderVals, config) {
  const { sliderTextNode } = getDOMEls();
  config.sliders.one = sliderVals.sliderLow;
  config.sliders.two = sliderVals.sliderHigh;
  sliderTextNode.innerText = `${parseInt(config.sliders.one).toFixed()}
    ${parseInt(config.sliders.two).toFixed()}`;
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
