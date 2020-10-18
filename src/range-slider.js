import { getDOMEls } from './dom-els';

export function getVals(sliders) {
  let sliderLow = parseFloat(sliders.spectrumControlLow.value);
  let sliderHigh = parseFloat(sliders.spectrumControlHigh.value);
  let tmp;
  // Determine which is larger
  if (sliderLow > sliderHigh) {
    tmp = sliderHigh;
    sliderHigh = sliderLow;
    sliderLow = tmp;
  }
  return {
    sliderLow,
    sliderHigh,
  };
}

export function setupSlider(config, callBack) {
  const { sliders, sliderTextNode } = getDOMEls();
  sliders.spectrumControlHigh.value = config.numFreqBands;
  const sliderEls = Object.keys(sliders);
  for (let i = 0; i < sliderEls.length; i++) {
    const key = sliderEls[i];
    if (sliders[key].type === 'range') {
      sliders[key].max = config.numFreqBands;
      sliders[key].step = config.numFreqBands / 20;
      sliders[key].oninput = function () {
        const sliderVals = getVals(sliders);
        callBack(sliderVals, config);
      };
    }
  }
}
