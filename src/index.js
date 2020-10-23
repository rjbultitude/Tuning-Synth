import p5 from 'p5';
import 'p5/lib/addons/p5.sound';
import freqi from 'freqi';
import { writeFreqiControls } from './audio-controllers/freqi-controls';
import './global.css';
import {
  togglePlay,
  setupPlayModeControls,
  setupWaveControls,
  createTuningSystems,
  setupPitchControls,
} from './audio-controllers/audio-controllers';
import {
  setUpGrainControl,
  drawFreqs,
  updateZoomUI,
  setSpectrum,
} from './visual-controllers/visual-controllers';
import { createTuningSysNotes } from './freqi-freqs/freqi-freqs';
import { setupSpectrumZoom } from './visual-controllers/range-slider';
import { setQwertyEvents } from './keyboard/qwerty-keyboard';
import { createKeyboard } from './keyboard/keyboard';
import { getDOMEls } from './utils/dom-els';
import {
  updateAudioOutput,
  getInitialSelectVal,
  updateBody,
} from './utils/utils';
import { ONESHOT, SUSTAIN, SINE } from './utils/constants';
const {
  pageWrapper,
  visualControls,
  grainControl,
  playModeControl,
  waveControl,
  pitchControl,
  rootNoteTextNode,
  sliders,
  sliderTextNode,
} = getDOMEls();

const modes = freqi.getModes();

const sketchFn = (p5Sketch) => {
  const fftResolution = 512;
  const config = {
    playing: false,
    fft: null,
    osc: null,
    startFreq: 440,
    currentFreq: 440,
    selectedInterval: 0,
    intervalsRange: {
      lower: -12,
      upper: 12,
    },
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
    playMode: ONESHOT,
  };

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialSelectVal(waveControl, SINE);
    const initialPlayModeType = getInitialSelectVal(playModeControl, SUSTAIN);
    config.playMode = initialPlayModeType;
    config.osc = new p5.Oscillator(initialWaveType);
    config.osc.amp(0.2);
    config.fft = new p5.FFT(0, config.numFreqBands);
    // Dynamic controls creation
    createTuningSysNotes(config, modes);
    createTuningSystems(config);
    writeFreqiControls(config, updateAudioOutput);
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
    setupPlayModeControls(config, playModeControl);
    setupPitchControls(
      config,
      pitchControl,
      rootNoteTextNode,
      updateAudioOutput
    );
    setUpGrainControl(config, grainControl);
    setupSpectrumZoom(config, sliders, sliderTextNode, updateZoomUI);
    setQwertyEvents(config, updateAudioOutput);
    const keyboard = createKeyboard(config, updateAudioOutput);
    pageWrapper.insertBefore(keyboard, visualControls);
    updateBody(config.playing);
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
