import { getDOMEls } from './dom-els';
import { FREQ_UNIT, STATUS_STOPPED, SUSTAIN } from './constants';

export function getFormInputVal(formEl) {
  return formEl.value;
}

export function updateBody(playing) {
  const docBody = getDOMEls().body;
  if (playing === false) {
    docBody.classList.add(STATUS_STOPPED);
    return STATUS_STOPPED;
  }
  if (playing) {
    docBody.classList.remove(STATUS_STOPPED);
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

export function updateAudioOutput(config) {
  const { freqTextNode, statusTextNode } = getDOMEls();
  if (config.playing === false) {
    updateUI('', freqTextNode);
    updateUI('Stopped', statusTextNode);
    if (config.playMode === SUSTAIN) {
      updateBody(config.playing);
    }
  } else {
    updateUI(config.currentFreq, freqTextNode, FREQ_UNIT);
    updateUI('Playing', statusTextNode);
    updateBody(config.playing);
    if (config.playMode === SUSTAIN) {
      updateBody(config.playing);
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

export function spacesToCamelCaseStr(str) {
  return str.replace(/[A-Z]/, (uppcaseChar) => ` ${uppcaseChar}`);
}

export function getGridLinesPosArr(config) {
  const gridLinesPosArr = [];
  for (let index = 0; index < config.gridResolution; index++) {
    let pos = index * (config.displaySize.width / config.gridResolution);
    gridLinesPosArr.push(pos);
  }
  config.gridLinesPosArr = gridLinesPosArr;
  return gridLinesPosArr;
}
