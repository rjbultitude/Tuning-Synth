// DOM elements
export function getDOMEls() {
  return {
    grainControl: document.getElementById('grainSize'),
    waveControl: document.getElementById('waveType'),
    pitchControl: document.getElementById('freqPitch'),
    rootNoteTextNode: document.getElementById('rootNoteText'),
    sliders: {
      spectrumControlLow: document.getElementById('freqRangeLow'),
      spectrumControlHigh: document.getElementById('freqRangeHigh'),
    },
    sliderTextNode: document.getElementById('rangeValueText'),
    grainTextNode: document.getElementById('grainValueText'),
    freqTextNode: document.getElementById('audioOutputFreq'),
    statusTextNode: document.getElementById('audioOutputStatus'),
  };
}
