import { ONESHOT, QWERTY } from '../utils/constants';
import {
  playCurrentNote,
  playAndShowNote,
  stopAndHideNote,
} from './on-screen-keyboard';

function isEsc(key) {
  if (key === 'Escape' || key === 'Esc' || key === 27) {
    return true;
  }
}

export function setQwertyEvents(config, updateAudioOutput) {
  document.addEventListener(
    'keydown',
    (e) => {
      if (config.playing && config.playMode === ONESHOT) {
        return;
      }
      if (QWERTY.includes(e.key)) {
        const currentKeyindex = QWERTY.indexOf(e.key);
        playAndShowNote({
          config,
          index: currentKeyindex,
          updateAudioOutput,
          playCurrentNote,
        });
      }
    },
    false
  );
  document.addEventListener('keyup', (e) => {
    if (
      (QWERTY.includes(e.key) && config.playMode === ONESHOT) ||
      isEsc(e.key)
    ) {
      stopAndHideNote({ config, updateAudioOutput });
    }
  });
}
