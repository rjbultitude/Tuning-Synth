import { ONESHOT, QWERTY } from '../utils/constants';
import { stopAndResetKbd } from '../utils/utils';
import {
  playAndShowNote,
  stopPlayback,
  highlightNote,
} from './on-screen-keyboard';

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
    highlightNote(config, currentKeyindex, false);
    return true;
  }
}

export function qwertyKeyupCB(
  { e, config },
  _stopAndResetKbd = stopAndResetKbd,
  _stopPlayback = stopPlayback
) {
  const currentKeyindex = QWERTY.indexOf(e.key);
  if (isEsc(e.key)) {
    _stopAndResetKbd(config);
    return;
  }
  if (QWERTY.includes(e.key) && config.playMode === ONESHOT) {
    highlightNote(config, currentKeyindex, true);
    _stopPlayback(config);
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
