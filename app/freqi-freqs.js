import freqi from 'freqi';

const intervals = [0, 3, 5, 7];
const startFreq = 440;
const modes = freqi.getModes();

export function getSysFrequencies() {
  const freqs = {};
  for (let index = 0; index < modes.length; index++) {
    const value = freqi.getFreqs({
      startFreq,
      intervals,
      mode: modes[index],
    });
    Object.defineProperty(freqs, modes[index], {
      value,
    });
  }
  return freqs;
}
