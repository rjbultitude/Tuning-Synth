function playCurrentNote(config, freq) {
  config.osc.freq(freq);
  config.osc.start();
}

export function createKeyboard(config) {
  const selectedIntervals = config.tuningSysNotes[config.selectedTuningSys];
  const keyboardWrapper = document.createElement('div');
  keyboardWrapper.setAttribute('id', 'keyboard');
  selectedIntervals.forEach((freq, index) => {
    const keyButton = document.createElement('button');
    keyButton.innerText = `${index} - Freq: ${freq.toFixed()}`;
    keyButton.addEventListener(
      'click',
      () => {
        playCurrentNote(config, freq);
      },
      false
    );
    keyboardWrapper.appendChild(keyButton);
  });
  return keyboardWrapper;
}
