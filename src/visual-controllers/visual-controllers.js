import { updateUI } from '../utils/utils';
import { THEME_RGB } from '../utils/constants';

export function setUpGrainControl(config, grainControl, grainTextNode) {
  grainControl.addEventListener(
    'change',
    function () {
      config.grainSize = this.value;
      updateUI(config.grainSize, grainTextNode);
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

export function updateZoomUI(config, sliderVals, sliderTextNode) {
  config.sliders.one = sliderVals.sliderLow;
  config.sliders.two = sliderVals.sliderHigh;
  const sliderOneNum = parseInt(config.sliders.one).toFixed();
  const sliderTwoNum = parseInt(config.sliders.two).toFixed();
  sliderTextNode.innerText = `${sliderOneNum}\xa0${sliderTwoNum}`;
  return config;
}

export function drawFreqs(p5Sketch, config) {
  p5Sketch.noStroke();
  for (let i = 0; i < config.spectrum.length; i++) {
    let r = p5Sketch.map(
      i,
      0,
      config.spectrum.length,
      THEME_RGB.low,
      THEME_RGB.high
    );
    let b = p5Sketch.map(
      i,
      0,
      config.spectrum.length,
      THEME_RGB.high,
      THEME_RGB.low
    );
    let x = p5Sketch.map(i, 0, config.spectrum.length, p5Sketch.width, 0);
    let y = p5Sketch.map(
      config.spectrum[i],
      0,
      THEME_RGB.high,
      p5Sketch.height,
      0
    );
    p5Sketch.fill(r, THEME_RGB.mid, b);
    p5Sketch.ellipse(x, y, config.grainSize);
  }
  return p5Sketch;
}
