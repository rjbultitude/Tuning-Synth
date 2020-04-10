import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';

const sketchFn = (p5Sketch) => {
  let freq;
  let playing;
  let fft;
  let grainSize;
  const waveControls = document.controls.wave;
  const grainControl = document.controls.grainSize;
  let waveType = waveControls.value || 'sine';
  let osc = new p5.Oscillator(waveType);


  function changeWave() {
    osc.setType(waveType);
  }

  function setupWaveControls() {
    for (let index = 0; index < waveControls.length; index++) {
      waveControls[index].addEventListener('change', function() {
        waveType = this.value;
        changeWave();
      });
    }
  }

  function setUpGrainControl() {
    grainControl.addEventListener('change', function() {
      grainSize = this.value;
    });
  }

  p5Sketch.preload = function preload() {
    osc = new p5.Oscillator(waveType);
  }

  p5Sketch.setup = function setup() {
    let cnv = p5Sketch.createCanvas(1920,1080);
    cnv.parent('wrapper');
    cnv.mouseClicked(togglePlay);
    setupWaveControls();
    setUpGrainControl();
    fft = new p5.FFT();
    osc.amp(0.2);
    grainSize = 20;
  }

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);
    freq = p5Sketch.constrain(p5Sketch.map(p5Sketch.mouseX, 0, p5Sketch.width, 10, 2024), 10, 2024);
    if (playing) {
      osc.freq(freq);
    }
    let spectrum = fft.analyze();
    p5Sketch.noStroke();
    for (let i = 0; i< spectrum.length; i++){
      let r = p5Sketch.map(i, 0, spectrum.length, 50, 255);
      let b = p5Sketch.map(i, 0, spectrum.length, 255, 50);
      let x = p5Sketch.map(i, 0, spectrum.length, p5Sketch.width, 0);
      let y = p5Sketch.map(spectrum[i], 0, 255, p5Sketch.height, 0);
      p5Sketch.fill(r, 50, b);
      p5Sketch.ellipse(x, y, grainSize);
    }

  }

  function togglePlay() {
    if (playing) {
      osc.stop();
      playing = false;
    } else {
      osc.start();
      playing = true;
    }
  }
}

const P5 = new p5(sketchFn);
