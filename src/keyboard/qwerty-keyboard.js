import { ONESHOT, QWERTY } from '../utils/constants';
import {
  playAndShowNote,
  stopPlayback,
  highlightNote,
  setDefaultBtnStyle,
  getIndexFromKeyID,
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

export function qwertyKeyupCB({ e, config }, _stopPlayback = stopPlayback) {
  const currentKeyindex = QWERTY.indexOf(e.key);
  if (isEsc(e.key)) {
    // TODO DRY
    // Only is playing
    _stopPlayback(config);
    const keyIndex = getIndexFromKeyID(
      config.intervalsRange.lower,
      config.currKbdBtnID
    );
    setDefaultBtnStyle(
      config.keyBoardButtonStyles,
      config.currKbdBtnID,
      keyIndex
    );
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
