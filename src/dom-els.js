// DOM elements
export function getDOMEls() {
  return {
    grainControl: document.visualControls.grainSize,
    waveControls: document.audioControls.waveType,
    pitchControl: document.getElementById('freqPitch'),
    rootNoteTextNode: document.getElementById('rootNoteText'),
    sliders: {
      spectrumControlLow: document.visualControls.freqRangeLow,
      spectrumControlHigh: document.visualControls.freqRangeHigh,
    },
    sliderTextNode: document.getElementById('rangeValueText'),
    grainTextNode: document.getElementById('grainValueText'),
    freqTextNode: document.getElementById('audioOutputFreq'),
    statusTextNode: document.getElementById('audioOutputStatus'),
  };
}
