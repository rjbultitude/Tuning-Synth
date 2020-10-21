import { getDefaultIntervals } from '../utils/utils';
import { ONESHOT } from '../utils/constants';

function playCurrentNote(config, freq) {
  config.osc.freq(freq);
  config.osc.start();
}

function stopCurrentNote(config) {
  config.osc.stop();
}

export function createKeyboard(config, updateAudioOutput) {
  const keyboardWrapper = document.createElement('div');
  keyboardWrapper.setAttribute('class', 'keyboard');
  const defaultIntervals = getDefaultIntervals(config);
  defaultIntervals.forEach((num, index) => {
    const keyButton = document.createElement('button');
    keyButton.innerText = `${num}`;
    keyButton.addEventListener(
      'mousedown',
      (e) => {
        const currFreq = config.tuningSysNotes[config.selectedTuningSys][index];
        config.playing = true;
        config.currentFreq = currFreq;
        config.selectedInterval = index;
        updateAudioOutput(config);
        playCurrentNote(config, currFreq);
      },
      false
    );
    keyButton.addEventListener(
      'mouseup',
      () => {
        console.log('config', config);
        if (config.playMode === ONESHOT) {
          config.playing = false;
          updateAudioOutput(config);
          stopCurrentNote(config);
        }
      },
      false
    );
    keyboardWrapper.appendChild(keyButton);
  });
  return keyboardWrapper;
}
