import { getDOMEls } from './dom-els';
import { FREQ_UNIT, STATUS_STOPPED, SUSTAIN } from './constants';

export function getFormInputVal(formEl) {
  return formEl.value;
}

export function updateInstructions(config) {
  const midiText = document.getElementById('midiText');
  if (config.MIDINotSupported) {
    midiText.style.display = 'none';
  }
  return midiText;
}

export function updateBody(playing, className) {
  const docBody = getDOMEls().body;
  if (playing === false) {
    docBody.classList.add(className);
    return className;
  }
  if (playing) {
    docBody.classList.remove(className);
    return '';
  }
}

export function updateUI(value, el, unit = '') {
  if (typeof value === 'number') {
    const trimNumber = parseInt(value).toFixed();
    el.innerText = `${trimNumber} ${unit}`;
    return el;
  }
  if (typeof value === 'string') {
    el.innerText = value;
    return el;
  }
  return el;
}

export function updateAudioOutput(
  config,
  _updateUI = updateUI,
  _updateBody = updateBody
) {
  const { freqTextNode, statusTextNode } = getDOMEls();
  if (config.playing === false) {
    _updateUI('', freqTextNode);
    _updateUI('Stopped', statusTextNode);
    if (config.playMode === SUSTAIN) {
      updateBody(config.playing, STATUS_STOPPED);
    }
  } else {
    _updateUI(config.currentFreq, freqTextNode, FREQ_UNIT);
    _updateUI('Playing', statusTextNode);
    _updateBody(config.playing);
    if (config.playMode === SUSTAIN) {
      _updateBody(config.playing, STATUS_STOPPED);
    }
  }
}

export function getDefaultIntervals(config) {
  const intervals = [];
  for (let index = config.intervalsRange.lower; index < 0; index++) {
    intervals.push(index);
  }
  for (let index = 0; index <= config.intervalsRange.upper; index++) {
    intervals.push(index);
  }
  return intervals;
}

export function getInitialSelectVal(el, defaultVal) {
  if (el && 'value' in el) {
    return el.value;
  }
  return defaultVal;
}
