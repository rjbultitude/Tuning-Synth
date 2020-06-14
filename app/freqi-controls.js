import freqi from 'freqi';
import { getSysFrequencies } from './freqi-freqs';

export function changeTuningSys(sysTypeKey, sysFreqs, config) {
  const freq = sysFreqs[sysTypeKey][1];
  config.osc.freq(freq);
  console.log('config', config);
}

export function addFreqiCtrlListners(input, config) {
  const tuningSysFreqs = getSysFrequencies();
  input.addEventListener('change', function changeCBWrapper(e) {
    changeTuningSys(e.target.value, tuningSysFreqs, config);
  });
}

export function createControls(config) {
  const inputArr = [];
  const tuningSysArr = ['eqTemp', 'truePythag', 'pythagorean', 'fiveLimit'];
  for (let index = 0; index < tuningSysArr.length; index++) {
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    newLabel.setAttribute('for', tuningSysArr[index]);
    newLabel.innerText = tuningSysArr[index];
    newInput.setAttribute('name', 'tuningSystems');
    newInput.setAttribute('id', tuningSysArr[index]);
    newInput.setAttribute('value', tuningSysArr[index]);
    newInput.setAttribute('type', 'radio');
    addFreqiCtrlListners(newInput, config);
    const inputPair = [];
    inputPair.push(newLabel, newInput);
    inputArr.push(inputPair);
  }
  return inputArr;
}

// entry point
export function writeFreqiControls(config) {
  const container = document.getElementById('freqiControls');
  const tuningSysArr = createControls(config);
  for (let index = 0; index < tuningSysArr.length; index++) {
    const radioWrapper = document.createElement('div');
    radioWrapper.setAttribute('class', 'radio-wrapper');
    const thisRadioWrapper = container.insertBefore(radioWrapper, null);
    thisRadioWrapper.insertBefore(tuningSysArr[index][0], null);
    thisRadioWrapper.insertBefore(tuningSysArr[index][1], null);
  }
}
