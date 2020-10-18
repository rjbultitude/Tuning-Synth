import freqi from 'freqi';

const intervalsRange = {
  lower: -12,
  upper: 12,
};
const modes = freqi.getModes();

export function setDefaultIntervals() {
  const intervals = [];
  for (let index = intervalsRange.lower; index < 0; index++) {
    intervals.push(index);
  }
  for (let index = 0; index < intervalsRange.upper; index++) {
    intervals.push(index);
  }
  return intervals;
}

export function createTuningSysNotes(config) {
  const tuningSysNotes = {};
  for (let index = 0; index < modes.length; index++) {
    const currentMode = modes[index];
    const notesArray = freqi.getFreqs({
      startFreq: config.startFreq,
      intervals: setDefaultIntervals(),
      mode: currentMode,
    });
    Object.defineProperty(tuningSysNotes, currentMode, {
      value: notesArray,
      enumerable: true,
      writable: true,
    });
  }
  config.tuningSysNotes = tuningSysNotes;
  return tuningSysNotes;
}

export function setTuningSysNotes(config) {
  Object.keys(config.tuningSysNotes).map((tuningSys) => {
    const val = config.tuningSysNotes[tuningSys];
    config.tuningSysNotes[tuningSys] = freqi.getFreqs({
      startFreq: config.startFreq,
      intervals: setDefaultIntervals(),
      mode: tuningSys,
    });
  });
  return config;
}
