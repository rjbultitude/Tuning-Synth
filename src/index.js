import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import { writeFreqiControls } from './freqi-controls';
import './global.css';
import {
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  createTuningSystems,
  setupPitchControls,
  updateAudioOutput,
} from './audio-controllers';
import {
  setUpGrainControl,
  drawFreqs,
  updateZoomUI,
  setSpectrum,
} from './visual-controllers';
import { createTuningSysNotes } from './freqi-freqs';
import { setupSpectrumZoom } from './range-slider';
import { getDOMEls } from './dom-els';
const {
  grainControl,
  waveControl,
  pitchControl,
  sliders,
  sliderTextNode,
} = getDOMEls();

const sketchFn = (p5Sketch) => {
  const fftResolution = 512;
  const config = {
    playing: false,
    fft: null,
    osc: null,
    startFreq: 440,
    currentFreq: 440,
    grainSize: 10,
    numFreqBands: fftResolution,
    mouseInCanvas: false,
    displaySize: {
      width: 1920,
      height: 1080,
    },
    spectrum: [],
    sliders: {
      one: 0,
      two: fftResolution,
    },
    tuningSystems: null,
    selectedTuningSys: '',
    tuningSysNotes: null,
  };

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialWaveType(waveControl);
    config.osc = new p5.Oscillator(initialWaveType);
    config.osc.amp(0.2);
    config.fft = new p5.FFT(0, config.numFreqBands);
    // Dynamic controls creation
    createTuningSysNotes(config);
    createTuningSystems(config);
    writeFreqiControls(config);
  };

  p5Sketch.setup = function setup() {
    const cnv = p5Sketch.createCanvas(
      config.displaySize.width,
      config.displaySize.height
    );
    cnv.parent('wrapper');
    cnv.mouseClicked(function () {
      togglePlay({ config, p5Sketch, updateAudioOutput });
    });
    setupWaveControls(config, waveControl);
    setupPitchControls(config, pitchControl);
    setUpGrainControl(config, grainControl);
    setupSpectrumZoom(config, sliders, sliderTextNode, updateZoomUI);
  };

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);
    // constrainAndPlay(p5Sketch, config);
    setSpectrum(config);
    drawFreqs(p5Sketch, config);
  };
};

const app = new p5(sketchFn);
export default app;
