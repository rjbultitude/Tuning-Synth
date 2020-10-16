export function createTuningSystems(config) {
  const tuningSystems = new Map();
  tuningSystems.set('eqTemp', '12TET');
  tuningSystems.set('truePythag', 'Just Intonation 5ths');
  tuningSystems.set('pythagorean', 'Pythagorean');
  tuningSystems.set('fiveLimit', 'Just Intonation five limit');
  config.tuningSystems = tuningSystems;
  return config;
}

export function getVolForWaveType(waveType) {
  switch (waveType) {
    case 'sawtooth':
      return 0.08;
    case 'sine':
      return 0.75;
    case 'triangle':
      return 0.35;
    case 'square':
      return 0.03;
    default:
      return 0.5;
  }
}

export function changeWave(waveType, config) {
  if (config.osc.started) {
    const oscVolume = getVolForWaveType(waveType);
    console.log('oscVolume', oscVolume);
    config.osc.amp(oscVolume);
  }
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
  waveControls.addEventListener('change', waveControlHandler);
  return waveControls;
}

export function setupPitchControls(pichControl, config) {
  pichControl.addEventListener('change', (e) => {
    const newFreq = parseInt(e.target.value);
    if (config.osc.started) {
      console.log('config.osc', config.osc);
      config.osc.freq(newFreq);
    }
  });
}
