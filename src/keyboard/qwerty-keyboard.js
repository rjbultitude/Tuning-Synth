import { ONESHOT, QWERTY } from '../utils/constants';
import { playAndShowNote, stopAndHideNote } from './on-screen-keyboard';

export function isEsc(key) {
  if (key === 'Escape' || key === 'Esc' || key === 27) {
    return true;
  }
}

export function qwertyKeydownCB({ e, config }) {
  if (config.playing && config.playMode === ONESHOT) {
    return false;
  }
  if (QWERTY.includes(e.key)) {
    const currentKeyindex = QWERTY.indexOf(e.key);
    playAndShowNote({
      config,
      index: currentKeyindex,
    });
    return true;
  }
}

export function qwertyKeyupCB({ e, config }) {
  if ((QWERTY.includes(e.key) && config.playMode === ONESHOT) || isEsc(e.key)) {
    stopAndHideNote(config);
  }
}

export function setQwertyEvents(config) {
  document.addEventListener(
    'keydown',
    (e) => {
      qwertyKeydownCB({ e, config });
    },
    false
  );
  document.addEventListener('keyup', (e) => {
    qwertyKeyupCB({ e, config });
  });
}
