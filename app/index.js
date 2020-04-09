import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';

const sketchFn = (p5Sketch) => {
  let sound;
  let freq;
  let playing;
  let fft;
  const controls = document.waveControls.wave;
  let waveType = controls.value || 'sine';
  let osc = new p5.Oscillator(waveType);


  function changeWave() {
    osc.setType(waveType);
  }

  function setupControls() {
    for (let index = 0; index < controls.length; index++) {
      controls[index].addEventListener('change', function() {
        waveType = this.value;

        changeWave();
      });
    }
  }

  p5Sketch.preload = function preload() {
    // sound = p5Sketch.loadSound('../audio/Forbidden.mp3');
    osc = new p5.Oscillator(waveType);
  }

  p5Sketch.setup = function setup() {
    let cnv = p5Sketch.createCanvas(1920,1080);
    cnv.parent('wrapper');
    cnv.mouseClicked(togglePlay);
    setupControls();
    fft = new p5.FFT();
    // sound.amp(0.2);
    osc.amp(0.2);
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
      p5Sketch.ellipse(x, y, 18);
    }

  }

  function togglePlay() {
    if (playing) {
      // sound.pause();
      osc.stop();
      playing = false;
    } else {
      // sound.loop();
      osc.start();
      playing = true;
    }
  }
}

const P5 = new p5(sketchFn);
