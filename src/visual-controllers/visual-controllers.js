import { updateUI } from '../utils/utils';
import {
  THEME_RGB,
  SHAPES,
  IDLE_STATE_ARR_DENOMINATOR,
} from '../utils/constants';

export function shapeControlCB(event, config) {
  config.shape = event.target.value;
  return config;
}

export function setupShapeControls(config, shapeControl) {
  shapeControl.addEventListener(
    'change',
    function (e) {
      shapeControlCB(e, config);
    },
    false
  );
  return shapeControl;
}

export function grainCtrlCB(e, config, grainTextNode, _updateUI = updateUI) {
  config.grainSize = e.target.value;
  updateUI(config.grainSize, grainTextNode);
  return config;
}

export function setUpGrainControl(config, grainControl, grainTextNode) {
  grainControl.addEventListener(
    'change',
    function (e) {
      grainCtrlCB(e, config, grainTextNode);
    },
    false
  );
  return grainControl;
}

export function createIdleStateArr(config) {
  const numItems = config.numFreqBands / IDLE_STATE_ARR_DENOMINATOR;
  let count = 0;
  for (let i = 0; i < numItems; i++) {
    config.idleStateArr.push(count);
    count = count + 1;
  }
  return config;
}

export function resetIdleStateArray(config) {
  for (let i = 0; i < config.idleStateArr.length; i++) {
    config.idleStateArr[i] = i;
  }
  return config;
}

export function setSpectrum(config) {
  config.spectrum = config.fft
    .analyze()
    .slice(config.sliders.one, config.sliders.two);
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

export function drawShape({ p5Sketch, config, x, y }) {
  const w = p5Sketch.width / (config.numFreqBands / 4);
  switch (config.shape) {
    case SHAPES.ELLIPSE:
      p5Sketch.ellipse(x, y, config.grainSize);
      break;
    case SHAPES.RECT:
      p5Sketch.rect(x, y, config.grainSize, p5Sketch.height - y);
      break;
    default:
      p5Sketch.ellipse(x, y, config.grainSize);
  }
}

export function getRed(p5Sketch, spectrum, i) {
  return p5Sketch.map(i, 0, spectrum.length, THEME_RGB.low, THEME_RGB.high);
}

export function getBlue(p5Sketch, spectrum, i) {
  return p5Sketch.map(i, 0, spectrum.length, THEME_RGB.high, THEME_RGB.low);
}

export function getXPos(p5Sketch, spectrum, i) {
  return p5Sketch.map(i, 0, spectrum.length, 0, p5Sketch.width);
}

export function getYPos(p5Sketch, spectrum, i) {
  // Using THEME_RGB.high because it happens to be 255
  // Which is the max possible value for RGB and FFT spectrum volume
  return p5Sketch.map(spectrum[i], 0, THEME_RGB.high, p5Sketch.height, 0);
}

export function getIdleStateYPos(p5Sketch, spectrum, i) {
  return p5Sketch.map(spectrum[i], 0, 800, p5Sketch.height / 2, 0);
}

export function updateIdleYPos(p5Sketch, config, inc, i) {
  const currentY = config.idleStateArr[i];
  const y = currentY + p5Sketch.sin(inc) * 10;
  config.idleStateArr[i] = y;
}

export function drawIdleState(p5Sketch, config) {
  p5Sketch.noStroke();
  let inc = config.radian;
  for (let i = 0; i < config.idleStateArr.length; i++) {
    let r = getRed(p5Sketch, config.idleStateArr, i);
    let b = getBlue(p5Sketch, config.idleStateArr, i);
    let x = getXPos(p5Sketch, config.idleStateArr, i);
    let y = getIdleStateYPos(p5Sketch, config.idleStateArr, i);
    p5Sketch.fill(r, THEME_RGB.mid, b);
    drawShape({ p5Sketch, config, x, y });
    // Update
    inc += config.counter / 100;
    updateIdleYPos(p5Sketch, config, inc, i);
  }
}

export function drawFreqs(p5Sketch, config) {
  p5Sketch.noStroke();
  for (let i = 0; i < config.spectrum.length; i++) {
    let r = getRed(p5Sketch, config.spectrum, i);
    let b = getBlue(p5Sketch, config.spectrum, i);
    let x = getXPos(p5Sketch, config.spectrum, i);
    let y = getYPos(p5Sketch, config.spectrum, i);
    p5Sketch.fill(r, THEME_RGB.mid, b);
    drawShape({ p5Sketch, config, x, y });
  }
  return p5Sketch;
}
