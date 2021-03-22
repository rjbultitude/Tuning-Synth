import { ONESHOT, QWERTY } from '../utils/constants';
import {
  playAndShowNote,
  stopAndHideNote,
  highlightNote,
  setDefaultBtnStyle,
  getIndexFromKeyID,
} from './on-screen-keyboard';
import { updateAudioOutput } from '../utils/utils';

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
  _updateAudioOutput = updateAudioOutput
) {
  const currentKeyindex = QWERTY.indexOf(e.key);
  if (isEsc(e.key)) {
    const keyIndex = getIndexFromKeyID(
      config.intervalsRange.lower,
      config.currKbdBtnID
    );
    setDefaultBtnStyle(config, config.currKbdBtnID, keyIndex);
    stopAndHideNote(config, _updateAudioOutput);
    return;
  }
  if (QWERTY.includes(e.key) && config.playMode === ONESHOT) {
    highlightNote(config, currentKeyindex, true);
    stopAndHideNote(config, _updateAudioOutput);
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
