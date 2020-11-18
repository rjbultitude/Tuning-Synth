export function drawGrid(config, p5Sketch) {
  if (config.gridVisible) {
    for (let i = 0; i < config.gridLinesPosArr.length; i++) {
      p5Sketch.line(
        config.gridLinesPosArr[i],
        0,
        config.gridLinesPosArr[i],
        config.displaySize.height
      );
    }
  }
}

export function setupGridControl(config, gridControl) {
  gridControl.addEventListener(
    'click',
    (e) => {
      if (e.target.checked) {
        config.gridVisible = true;
        return true;
      }
      config.gridVisible = false;
      return false;
    },
    false
  );
}
