const p5 = require('p5');
window.p5 = p5;
require('p5/lib/addons/p5.sound');
import freqi from 'freqi';
import { writeFreqiControls } from './audio-controllers/freqi-controls';
import './global.css';
import {
  setupPlayModeControls,
  setupWaveControls,
  createTuningSystems,
  setupPitchControls,
} from './audio-controllers/audio-controllers';
import {
  createIdleStateArr,
  resetIdleStateArray,
  setupShapeControls,
  setUpGrainControl,
  drawFreqs,
  drawIdleState,
  updateZoomUI,
  setSpectrum,
} from './visual-controllers/visual-controllers';
import { createTuningSysNotes } from './freqi-freqs/freqi-freqs';
import { setupSpectrumZoom } from './visual-controllers/range-slider';
import {
  drawGrid,
  setupGridControl,
  setGridMediaListener,
} from './visual-controllers/grid';
import { setQwertyEvents } from './keyboard/qwerty-keyboard';
import {
  createKeyboard,
  highlightOctaves,
  stopAndResetKbd,
} from './keyboard/on-screen-keyboard';
import { initMIDIAccess } from './keyboard/midi-keyboard';
import { getDOMEls } from './utils/dom-els';
import {
  getInitialSelectVal,
  updateBody,
  updateInstructions,
  updateUI,
  getFormInputVal,
  getGridLinesPosArr,
} from './utils/utils';
import {
  ONESHOT,
  SUSTAIN,
  SINE,
  KEYBOARD_OCT_STYLE,
  STATUS_STOPPED,
  SHAPES,
} from './utils/constants';
const {
  pageWrapper,
  visualControls,
  gridControl,
  shapeControl,
  grainControl,
  grainTextNode,
  playModeControl,
  waveControl,
  pitchControl,
  sliders,
  sliderTextNode,
} = getDOMEls();

const sliderVals = {
  sliderLow: getFormInputVal(sliders.spectrumControlLow),
  sliderHigh: getFormInputVal(sliders.spectrumControlHigh),
};
const grainSizeVal = getFormInputVal(grainControl);

const sketchFn = (p5Sketch) => {
  const fftResolution = 1024;
  // TODO Needs type definitions
  const config = {
    playing: false,
    counter: 0,
    fft: null,
    osc: null,
    startFreq: 440,
    currentFreq: 440,
    selectedInterval: 0,
    intervalsRange: {
      lower: -12,
      upper: 12,
    },
    grainSize: grainSizeVal,
    radian: 0.2,
    shape: SHAPES.ELLIPSE,
    numFreqBands: fftResolution,
    mouseInCanvas: false,
    displaySize: {
      width: 1920,
      height: 1080,
    },
    spectrum: [],
    idleStateArr: [],
    sliders: {
      one: 0,
      two: fftResolution,
    },
    keyboardButtons: null,
    keyBoardButtonStyles: [],
    currKbdBtnID: null,
    prevKbdBtnID: null,
    MIDINotSupported: false,
    tuningSystems: null,
    freqiTuningSysMeta: freqi.tuningSystemsData,
    freqiModes: freqi.freqiModes,
    selectedTuningSys: '',
    tuningSysNotes: null,
    playMode: ONESHOT,
    gridVisible: false,
    gridResolution: 20,
    gridLinesPosArr: null,
  };

  p5Sketch.preload = function preload() {
    const initialWaveType = getInitialSelectVal(waveControl, SINE);
    const initialPlayModeType = getInitialSelectVal(playModeControl, SUSTAIN);
    config.playMode = initialPlayModeType;
    config.osc = new p5.Oscillator(initialWaveType);
    config.osc.amp(0.2);
    config.fft = new p5.FFT(0, config.numFreqBands);
  };

  p5Sketch.setup = function setup() {
    // p5Sketch.frameRate(1);
    const cnv = p5Sketch.createCanvas(
      config.displaySize.width,
      config.displaySize.height
    );
    cnv.parent('wrapper');
    cnv.mouseClicked(function () {
      stopAndResetKbd(config);
    });
    createIdleStateArr(config);
    setupWaveControls(config, waveControl);
    setupPlayModeControls(config, playModeControl);
    // Pitch / Root note / start freq
    setupPitchControls(config, pitchControl);
    // UI, Grain size
    setUpGrainControl(config, grainControl, grainTextNode);
    updateUI(grainSizeVal, grainTextNode);
    // UI, Zoom
    setupSpectrumZoom(config, sliders, sliderTextNode, updateZoomUI);
    updateZoomUI(config, sliderVals, sliderTextNode);
    // Tuning System controls. Dynamic creation
    createTuningSysNotes(config);
    createTuningSystems(config);
    writeFreqiControls(config);
    // Keyboard. Dynamic creation
    setQwertyEvents(config);
    const keyboard = createKeyboard(config, p5Sketch);
    pageWrapper.insertBefore(keyboard, visualControls);
    config.keyboardButtons = document.querySelectorAll('.keyboard__button');
    initMIDIAccess(config);
    updateInstructions(config);
    highlightOctaves({ config, KEYBOARD_OCT_STYLE });
    // Global status
    updateBody(config.playing, STATUS_STOPPED);
    // Shape
    setupShapeControls(config, shapeControl);
    // Grid
    getGridLinesPosArr(config);
    setupGridControl(config, gridControl);
    setGridMediaListener(config, gridControl);
  };

  p5Sketch.draw = function draw() {
    p5Sketch.background(0, 0, 0);
    if (config.playing) {
      setSpectrum(config);
      drawFreqs(p5Sketch, config);
      // Reset the Idlestate
      resetIdleStateArray(config);
      config.counter = 0;
    } else {
      drawIdleState(p5Sketch, config);
      config.counter += 1;
    }
    p5Sketch.stroke(255);
    drawGrid(config, p5Sketch);
  };
};

const app = new p5(sketchFn);
export default app;
