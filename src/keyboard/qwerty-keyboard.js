import { ONESHOT, QWERTY } from '../utils/constants';
import { stopAndResetKbd } from './on-screen-keyboard';
import { noteOn, noteOff } from './keyboard-utils';

export function isEsc(key) {
  if (key === 'Escape' || key === 'Esc' || key === 27) {
    return true;
  }
}

export function qwertyKeydownCB({ e, config }, _noteOn = noteOn) {
  if (config.playing && config.playMode === ONESHOT) {
    return false;
  }
  if (QWERTY.includes(e.key)) {
    const currentKeyindex = QWERTY.indexOf(e.key);
    _noteOn(config, currentKeyindex);
    return true;
  }
}

export function qwertyKeyupCB(
  { e, config },
  _stopAndResetKbd = stopAndResetKbd,
  _noteOff = noteOff
) {
  const currentKeyindex = QWERTY.indexOf(e.key);
  if (isEsc(e.key)) {
    _stopAndResetKbd(config);
    return;
  }
  if (QWERTY.includes(e.key) && config.playMode === ONESHOT) {
    _noteOff(config, currentKeyindex);
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
