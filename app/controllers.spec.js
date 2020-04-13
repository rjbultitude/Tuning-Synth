import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import jsdom from 'jsdom';

chai.use(sinonChai);

import {
  changeWave,
  isMouseInCanvas,
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  constrainAndPlay,
  drawFreqs,
} from './controllers.js';

describe('change wave', function() {
  this.beforeEach(function() {
    this.config = {
      playing: false,
      fft: null,
      osc: {
        setType: function(waveType) {
          return waveType;
        },
      },
      grainSize: 10,
      mouseInCanvas: false,
    };
    this.setTypeSpy = sinon.spy(this.config.osc, 'setType');
  });
  it('should return the first argument', function() {
    expect(changeWave('sawtooth', this.config)).to.equal('sawtooth');
  });
  it('should call the setType method', function() {
    changeWave('sawtooth', this.config);
    expect(this.setTypeSpy).calledOnce;
  });
});

describe('isMouseInCanvas', function() {
  this.beforeEach(function() {
    this.p5SketchInRange = {
      mouseY: 100,
      mouseX: 200,
      height: 600,
      width: 1200,
    };
    this.p5SketchOutOfRangeNeg = {
      mouseY: -100,
      mouseX: 200,
      height: 600,
      width: 1200,
    };
    this.p5SketchOutOfRange = {
      mouseY: 700,
      mouseX: 200,
      height: 600,
      width: 1200,
    };
  });
  it('should return true if Y is less than height and greater than zero', function() {
    expect(isMouseInCanvas(this.p5SketchInRange)).to.be.true;
  });
  it('should return false if Y is less than height and less than zero', function() {
    expect(isMouseInCanvas(this.p5SketchOutOfRangeNeg)).to.be.false;
  });
  it('should return false if Y is greater than height and greater than zero', function() {
    expect(isMouseInCanvas(this.p5SketchOutOfRange)).to.be.false;
  });
});

describe('toggle play', function() {
  this.beforeEach(function() {
    this.configPlaying = {
      playing: true,
      osc: {
        start: function() {
          return true;
        },
        stop: function() {
          return true;
        },
      },
    };
    this.configStopped = {
      playing: false,
      osc: {
        start: function() {
          return true;
        },
        stop: function() {
          return true;
        },
      },
    };
    this.startSpy = sinon.spy(this.configStopped.osc, 'start');
    this.stopSpy = sinon.spy(this.configPlaying.osc, 'stop');
  });
  this.afterEach(function() {
    sinon.restore();
  });
  it('should set playing to false if playing is true', function() {
    expect(togglePlay(this.configPlaying).playing).to.be.false;
  });
  it('should set playing to true if playing is false', function() {
    expect(togglePlay(this.configStopped).playing).to.be.true;
  });
  it('should call play method if playing is false', function() {
    togglePlay(this.configStopped);
    expect(this.startSpy).calledOnce;
  });
  it('should call stop method if playing is true', function() {
    togglePlay(this.configPlaying);
    expect(this.stopSpy).calledOnce;
  });
});

describe('get Initial Wave Type', function() {
  this.beforeEach(function() {
    this.waveControls = {
      value: 'sawTooth',
    };
  });
  it('should return "sine" when no argument is passed', function() {
    expect(getInitialWaveType()).to.equal('sine');
  });
  it('should return waveControls value when waveControls argument is passed', function() {
    expect(getInitialWaveType(this.waveControls)).to.equal('sawTooth');
  });
});

describe('setup Wave Controls', function() {
  this.beforeEach(function() {
    this.config = {};
    this.DomNode = function DomNode() {
      this.addEventListener = function() {
        return this;
      };
      this.value = 'sawtooth';
    };
    this.waveControlOne = new this.DomNode();
    this.waveControls = [this.waveControlOne];
    console.log('this.waveControls', this.waveControls);
    this.addEventSpy = sinon.spy(this.waveControlOne, 'addEventListener');
  });
  this.afterEach(function() {
    sinon.restore();
  });
  it('should have called changeWave on each item in waveControls array', function() {
    setupWaveControls(this.waveControls, this.config);
    expect(this.addEventSpy).calledOnce;
  });
});
