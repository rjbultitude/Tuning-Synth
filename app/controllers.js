export function changeWave(waveType, config) {
  config.osc.setType(waveType);
  return waveType;
}

export function isMouseInCanvas(p5Sketch) {
  if (p5Sketch.mouseY < p5Sketch.height && p5Sketch.mouseY > 0) {
    return true;
  }
  return false;
}

export function togglePlay(config, p5Sketch) {
  console.log('config', config);
  if (config.playing) {
    config.osc.stop();
    config.mod.stop();
    config.playing = false;
    // p5Sketch.noLoop();
  } else {
    config.osc.start();
    config.mod.start();
    config.playing = true;
    // p5Sketch.loop();
  }
  return config;
}

export function getInitialWaveType(waveControls) {
  if (waveControls && 'value' in waveControls) {
    return waveControls.value;
  }
  return 'sine';
}

export function setupWaveControls(waveControls, config) {
  function waveControlHandler(event) {
    changeWave(event.target.value, config);
  }
  for (let index = 0; index < waveControls.length; index++) {
    waveControls[index].addEventListener('change', waveControlHandler);
  }
  return waveControls;
}

export function setUpGrainControl(grainControl, config) {
  grainControl.addEventListener('change', function () {
    config.grainSize = parseFloat(this.value);
  });
  return grainControl;
}

export function setUpModulatorControl(modulator, config) {
  modulator.addEventListener('change', function () {
    config.modFreq = parseFloat(this.value);
    console.log('config.modFreq', config.modFreq);
  });
  return modulator;
}

export function constrainAndPlay(p5Sketch, config) {
  // const freq = p5Sketch.constrain(
  //   p5Sketch.map(p5Sketch.mouseX, 0, p5Sketch.width, 10, 2024),
  //   10,
  //   2024
  // );
  const mouseInCanvas = isMouseInCanvas(p5Sketch);
  if (config.playing) {
    config.mod.freq(config.modFreq);
    config.osc.freq(config.mod);
  }
  return config;
}

export function updateSliderVals(sliderVals, config) {
  config.slider1 = sliderVals.slider1;
  config.slider2 = sliderVals.slider2;
  return config;
}

export function setSpectrum(config) {
  config.spectrum = config.fft.analyze().slice(config.slider1, config.slider2);
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
