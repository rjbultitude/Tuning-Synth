import { getDOMEls } from './dom-els';

export function updateUI(value, el) {
  if (typeof value === 'number') {
    const trimNumber = parseInt(value).toFixed();
    el.innerText = `${trimNumber}`;
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
  if (config.playing !== true) {
    updateUI('', freqTextNode);
    updateUI('Stopped', statusTextNode);
  } else {
    updateUI(config.currentFreq, freqTextNode);
    updateUI('Playing', statusTextNode);
  }
}
