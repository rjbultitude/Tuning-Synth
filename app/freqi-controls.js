import { getSysFrequencies } from './freqi-freqs';

export function changeTuningSys(sysTypeKey, sysFreqs, config) {
  const freq = sysFreqs[sysTypeKey][23];
  config.osc.freq(freq);
  console.log('config', config);
}

export function addTuningSelectListner(select, config) {
  const tuningSysFreqs = getSysFrequencies();
  select.addEventListener(
    'input',
    function changeCBWrapper(e) {
      const selected = e.target.value;
      changeTuningSys(selected, tuningSysFreqs, config);
    },
    false
  );
}

export function createTuningSelect(config) {
  const select = document.createElement('select');
  config.tuningSystems.forEach((tuningSysVal, tuningSysKey) => {
    const newOption = document.createElement('option');
    newOption.setAttribute('id', tuningSysKey);
    newOption.setAttribute('value', tuningSysKey);
    newOption.innerText = tuningSysVal;
    select.appendChild(newOption);
  });
  addTuningSelectListner(select, config);
  return select;
}

// entry point
export function writeFreqiControls(config) {
  const container = document.getElementById('freqiControls');
  const select = createTuningSelect(config);
  container.insertBefore(select, null);
}
