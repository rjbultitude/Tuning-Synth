import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import { writeFreqiControls } from './freqi-controls';
import { getSysFrequencies } from './freqi-freqs';
import './global.css';
import {
  togglePlay,
  changeTuningSys,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  constrainAndPlay,
  drawFreqs,
  updateSliderVals,
  setSpectrum,
} from './controllers';
import { setupSlider } from './range-slider';

// Freqi
const tuningSysFreqs = getSysFrequencies();
writeFreqiControls(changeTuningSys, tuningSysFreqs);

const sketchFn = (p5Sketch) => {
  const config = {
    playing: false,
    fft: null,
    osc: null,
    grainSize: 10,
    mouseInCanvas: false,
    spectrum: [],
    slider1: 0,
    slider2: 1024,
  };
  // Form controls
  const waveControls = document.audioControls.wave;
  const grainControl = document.visualControls.grainSize;
  const spectrumControlLow = document.visualControls.freqRangeLow;
  const spectrumControlHigh = document.visualControls.freqRangeHigh;

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialWaveType(waveControls);
    config.osc = new p5.Oscillator(initialWaveType);
    config.osc.amp(0.2);
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
