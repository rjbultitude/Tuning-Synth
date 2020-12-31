import { getDefaultIntervals } from '../utils/utils';
import { ONESHOT, THEME_RGB } from '../utils/constants';

function playCurrentNote(config, freq) {
  config.osc.freq(freq);
  config.osc.start();
}

function stopCurrentNote(config) {
  config.osc.stop();
}

export function highlightOctaves(config) {
  const selectedTuningSysMeta =
    config.freqiTuningSysMeta[config.selectedTuningSys];
  const octave = selectedTuningSysMeta.intervalsInOctave;
  config.keyboardButtons.forEach((item) => {
    const keyID = item.id.split('_')[1];
    const keyIDNum = parseInt(keyID);
    const keyIDAbs = Math.abs(keyIDNum);
    if (keyIDAbs === octave) {
      item.style.boxShadow = 'inset 0 0 4px #fff';
    } else {
      item.style.boxShadow = 'none';
    }
  });
}

export function stopAndHideNote(config, updateAudioOutput) {
  config.playing = false;
  updateAudioOutput(config);
  stopCurrentNote(config);
}

export function playAndShowNote(config, index, updateAudioOutput) {
  const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
  config.playing = true;
  config.currentFreq = currFreq;
  config.selectedInterval = index;
  updateAudioOutput(config);
  playCurrentNote(config, currFreq);
  return config;
}

export function createKeyboardButtons(
  config,
  keyboardWrapper,
  defaultIntervals,
  p5Sketch,
  updateAudioOutput
) {
  defaultIntervals.forEach((num, index) => {
    const keyButton = document.createElement('button');
    const r = p5Sketch.map(
      index,
      0,
      defaultIntervals.length,
      THEME_RGB.low,
      THEME_RGB.high
    );
    const b = p5Sketch.map(
      index,
      0,
      defaultIntervals.length,
      THEME_RGB.high,
      THEME_RGB.low
    );
    keyButton.setAttribute('class', 'keyboard__button');
    keyButton.style.cssText = `background-color: rgba(${r},${THEME_RGB.mid},${b}`;
    keyButton.setAttribute('id', `key_${num}`);
    keyButton.innerText = `${num}`;
    keyButton.addEventListener(
      'mousedown',
      () => {
        playAndShowNote(config, index, updateAudioOutput);
      },
      false
    );
    keyButton.addEventListener(
      'mouseup',
      () => {
        if (config.playMode === ONESHOT) {
          stopAndHideNote(config, updateAudioOutput);
        }
      },
      false
    );
    keyButton.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter') {
          if (config.playing) {
            stopAndHideNote(config, updateAudioOutput);
            return;
          }
          playAndShowNote(config, index, updateAudioOutput);
        }
      },
      false
    );
    keyButton.addEventListener(
      'touchstart',
      () => {
        playAndShowNote(config, index, updateAudioOutput);
      },
      false
    );
    keyButton.addEventListener(
      'touchend',
      () => {
        stopAndHideNote(config, updateAudioOutput);
      },
      false
    );
    keyboardWrapper.appendChild(keyButton);
  });
  return keyboardWrapper;
}

export function createKeyboard(config, p5Sketch, updateAudioOutput) {
  const keyboardWrapper = document.createElement('section');
  keyboardWrapper.setAttribute('class', 'keyboard');
  keyboardWrapper.setAttribute('tabindex', '0');
  const defaultIntervals = getDefaultIntervals(config);
  createKeyboardButtons(
    config,
    keyboardWrapper,
    defaultIntervals,
    p5Sketch,
    updateAudioOutput
  );
  return keyboardWrapper;
}
