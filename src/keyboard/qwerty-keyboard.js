import { ONESHOT, SUSTAIN, QWERTY } from '../utils/constants';
import { playAndShowNote, stopAndHideNote } from './keyboard';
import { getDefaultIntervals } from '../utils/utils';

export function setQwertyEvents(config, updateAudioOutput) {
  const intervals = getDefaultIntervals(config);
  intervals.forEach((item, index) => {
    document.addEventListener(
      'keydown',
      (e) => {
        if (config.playing && config.playMode === ONESHOT) {
          return;
        }
        if (e.key === QWERTY[index]) {
          console.log('QWERTY[index]', QWERTY[index]);
          playAndShowNote(config, index, updateAudioOutput);
        }
      },
      false
    );
    document.addEventListener('keyup', (e) => {
      if (e.key === QWERTY[index] && config.playMode === ONESHOT) {
        stopAndHideNote(config, updateAudioOutput);
      }
    });
  });
}
