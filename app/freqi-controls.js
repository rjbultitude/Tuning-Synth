import freqi from 'freqi';
import { getSysFrequencies } from './freqi-freqs';

export function changeTuningSys(sysTypeKey, sysFreqs, config) {
  const freq = sysFreqs[sysTypeKey][1];
  config.osc.freq(freq);
  console.log('config', config);
}

export function addTuningSelectListner(select, config) {
  const tuningSysFreqs = getSysFrequencies();
  select.addEventListener(
    'input',
    function changeCBWrapper(e) {
      const selected = e.target.value;
      console.log('selected', selected);
      changeTuningSys(selected, tuningSysFreqs, config);
    },
    false
  );
}

export function createTuningSelect(config) {
  const tuningSysArr = ['eqTemp', 'truePythag', 'pythagorean', 'fiveLimit'];
  const select = document.createElement('select');
  for (let index = 0; index < tuningSysArr.length; index++) {
    const newOption = document.createElement('option');
    newOption.setAttribute('name', 'tuningSystems');
    newOption.setAttribute('id', tuningSysArr[index]);
    newOption.setAttribute('value', tuningSysArr[index]);
    newOption.innerText = tuningSysArr[index];
    select.appendChild(newOption);
  }
  addTuningSelectListner(select, config);
  return select;
}

// entry point
export function writeFreqiControls(config) {
  const container = document.getElementById('freqiControls');
  const select = createTuningSelect(config);
  container.insertBefore(select, null);
}
