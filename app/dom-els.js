// DOM elements
export const waveControls = document.audioControls.waveType;
export const grainControl = document.visualControls.grainSize;
export const grainTextNode = document.getElementById('grainValueText');
export const sliders = {
  spectrumControlLow: document.visualControls.freqRangeLow,
  spectrumControlHigh: document.visualControls.freqRangeHigh,
};
export const pitchControl = document.getElementById('freqPitch');
export const sliderTextNode = document.getElementById('rangeValueText');
export const rootNoteTextNode = document.getElementById('rootNoteText');
export const freqTextNode = document.getElementById('audioOutputFreq');
export const statusTextNode = document.getElementById('audioOutputStatus');
