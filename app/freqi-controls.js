import { setTuningSysNotes } from './freqi-freqs';

export function setOscFreqToTuningSys(config) {
  console.log('config', config);
  // set and update state
  setTuningSysNotes(config);
  // read state
  const freq = config.tuningSysNotes[config.selectedTuningSys][23];
  // update Oscillator
  if (config.osc.started) {
    config.osc.freq(freq);
  }
  return config;
}

export function applyTuningSystem(e, config) {
  // get value
  const tuningSysKey = e.target.value;
  // set state
  config.selectedTuningSys = tuningSysKey;
  // update Oscillator
  setOscFreqToTuningSys(config);
}

export function addTuningSelectListner(select, config) {
  select.addEventListener(
    'input',
    (e) => {
      applyTuningSystem(e, config);
    },
    false
  );
}

// Dynamically create the tuning systems
// selectmenu from tuningSystems Map
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
