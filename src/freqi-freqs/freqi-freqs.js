import freqi from 'freqi';
import { getDefaultIntervals } from '../utils/utils';

export function createTuningSysNotes(config, modes) {
  const tuningSysNotes = {};
  for (let index = 0; index < modes.length; index++) {
    const currentMode = modes[index];
    const notesArray = freqi.getFreqs({
      startFreq: config.startFreq,
      intervals: getDefaultIntervals(config),
      mode: currentMode,
    });
    Object.defineProperty(tuningSysNotes, currentMode, {
      value: notesArray,
      enumerable: true,
      writable: true,
    });
  }
  config.tuningSysNotes = tuningSysNotes;
  return config;
}

export function setTuningSysNotes(config) {
  Object.keys(config.tuningSysNotes).map((tuningSys) => {
    const val = config.tuningSysNotes[tuningSys];
    config.tuningSysNotes[tuningSys] = freqi.getFreqs({
      startFreq: config.startFreq,
      intervals: getDefaultIntervals(config),
      mode: tuningSys,
    });
  });
  return config;
}
