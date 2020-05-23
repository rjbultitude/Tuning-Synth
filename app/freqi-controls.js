import freqi from 'freqi';

export function addFreqiCtrlListners(input, changeCB, data) {
  input.addEventListener('change', function changeCBWrapper(e) {
    changeCB(e.target.value, data);
  });
}

export function createControls(changeCB, data) {
  const tuningSysArr = [];
  const freqiTuningSys = freqi.getModes();
  for (let index = 0; index < freqiTuningSys.length; index++) {
    const newLabel = document.createElement('label');
    const newInput = document.createElement('input');
    newLabel.setAttribute('for', freqiTuningSys[index]);
    newLabel.innerText = freqiTuningSys[index];
    newInput.setAttribute('name', 'tuningSystems');
    newInput.setAttribute('id', freqiTuningSys[index]);
    newInput.setAttribute('value', freqiTuningSys[index]);
    newInput.setAttribute('type', 'radio');
    addFreqiCtrlListners(newInput, changeCB, data);
    const inputPair = [];
    inputPair.push(newLabel, newInput);
    tuningSysArr.push(inputPair);
  }
  return tuningSysArr;
}

// entry point
export function writeFreqiControls(changeCB, data) {
  const container = document.getElementById('freqiControls');
  const tuningSysArr = createControls(changeCB);
  for (let index = 0; index < tuningSysArr.length; index++) {
    const radioWrapper = document.createElement('div');
    radioWrapper.setAttribute('class', 'radio-wrapper');
    const thisRadioWrapper = container.insertBefore(radioWrapper, null);
    thisRadioWrapper.insertBefore(tuningSysArr[index][0], null);
    thisRadioWrapper.insertBefore(tuningSysArr[index][1], null);
  }
}
