import { getSysFrequencies } from './freqi-freqs';

export function applyTuningSystem(e) {
  const selected = e.target.value;
  changeTuningSys(selected, tuningSysFreqs, config);
}

export function changeTuningSys(sysTypeKey, sysFreqs, config) {
  const freq = sysFreqs[sysTypeKey][23];
  config.osc.freq(freq);
}

export function addTuningSelectListner(select, config) {
  const tuningSysFreqs = getSysFrequencies();
  select.addEventListener('input', applyTuningSystem, false);
}

export function createTuningSelect(config) {
  const select = document.createElement('select');
  select.setAttribute('id', 'tuningSystem');
  let count = 0;
  config.tuningSystems.forEach((tuningSysVal, tuningSysKey) => {
    const newOption = document.createElement('option');
    newOption.setAttribute('id', tuningSysKey);
    newOption.setAttribute('value', tuningSysKey);
    newOption.innerText = tuningSysVal;
    select.appendChild(newOption);
    if (count === 0) {
      newOption.setAttribute('selected', 'selected');
    }
    count += 1;
  });
  addTuningSelectListner(select, config);
  return select;
}

// entry point
export function writeFreqiControls(config) {
  const container = document.getElementById('freqiControls');
  const select = createTuningSelect(config);
  container.insertBefore(select, null);
  const selectDOM = document.getElementById('tuningSystem');
  config.selectedTuningSys = selectDOM.options[selectDOM.selectedIndex].value;
  return config;
}
