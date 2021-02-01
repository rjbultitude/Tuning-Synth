import { config } from 'chai';
import { setOscFreqToTuningSys } from './freqi-controls';

export function createTuningSystems(config) {
  const tuningSystems = new Map();
  Object.keys(config.tuningSysNotes).forEach((tuningSysKey) => {
    const tuninSysDisplayName =
      config.freqiTuningSysMeta[tuningSysKey].shortName;
    tuningSystems.set(tuningSysKey, tuninSysDisplayName);
  });
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

export function togglePlay({ config, updateAudioOutput }) {
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

export function playModeCallBack(e, config) {
  const playModeVal = e.target.options[e.target.selectedIndex].value;
  config.playMode = playModeVal;
  return config;
}

export function setupPlayModeControls(config, playModeControl) {
  playModeControl.addEventListener(
    'change',
    function (e) {
      playModeCallBack(e, config);
    },
    false
  );
  return playModeControl;
}

export function setupWaveControls(config, waveControl) {
  function waveControlHandler(event) {
    changeWave(event.target.value, config);
  }
  waveControl.addEventListener('change', waveControlHandler);
  return waveControl;
}

export function setupPitchControls(config, pitchControl, updateAudioOutput) {
  pitchControl.addEventListener('change', (e) => {
    config.startFreq = parseInt(e.target.value);
    // read state and update Osc
    setOscFreqToTuningSys(config, updateAudioOutput);
  });
}
