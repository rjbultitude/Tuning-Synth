import { ONESHOT, QWERTY } from '../utils/constants';
import { playAndShowNote, stopAndHideNote } from './keyboard';
import { getDefaultIntervals } from '../utils/utils';

export function setQwertyEvents(config, updateAudioOutput) {
  document.addEventListener(
    'keydown',
    (e) => {
      if (config.playing && config.playMode === ONESHOT) {
        return;
      }
      if (QWERTY.includes(e.key)) {
        const currentKeyindex = QWERTY.indexOf(e.key);
        playAndShowNote(config, currentKeyindex, updateAudioOutput);
      }
    },
    false
  );
  document.addEventListener('keyup', (e) => {
    if (QWERTY.includes(e.key) && config.playMode === ONESHOT) {
      stopAndHideNote(config, updateAudioOutput);
    }
  });
}
