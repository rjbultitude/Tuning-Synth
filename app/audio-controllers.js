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

export function togglePlay(config, p5Sketch) {
  if (config.playing) {
    config.osc.stop();
    config.playing = false;
    // p5Sketch.noLoop();
  } else {
    config.osc.start();
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
