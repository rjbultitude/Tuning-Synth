import { setTuningSysNotes } from '../freqi-freqs/freqi-freqs';
import { highlightOctaves } from '../keyboard/on-screen-keyboard';
import { KEYBOARD_OCT_STYLE } from '../utils/constants';

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
  highlightOctaves({ config, KEYBOARD_OCT_STYLE });
}

export function addTuningSelectListener(select, config, updateAudioOutput) {
  select.addEventListener(
    'input',
    (e) => {
      applyTuningSystem(e, config, updateAudioOutput);
    },
    false
  );
}

export function addOptionsAttrs({
  newOption,
  count,
  tuningSysVal,
  tuningSysKey,
}) {
  newOption.setAttribute('id', tuningSysKey);
  newOption.setAttribute('value', tuningSysKey);
  newOption.innerText = tuningSysVal;
  if (count === 0) {
    newOption.setAttribute('selected', 'selected');
  }
  count += 1;
  return newOption;
}

export function createTuningOptions(select, config) {
  let count = 0;
  config.tuningSystems.forEach((tuningSysVal, tuningSysKey) => {
    const newOption = document.createElement('option');
    addOptionsAttrs({ newOption, count, tuningSysVal, tuningSysKey });
    select.appendChild(newOption);
  });
  return select;
}

// Dynamically create the tuning systems
// selectmenu from tuningSystems Map
export function createTuningSelect(config, updateAudioOutput) {
  const select = document.createElement('select');
  select.setAttribute('id', 'tuningSystem');
  select.setAttribute('class', 'controls__input');
  createTuningOptions(select, config);
  addTuningSelectListener(select, config, updateAudioOutput);
  return select;
}

// entry point
export function writeFreqiControls(config, updateAudioOutput) {
  const container = document.getElementById('freqiControls');
  const select = createTuningSelect(config, updateAudioOutput);
  console.log('select', select);
  console.log('typeof select', typeof select);
  container.insertBefore(select, null);
  const selectDOM = document.getElementById('tuningSystem');
  config.selectedTuningSys = selectDOM.options[selectDOM.selectedIndex].value;
  return config;
}
