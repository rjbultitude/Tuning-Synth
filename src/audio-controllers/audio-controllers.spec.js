import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import {
  createTuningSystems,
  getVolForWaveType,
  changeWave,
  togglePlay,
  constrainAndPlay,
  getInitialWaveType,
  setupWaveControls,
} from './audio-controllers.js';

const document = {
  visualControls: {
    grainSize: 2,
    freqRangeLow: 100,
    freqRangeHigh: 200
  },
  audioControls: {
    waveType: 'sine'
  },
  getElementById: function(str) {
    return str;
  }
}

const DOMEls = {
  grainControl: document.visualControls.grainSize,
  waveControls: document.audioControls.waveType,
  pitchControl: document.getElementById('freqPitch'),
  rootNoteTextNode: document.getElementById('rootNoteText'),
  sliders: {
    spectrumControlLow: document.visualControls.freqRangeLow,
    spectrumControlHigh: document.visualControls.freqRangeHigh,
  },
  sliderTextNode: document.getElementById('rangeValueText'),
  grainTextNode: document.getElementById('grainValueText'),
  freqTextNode: document.getElementById('audioOutputFreq'),
  statusTextNode: document.getElementById('audioOutputStatus'),
}

describe('createTuningSystems', function() {
  beforeEach(function() {
    this.config = {
      tuningSystems: null,
    }
  });
  it('should add a Map to config', function () {
    const tuningSys = createTuningSystems(this.config).tuningSystems;
    expect(tuningSys instanceof Map).to.be.true;
  });
  it('should add a Map to config with key "eqTemp"', function () {
    expect(createTuningSystems(this.config).tuningSystems.has('eqTemp')).to.be.true;
  });
});

describe('getVolForWaveType', function() {
  it('should return a number even if no argument is passed', function() {
    expect(getVolForWaveType()).to.be.a('number');
  });
  it('should return 0.08 if argument is sawtooth', function() {
    expect(getVolForWaveType('sawtooth')).to.equal(0.08);
  });
});

describe('change wave', function () {
  this.beforeEach(function () {
    this.config = {
      playing: false,
      fft: null,
      osc: {
        setType: function (waveType) {
          return waveType;
        },
      },
      grainSize: 10,
      mouseInCanvas: false,
    };
    this.setTypeSpy = sinon.spy(this.config.osc, 'setType');
  });
  it('should return the first argument', function () {
    expect(changeWave('sawtooth', this.config)).to.equal('sawtooth');
  });
  it('should call the setType method', function () {
    changeWave('sawtooth', this.config);
    expect(this.setTypeSpy).calledOnce;
  });
});

describe('toggle play', function () {
  this.beforeEach(function () {
    this.configPlaying = {
      playing: true,
      osc: {
        start: function () {},
        stop: function () {},
      },
    };
    this.configStopped = {
      playing: false,
      osc: {
        start: function () {},
        stop: function () {},
      },
    };
    this.updateAudioOutput = () => {};
    this.startSpy = sinon.spy(this.configStopped.osc, 'start');
    this.stopSpy = sinon.spy(this.configPlaying.osc, 'stop');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should set playing to false if playing is true', function () {
    expect(togglePlay({ config: this.configPlaying, updateAudioOutput: this.updateAudioOutput }).playing).to.be.false;
  });
  it('should set playing to true if playing is false', function () {
    expect(togglePlay({ config: this.configStopped, updateAudioOutput: this.updateAudioOutput }).playing).to.be.true;
  });
  it('should call play method if playing is false', function () {
    togglePlay({config: this.configStopped, updateAudioOutput: this.updateAudioOutput });
    expect(this.startSpy).calledOnce;
  });
  it('should call stop method if playing is true', function () {
    togglePlay({ config: this.configPlaying, updateAudioOutput: this.updateAudioOutput });
    expect(this.stopSpy).calledOnce;
  });
});

describe('constrain And Play', function () {
  this.beforeEach(function () {
    this.p5SketchInRange = {
      mouseY: 100,
      mouseX: 200,
      height: 600,
      width: 1200,
      constrain: function () {
        return 440;
      },
      map: function () {
        return true;
      },
    };
    this.p5SketchOutOfRange = {
      mouseY: -100,
      mouseX: 200,
      height: 600,
      width: 1200,
      constrain: function () {
        return 440;
      },
      map: function () {
        return true;
      },
    };
    this.configPlaying = {
      osc: {
        freq: function (freq) {
          return freq;
        },
        frequency: null,
      },
      playing: true,
    };
    this.configStopped = {
      osc: {
        freq: function (freq) {},
      },
      playing: false,
    };
    this.freqSpyPlaying = sinon.spy(this.configPlaying.osc, 'freq');
    this.freqSpyStopped = sinon.spy(this.configStopped.osc, 'freq');
  });
  it('should call osc.freq if playing and mouse is in canvas', function () {
    constrainAndPlay(this.p5SketchInRange, this.configPlaying);
    expect(this.freqSpyPlaying).calledOnce;
  });
  it('should not call osc.freq if playing is true but mouse is not in canvas', function () {
    constrainAndPlay(this.p5SketchOutOfRange, this.configPlaying);
    expect(this.freqSpyStopped).to.not.have.been.called;
  });
  it('should not call osc.freq if playing is false and mouse is in canvas', function () {
    constrainAndPlay(this.p5SketchInRange, this.configStopped);
    expect(this.freqSpyStopped).to.not.have.been.called;
  });
  it('should return osc.freq argument if playing is true and mouse is in canvas', function () {
    constrainAndPlay(this.p5SketchInRange, this.configPlaying);
    expect(this.freqSpyPlaying).to.have.been.calledWith(440);
  });
});

describe('setup Wave Controls', function () {
  this.beforeEach(function () {
    this.config = {};
    this.DomNode = function DomNode() {
      this.addEventListener = function () {
        return this;
      };
      this.value = 'sawtooth';
    };
    this.waveControl = new this.DomNode();
    this.addEventSpy = sinon.spy(this.waveControl, 'addEventListener');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should called changeWave when changed', function () {
    setupWaveControls(this.config, this.waveControl);
    expect(this.addEventSpy).calledOnce;
  });
});
