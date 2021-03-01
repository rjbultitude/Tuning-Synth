import { getDefaultIntervals } from '../utils/utils';
import { ONESHOT, SUSTAIN, THEME_RGB } from '../utils/constants';

export function playCurrentNote({ config, freq }) {
  config.osc.freq(freq);
  config.osc.start();
}

export function stopCurrentNote(config) {
  config.osc.stop();
}

export function getKeyIDNum(item) {
  const keyID = item.id.split('_')[1];
  const keyIDNum = parseInt(keyID);
  return keyIDNum;
}

export function getKeyIDNumAbs(item) {
  const keyIDNum = getKeyIDNum(item);
  const keyIDAbs = Math.abs(keyIDNum);
  return keyIDAbs;
}

export function highlightOctaves({ config, KEYBOARD_OCT_STYLE }) {
  const selectedTuningSysMeta =
    config.freqiTuningSysMeta[config.selectedTuningSys];
  const octave = selectedTuningSysMeta.intervalsInOctave;
  config.keyboardButtons.forEach((item) => {
    const keyIDAbs = getKeyIDNumAbs(item);
    if (keyIDAbs === octave) {
      item.style.boxShadow = KEYBOARD_OCT_STYLE;
    } else {
      item.style.boxShadow = 'none';
    }
  });
}

export function getKeyIDFromIndex(config, index) {
  return index + config.intervalsRange.lower;
}

export function getIndexFromKeyID(config, keyID) {
  return keyID + Math.abs(config.intervalsRange.lower);
}

export function highlightCurrKeyCB({
  config,
  currKeyID,
  currentKeyindex,
  noteOff,
  keyboardBtn,
}) {
  const keyID = getKeyIDNum(keyboardBtn);
  const keyStyle = config.keyBoardButtonStyles[currentKeyindex];
  if (keyID === currKeyID) {
    // Handle One Shot mode
    if (noteOff) {
      keyboardBtn.style.cssText = keyStyle;
    } else {
      keyboardBtn.style.backgroundColor = 'white';
      config.prevKbdBtnID =
        config.currKbdBtnID === null ? keyID : config.currKbdBtnID;
      config.currKbdBtnID = keyID;
    }
  }
}

export function unhighlightPrevKeyCB({ config, keyboardBtn, firstTime }) {
  const keyID = getKeyIDNum(keyboardBtn);
  const prevKeyIndex = getIndexFromKeyID(config, config.prevKbdBtnID);
  const prevKeyStyle = config.keyBoardButtonStyles[prevKeyIndex];
  if (keyID === config.prevKbdBtnID && firstTime === false) {
    keyboardBtn.style.cssText = prevKeyStyle;
  }
}

export function highlightNote(config, currentKeyindex, noteOff) {
  const currKeyID = getKeyIDFromIndex(config, currentKeyindex);
  let firstTime = config.currKbdBtnID === null ? true : false;
  // Set current UI key state
  config.keyboardButtons.forEach((keyboardBtn) => {
    highlightCurrKeyCB({
      config,
      currKeyID,
      currentKeyindex,
      noteOff,
      keyboardBtn,
    });
  });
  // Set previous UI key state
  // For Sustain mode only
  if (config.playMode === SUSTAIN) {
    config.keyboardButtons.forEach((keyboardBtn) => {
      unhighlightPrevKeyCB({ config, keyboardBtn, firstTime });
    });
  }
}

export function stopAndHideNote({ config, updateAudioOutput }) {
  config.playing = false;
  updateAudioOutput(config);
  stopCurrentNote(config);
}

export function playAndShowNote(
  { config, index, updateAudioOutput },
  _playCurrentNote = playCurrentNote
) {
  const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
  config.playing = true;
  config.currentFreq = currFreq;
  config.selectedInterval = index;
  updateAudioOutput(config);
  _playCurrentNote({ config, freq: currFreq });
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

export function setKbdBtnStyles({
  p5Sketch,
  config,
  keyButton,
  defaultIntervals,
  index,
}) {
  const btnColour = getBtnColour(index, defaultIntervals, p5Sketch);
  const btnStyle = `background-color: rgba(${btnColour.r},${btnColour.g},${btnColour.b}`;
  config.keyBoardButtonStyles[index] = btnStyle;
  keyButton.style.cssText = btnStyle;
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
  setKbdBtnStyles({ p5Sketch, config, keyButton, defaultIntervals, index });
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
