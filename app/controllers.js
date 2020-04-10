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

export function togglePlay(config) {
  if (config.playing) {
    config.osc.stop();
    config.playing = false;
  } else {
    config.osc.start();
    config.playing = true;
  }
  return config;
}

export function getInitialWaveType(waveControls) {
  return waveControls.value || 'sine';
}

export function setupWaveControls(waveControls, config) {
  for (let index = 0; index < waveControls.length; index++) {
    waveControls[index].addEventListener('change', function() {
      changeWave(this.value, config);
    });
  }
  return waveControls;
}

export function setUpGrainControl(grainControl, config) {
  grainControl.addEventListener('change', function() {
    config.grainSize = this.value;
  });
  return grainControl;
}

export function constrainAndPlay(p5Sketch, config) {
  // Constrain playback to canvas
  const freq = p5Sketch.constrain(
    p5Sketch.map(p5Sketch.mouseX, 0, p5Sketch.width, 10, 2024),
    10,
    2024
  );
  const mouseInCanvas = isMouseInCanvas(p5Sketch);
  if (config.playing && mouseInCanvas) {
    config.osc.freq(freq);
  }
  return config;
}

export function drawFreqs(p5Sketch, config) {
  const spectrum = config.fft.analyze();
  p5Sketch.noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let r = p5Sketch.map(i, 0, spectrum.length, 50, 255);
    let b = p5Sketch.map(i, 0, spectrum.length, 255, 50);
    let x = p5Sketch.map(i, 0, spectrum.length, p5Sketch.width, 0);
    let y = p5Sketch.map(spectrum[i], 0, 255, p5Sketch.height, 0);
    p5Sketch.fill(r, 50, b);
    p5Sketch.ellipse(x, y, config.grainSize);
  }
}
