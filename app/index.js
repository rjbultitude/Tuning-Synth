import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';

const sketchFn = (p5Sketch) => {
  let sound;
  let fft;
  const spectrumRange = 1000;
  p5Sketch.preload = function preload() {
    sound = p5Sketch.loadSound('../audio/Forbidden.mp3');
  }

  p5Sketch.setup = function setup() {
    let cnv = p5Sketch.createCanvas(1920,1080);
    cnv.parent('wrapper');
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT();
    sound.amp(0.2);
  }

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);

    let spectrum = fft.analyze();
    p5Sketch.noStroke();
    for (let i = 0; i< spectrum.length; i++){
      let r = p5Sketch.map(i, 0, spectrum.length, 50, 255);
      let b = p5Sketch.map(i, 0, spectrum.length, 255, 50);
      let x = p5Sketch.map(i, 0, spectrum.length, p5Sketch.width, 0);
      let y = p5Sketch.map(spectrum[i], 0, 255, p5Sketch.height, 0);
      p5Sketch.fill(r, 50, b);
      p5Sketch.ellipse(x, y, 34);
    }

  }

  function togglePlay() {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }
}

const P5 = new p5(sketchFn);
