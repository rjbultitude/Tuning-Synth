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

export function setTuningSysState(config, startFreq = 440) {
  const freqs = {};
  for (let index = 0; index < modes.length; index++) {
    const value = freqi.getFreqs({
      startFreq,
      intervals: setDefaultIntervals(),
      mode: modes[index],
    });
    Object.defineProperty(freqs, modes[index], {
      value,
    });
  }
  config.tuningSystems = freqs;
  return freqs;
}
