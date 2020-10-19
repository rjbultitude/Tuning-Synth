import freqi from 'freqi';

export function setDefaultIntervals(config) {
  const intervals = [];
  for (let index = config.intervalsRange.lower; index < 0; index++) {
    intervals.push(index);
  }
  for (let index = 0; index <= config.intervalsRange.upper; index++) {
    intervals.push(index);
  }
  return intervals;
}

export function createTuningSysNotes(config, modes) {
  const tuningSysNotes = {};
  for (let index = 0; index < modes.length; index++) {
    const currentMode = modes[index];
    const notesArray = freqi.getFreqs({
      startFreq: config.startFreq,
      intervals: setDefaultIntervals(config),
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
      intervals: setDefaultIntervals(config),
      mode: tuningSys,
    });
  });
  return config;
}
