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

  // var displayElement = parent.getElementsByClassName('rangeValues')[0];
  // displayElement.innerHTML = `${slider1} ${slider2}`;
  return {
    slider1,
    slider2,
  };
}

export function setupSlider(sliders, config, callBack) {
  for (let i = 0; i < sliders.length; i++) {
    if (sliders[i].type === 'range') {
      sliders[i].oninput = function () {
        const sliderVals = getVals(sliders);
        callBack(sliderVals, config);
      };
    }
  }
}
