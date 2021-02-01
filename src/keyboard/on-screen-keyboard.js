import { getDefaultIntervals } from '../utils/utils';
import { ONESHOT, THEME_RGB } from '../utils/constants';

export function playCurrentNote({ config, freq }) {
  config.osc.freq(freq);
  config.osc.start();
}

export function stopCurrentNote(config) {
  config.osc.stop();
}

export function highlightOctaves({ config, KEYBOARD_OCT_STYLE }) {
  const selectedTuningSysMeta =
    config.freqiTuningSysMeta[config.selectedTuningSys];
  const octave = selectedTuningSysMeta.intervalsInOctave;
  config.keyboardButtons.forEach((item) => {
    const keyID = item.id.split('_')[1];
    const keyIDNum = parseInt(keyID);
    const keyIDAbs = Math.abs(keyIDNum);
    if (keyIDAbs === octave) {
      item.style.boxShadow = KEYBOARD_OCT_STYLE;
    } else {
      item.style.boxShadow = 'none';
    }
  });
}

export function stopAndHideNote({ config, updateAudioOutput }) {
  config.playing = false;
  updateAudioOutput(config);
  stopCurrentNote(config);
}

export function playAndShowNote({
  config,
  index,
  updateAudioOutput,
  playCurrentNote,
}) {
  const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
  config.playing = true;
  config.currentFreq = currFreq;
  config.selectedInterval = index;
  updateAudioOutput(config);
  playCurrentNote({ config, freq: currFreq });
  return config;
}

export function getBtnColour(index, defaultIntervals, p5Sketch) {
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
  const g = THEME_RGB.mid;
  return {
    r,
    g,
    b,
  };
}

export function setBtnAttrs({ keyButton, num }) {
  keyButton.setAttribute('class', 'keyboard__button');
  keyButton.setAttribute('id', `key_${num}`);
  keyButton.innerText = `${num}`;
  return keyButton;
}

export function addBtnListeners({
  keyButton,
  config,
  index,
  updateAudioOutput,
}) {
  keyButton.addEventListener(
    'mousedown',
    () => {
      playAndShowNote({ config, index, updateAudioOutput, playCurrentNote });
    },
    false
  );
  keyButton.addEventListener(
    'mouseup',
    () => {
      if (config.playMode === ONESHOT) {
        stopAndHideNote({ config, updateAudioOutput });
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
        playAndShowNote({
          config,
          index,
          updateAudioOutput,
          playCurrentNote,
        });
      }
    },
    false
  );
  keyButton.addEventListener(
    'touchstart',
    () => {
      playAndShowNote({
        config,
        index,
        updateAudioOutput,
        playCurrentNote,
      });
    },
    false
  );
  keyButton.addEventListener(
    'touchend',
    () => {
      stopAndHideNote({ config, updateAudioOutput });
    },
    false
  );
  return keyButton;
}

export function createEachKbdBn({
  num,
  index,
  config,
  keyboardWrapper,
  keyButton,
  defaultIntervals,
  p5Sketch,
  updateAudioOutput,
}) {
  const btnColour = getBtnColour(index, defaultIntervals, p5Sketch);
  keyButton.style.cssText = `background-color: rgba(${btnColour.r},${btnColour.g},${btnColour.b}`;
  setBtnAttrs({ keyButton, num });
  addBtnListeners({ keyButton, config, index, updateAudioOutput });
  keyboardWrapper.appendChild(keyButton);
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
    createEachKbdBn({
      num,
      index,
      config,
      keyboardWrapper,
      keyButton,
      defaultIntervals,
      p5Sketch,
      updateAudioOutput,
    });
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
