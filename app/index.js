import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';
import {
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  constrainAndPlay,
  drawFreqs,
} from './controllers.js';

const sketchFn = p5Sketch => {
  const config = {
    playing: false,
    fft: null,
    osc: null,
    grainSize: 10,
    mouseInCanvas: false,
  };
  // Form controls
  const waveControls = document.controls.wave;
  const grainControl = document.controls.grainSize;

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialWaveType(waveControls);
    config.osc = new p5.Oscillator(initialWaveType);
    config.osc.amp(0.2);
    config.fft = new p5.FFT();
  };

  p5Sketch.setup = function setup() {
    const cnv = p5Sketch.createCanvas(1920, 1080);
    cnv.parent('wrapper');
    cnv.mouseClicked(function() {
      togglePlay(config);
    });
    setupWaveControls(waveControls, config);
    setUpGrainControl(grainControl, config);
  };

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);
    constrainAndPlay(p5Sketch, config);
    drawFreqs(p5Sketch, config);
  };
};

const app = new p5(sketchFn);
export default app;
