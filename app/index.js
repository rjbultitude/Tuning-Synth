import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';

const sketchFn = (p5Sketch) => {
  let sound;
  let fft;
  p5Sketch.preload = function preload() {
    sound = p5Sketch.loadSound('../audio/My Empathy Creaks.mp3');
    console.log('sound', sound);
  }

  p5Sketch.setup = function setup() {
    let cnv = p5Sketch.createCanvas(100,100);
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT();
    console.log('fft', fft);
    sound.amp(0.2);
  }

  p5Sketch.draw = function draw() {
    p5Sketch.background(220);

    let spectrum = fft.analyze();
    p5Sketch.noStroke();
    p5Sketch.fill(255, 0, 255);
    for (let i = 0; i< spectrum.length; i++){
      let x = p5Sketch.map(i, 0, spectrum.length, 0, p5Sketch.width);
      let h = -p5Sketch.height + p5Sketch.map(spectrum[i], 0, 255, p5Sketch.height, 0);
      p5Sketch.rect(x, p5Sketch.height, p5Sketch.width / spectrum.length, h );
    }

    let waveform = fft.waveform();
    p5Sketch.noFill();
    p5Sketch.beginShape();
    p5Sketch.stroke(20);
    for (let i = 0; i < waveform.length; i++){
      let x = p5Sketch.map(i, 0, waveform.length, 0, p5Sketch.width);
      let y = p5Sketch.map( waveform[i], -1, 1, 0, p5Sketch.height);
      p5Sketch.vertex(x,y);
    }
    p5Sketch.endShape();

    p5Sketch.text('tap to play', 20, 20);
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
