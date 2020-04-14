import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import './global.css';
import {
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  setUpModulatorControl,
  constrainAndPlay,
  drawFreqs,
  updateSliderVals,
  setSpectrum,
} from './controllers';
import { setupSlider } from './range-slider';

const sketchFn = (p5Sketch) => {
  const config = {
    playing: false,
    fft: null,
    osc: null,
    mod: null,
    modFreq: 440,
    modFreqSwing: 10,
    grainSize: 10,
    mouseInCanvas: false,
    spectrum: [],
    slider1: 0,
    slider2: 1024,
  };
  // Form controls
  const waveControls = document.controls.wave;
  const grainControl = document.controls.grainSize;
  const modulatorControl = document.controls.modulator;
  const spectrumControlLow = document.controls.freqRangeLow;
  const spectrumControlHigh = document.controls.freqRangeHigh;

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialWaveType(waveControls);
    config.osc = new p5.Oscillator(initialWaveType);
    config.mod = new p5.Oscillator('sawtooth');
    config.osc.amp(0.2);
    config.mod.amp(0.05);
    config.fft = new p5.FFT();
  };

  p5Sketch.setup = function setup() {
    const cnv = p5Sketch.createCanvas(1920, 1080);
    cnv.parent('wrapper');
    cnv.mouseClicked(function () {
      togglePlay(config, p5Sketch);
    });
    setupWaveControls(waveControls, config);
    setUpGrainControl(grainControl, config);
    setUpModulatorControl(modulatorControl, config);
    setupSlider(
      [spectrumControlLow, spectrumControlHigh],
      config,
      updateSliderVals
    );
  };

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);
    constrainAndPlay(p5Sketch, config);
    setSpectrum(config);
    drawFreqs(p5Sketch, config);
  };
};

const app = new p5(sketchFn);
export default app;
