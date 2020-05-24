export function getVals(sliders) {
  let slider1 = parseFloat(sliders[0].value);
  let slider2 = parseFloat(sliders[1].value);
  let tmp;
  // Determine which is larger
  if (slider1 > slider2) {
    tmp = slider2;
    slider2 = slider1;
    slider1 = tmp;
  }
  return {
    slider1,
    slider2,
  };
}

export function setupSlider(sliders, config, sliderTextNode, callBack) {
  console.log(
    'sliders.spectrumControlHigh.value',
    sliders.spectrumControlHigh.value
  );
  sliders.spectrumControlHigh.value = config.numFreqBands;
  const sliderEls = Object.keys(sliders);
  for (let i = 0; i < sliderEls.length; i++) {
    const key = sliderEls[i];
    if (sliders[key].type === 'range') {
      sliders[key].max = config.numFreqBands;
      sliders[key].oninput = function () {
        const sliderVals = getVals(sliderEls);
        callBack(sliderVals, config, sliderTextNode);
      };
    }
  }
}
