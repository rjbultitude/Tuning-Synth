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
} from './audio-controllers';
import {
  setUpGrainControl,
  drawFreqs,
  updateSliderVals,
  setSpectrum,
} from './visual-controllers';
import { createTuningSysNotes } from './freqi-freqs';
import { setupSlider } from './range-slider';

const sketchFn = (p5Sketch) => {
  const fftResolution = 512;
  const config = {
    playing: false,
    fft: null,
    osc: null,
    startFreq: 400,
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
  // Form controls
  const waveControls = document.audioControls.waveType;
  const grainControl = document.visualControls.grainSize;
  const spectrumControlLow = document.visualControls.freqRangeLow;
  const spectrumControlHigh = document.visualControls.freqRangeHigh;
  const pitchControl = document.getElementById('freqPitch');
  const sliderTextNode = document.getElementById('rangeValueText');
  const gainTextNode = document.getElementById('gainValueText');
  const rootNoteTextNode = document.getElementById('rootNoteText');

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialWaveType(waveControls);
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
      togglePlay(config, p5Sketch);
    });
    setupWaveControls(waveControls, config);
    setupPitchControls(pitchControl, config, rootNoteTextNode);
    setUpGrainControl(grainControl, config, gainTextNode);
    setupSlider(
      {
        spectrumControlLow,
        spectrumControlHigh,
      },
      config,
      sliderTextNode,
      updateSliderVals
    );
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
