import { getDefaultIntervals, updateAudioOutput } from '../utils/utils';
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

export function getKeyIDFromIndex(numNegativeKeys, index) {
  return index + numNegativeKeys;
}

export function getIndexFromKeyID(numNegativeKeys, keyID) {
  return keyID + Math.abs(numNegativeKeys);
}

export function setDefaultBtnStyle(keyBoardButtonStyles, keyID, keyIndex) {
  const elID = getElIDFromIndex(keyID);
  const kbdBtn = document.getElementById(elID);
  const keyStyle = keyBoardButtonStyles[keyIndex];
  kbdBtn.style.backgroundColor = keyStyle;
  kbdBtn.style.color = 'white';
  return kbdBtn;
}

export function setBtnHighlightStyle(keyID) {
  const elID = getElIDFromIndex(keyID);
  const kbdBtn = document.getElementById(elID);
  kbdBtn.style.backgroundColor = 'white';
  kbdBtn.style.color = 'black';
  return kbdBtn;
}

export function highlightCurrKeyCB({
  config,
  currKeyID,
  currentKeyindex,
  noteOff,
}) {
  // Handle One Shot mode
  if (noteOff) {
    const kbdBtn = setDefaultBtnStyle(
      config.keyBoardButtonStyles,
      currKeyID,
      currentKeyindex
    );
    return kbdBtn;
  }
  const kbdBtnHighlighted = setBtnHighlightStyle(currKeyID);
  const keyID = getKeyIDNum(kbdBtnHighlighted);
  config.prevKbdBtnID =
    config.currKbdBtnID === null ? keyID : config.currKbdBtnID;
  config.currKbdBtnID = keyID;
  return kbdBtnHighlighted;
}

export function getElIDFromIndex(index) {
  return `key_${index}`;
}

export function unhighlightPrevKeyCB(config) {
  if (config.currKbdBtnID === null) {
    return undefined;
  }
  const prevKeyIndex = getIndexFromKeyID(
    config.intervalsRange.lower,
    config.prevKbdBtnID
  );
  const prevKeyID = getKeyIDFromIndex(
    config.intervalsRange.lower,
    prevKeyIndex
  );
  const prevKbdBtnEl = setDefaultBtnStyle(
    config.keyBoardButtonStyles,
    prevKeyID,
    prevKeyIndex
  );
  return prevKbdBtnEl;
}

export function highlightNote(
  config,
  currentKeyindex,
  noteOff,
  _highlightCurrKeyCB = highlightCurrKeyCB,
  _unhighlightPrevKeyCB = unhighlightPrevKeyCB
) {
  const currKeyID = getKeyIDFromIndex(
    config.intervalsRange.lower,
    currentKeyindex
  );
  // Set current UI key state
  _highlightCurrKeyCB({
    config,
    currKeyID,
    currentKeyindex,
    noteOff,
  });
  // Set previous UI key state
  // For Sustain mode only
  const sameNote = config.currKbdBtnID === config.prevKbdBtnID ? true : false;
  if (config.playMode === SUSTAIN && sameNote === false) {
    _unhighlightPrevKeyCB(config);
  }
}

export function stopPlayback(config, _updateAudioOutput = updateAudioOutput) {
  config.playing = false;
  _updateAudioOutput(config);
  stopCurrentNote(config);
}

export function playAndShowNote(
  { config, index },
  _playCurrentNote = playCurrentNote,
  _updateAudioOutput = updateAudioOutput
) {
  const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
  config.playing = true;
  config.currentFreq = currFreq;
  config.selectedInterval = index;
  _updateAudioOutput(config);
  _playCurrentNote({ config, freq: currFreq });
  return config;
}

export function stopAndResetKbd(
  config,
  _stopPlayback = stopPlayback,
  _setDefaultBtnStyle = setDefaultBtnStyle
) {
  if (config.playing) {
    _stopPlayback(config);
    const keyIndex = getIndexFromKeyID(
      config.intervalsRange.lower,
      config.currKbdBtnID
    );
    _setDefaultBtnStyle(
      config.keyBoardButtonStyles,
      config.currKbdBtnID,
      keyIndex
    );
  }
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

export function onScreenKbdBtnKeyDown(
  e,
  index,
  config,
  _stopPlayback = stopPlayback,
  _playAndShowNote = playAndShowNote
) {
  if (e.key === 'Enter') {
    if (config.playing) {
      _stopPlayback(config, updateAudioOutput);
      return;
    }
    _playAndShowNote({
      config,
      index,
      updateAudioOutput,
      playCurrentNote,
    });
  }
}

export function addBtnListeners({ keyButton, config, index }) {
  keyButton.addEventListener(
    'mousedown',
    () => {
      playAndShowNote({ config, index });
    },
    false
  );
  keyButton.addEventListener(
    'mouseup',
    () => {
      if (config.playMode === ONESHOT) {
        stopPlayback({ config });
      }
    },
    false
  );
  keyButton.addEventListener(
    'keydown',
    (e) => {
      onScreenKbdBtnKeyDown(e, index, config);
    },
    false
  );
  keyButton.addEventListener(
    'touchstart',
    () => {
      playAndShowNote({
        config,
        index,
      });
    },
    false
  );
  keyButton.addEventListener(
    'touchend',
    () => {
      stopPlayback({ config });
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
  const btnStyle = `rgba(${btnColour.r},${btnColour.g},${btnColour.b}`;
  config.keyBoardButtonStyles[index] = btnStyle;
  keyButton.style.backgroundColor = btnStyle;
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
}) {
  setKbdBtnStyles({ p5Sketch, config, keyButton, defaultIntervals, index });
  setBtnAttrs({ keyButton, num });
  addBtnListeners({ keyButton, config, index });
  keyboardWrapper.appendChild(keyButton);
}

export function createKeyboardButtons(
  config,
  keyboardWrapper,
  defaultIntervals,
  p5Sketch
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
    });
  });
  return keyboardWrapper;
}

export function createKeyboard(config, p5Sketch) {
  const keyboardWrapper = document.createElement('section');
  keyboardWrapper.setAttribute('class', 'keyboard');
  keyboardWrapper.setAttribute('tabindex', '0');
  const defaultIntervals = getDefaultIntervals(config);
  createKeyboardButtons(config, keyboardWrapper, defaultIntervals, p5Sketch);
  return keyboardWrapper;
}
