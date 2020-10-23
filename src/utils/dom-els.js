// DOM elements
export function getDOMEls() {
  return {
    body: document.body,
    pageWrapper: document.getElementById('pageWrapper'),
    visualControls: document.getElementById('visualControls'),
    grainControl: document.getElementById('grainSize'),
    waveControl: document.getElementById('waveType'),
    playModeControl: document.getElementById('playMode'),
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
