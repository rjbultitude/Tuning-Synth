import { setOscFreqToTuningSys } from './freqi-controls';
import { getDOMEls } from './dom-els';
import { updateUI } from './utils';

export function createTuningSystems(config) {
  const tuningSystems = new Map();
  tuningSystems.set('eqTemp', '12TET');
  tuningSystems.set('truePythag', 'Just Intonation 5ths');
  tuningSystems.set('pythagorean', 'Pythagorean');
  tuningSystems.set('fiveLimit', 'Just Intonation five limit');
  config.tuningSystems = tuningSystems;
  return config;
}

export function getVolForWaveType(waveTypeStr) {
  switch (waveTypeStr) {
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

export function changeWave(waveTypeStr, config) {
  if (config.osc.started) {
    const oscVolume = getVolForWaveType(waveTypeStr);
    config.osc.amp(oscVolume);
  }
  config.osc.setType(waveTypeStr);
  return waveTypeStr;
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

export function togglePlay({ config, p5Sketch, updateAudioOutput }) {
  if (config.playing) {
    config.osc.stop();
    config.playing = false;
    // p5Sketch.noLoop();
  } else {
    config.osc.start();
    config.playing = true;
    // p5Sketch.loop();
  }
  // update UI
  updateAudioOutput(config);
  return config;
}

export function getInitialWaveType(waveControl) {
  if (waveControl && 'value' in waveControl) {
    return waveControl.value;
  }
  return 'sine';
}

export function setupWaveControls(config, waveControl) {
  function waveControlHandler(event) {
    console.log('event.target.value', event.target.value);
    changeWave(event.target.value, config);
  }
  waveControl.addEventListener('change', waveControlHandler);
  return waveControl;
}

export function setupPitchControls(config) {
  const { pitchControl, rootNoteTextNode } = getDOMEls();
  pitchControl.addEventListener('change', (e) => {
    config.startFreq = parseInt(e.target.value);
    updateUI(config.startFreq, rootNoteTextNode);
    // read state and update Osc
    setOscFreqToTuningSys(config);
  });
}
