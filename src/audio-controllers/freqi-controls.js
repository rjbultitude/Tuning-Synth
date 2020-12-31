import { setTuningSysNotes } from '../freqi-freqs/freqi-freqs';
import { highlightOctaves } from '../keyboard/on-screen-keyboard';

export function setOscFreqToTuningSys(config, updateAudioOutput) {
  // set and update state
  setTuningSysNotes(config);
  // read state
  const freq =
    config.tuningSysNotes[config.selectedTuningSys][config.selectedInterval];
  // set state
  config.currentFreq = freq.toFixed();
  // update Oscillator
  if (config.osc.started) {
    config.osc.freq(freq);
  }
  updateAudioOutput(config);
  console.log('config', config);
  return config;
}

export function applyTuningSystem(e, config, updateAudioOutput) {
  // get value
  const tuningSysKey = e.target.value;
  // set state
  config.selectedTuningSys = tuningSysKey;
  // update Oscillator
  setOscFreqToTuningSys(config, updateAudioOutput);
  // Update highlighted octave
  highlightOctaves(config);
}

export function addTuningSelectListner(select, config, updateAudioOutput) {
  select.addEventListener(
    'input',
    (e) => {
      applyTuningSystem(e, config, updateAudioOutput);
    },
    false
  );
}

// Dynamically create the tuning systems
// selectmenu from tuningSystems Map
export function createTuningSelect(config, updateAudioOutput) {
  const select = document.createElement('select');
  select.setAttribute('id', 'tuningSystem');
  select.setAttribute('class', 'controls__input');
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
  addTuningSelectListner(select, config, updateAudioOutput);
  return select;
}

// entry point
export function writeFreqiControls(config, updateAudioOutput) {
  const container = document.getElementById('freqiControls');
  const select = createTuningSelect(config, updateAudioOutput);
  container.insertBefore(select, null);
  const selectDOM = document.getElementById('tuningSystem');
  config.selectedTuningSys = selectDOM.options[selectDOM.selectedIndex].value;
  return config;
}
