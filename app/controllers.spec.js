import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  changeWave,
  isMouseInCanvas,
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  constrainAndPlay,
  updateSliderVals,
  setSpectrum,
  drawFreqs,
} from './controllers.js';

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

describe('isMouseInCanvas', function () {
  this.beforeEach(function () {
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
  it('should return true if Y is less than height and greater than zero', function () {
    expect(isMouseInCanvas(this.p5SketchInRange)).to.be.true;
  });
  it('should return false if Y is less than height and less than zero', function () {
    expect(isMouseInCanvas(this.p5SketchOutOfRangeNeg)).to.be.false;
  });
  it('should return false if Y is greater than height and greater than zero', function () {
    expect(isMouseInCanvas(this.p5SketchOutOfRange)).to.be.false;
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
    this.startSpy = sinon.spy(this.configStopped.osc, 'start');
    this.stopSpy = sinon.spy(this.configPlaying.osc, 'stop');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should set playing to false if playing is true', function () {
    expect(togglePlay(this.configPlaying).playing).to.be.false;
  });
  it('should set playing to true if playing is false', function () {
    expect(togglePlay(this.configStopped).playing).to.be.true;
  });
  it('should call play method if playing is false', function () {
    togglePlay(this.configStopped);
    expect(this.startSpy).calledOnce;
  });
  it('should call stop method if playing is true', function () {
    togglePlay(this.configPlaying);
    expect(this.stopSpy).calledOnce;
  });
});

describe('get Initial Wave Type', function () {
  this.beforeEach(function () {
    this.waveControls = {
      value: 'sawTooth',
    };
  });
  it('should return "sine" when no argument is passed', function () {
    expect(getInitialWaveType()).to.equal('sine');
  });
  it('should return waveControls value when waveControls argument is passed', function () {
    expect(getInitialWaveType(this.waveControls)).to.equal('sawTooth');
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
    this.waveControlOne = new this.DomNode();
    this.waveControls = [this.waveControlOne];
    this.addEventSpy = sinon.spy(this.waveControlOne, 'addEventListener');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should have called changeWave on each item in waveControls array', function () {
    setupWaveControls(this.waveControls, this.config);
    expect(this.addEventSpy).calledOnce;
  });
});

describe('setup Grain Controls', function () {
  this.beforeEach(function () {
    this.config = {};
    this.DomNode = function DomNode() {
      this.addEventListener = function () {
        return this;
      };
      this.value = '10';
    };
    this.grainControl = new this.DomNode();
    this.addEventSpy = sinon.spy(this.grainControl, 'addEventListener');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should have called changeWave on each item in waveControls array', function () {
    setUpGrainControl(this.grainControl, this.config);
    expect(this.addEventSpy).calledOnce;
  });
});

describe('update Slider Vals', function() {
  this.beforeAll(function() {
    this.slidervals = {
      slider1: 10,
      slider2: 20,
    }
    this.config = {
      slider1: null,
      slider2: null,
    }
  });
  it('should set config slider1 value using to sliderVals.slider1', function() {
    expect(updateSliderVals(this.slidervals, this.config).slider1).to.equal(10);
  });
  it('should set config slider2 value using to sliderVals.slider2', function() {
    expect(updateSliderVals(this.slidervals, this.config).slider2).to.equal(20);
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

describe('set Spectrum', function() {
  this.beforeAll(function() {
    this.config = {
      fft: {
        analyze: function() {
          return [0, 1, 2, 3];
        }
      },
      spectrum: [],
      spectrumLower: 1,
      spectrumUpper: 3
    }
  });
  it('should set the spectrum array prop of config using slice values', function() {
    expect(setSpectrum(this.config).spectrum).to.eql([1, 2]);
  });
});

describe('draw freqs', function () {
  this.beforeEach(function () {
    this.p5Sketch = {
      noStroke: function () {
        return true;
      },
      map: function () {
        return true;
      },
      fill: function () {
        return true;
      },
      ellipse: function () {
        return true;
      },
    };
    this.config = {
      fft: {
        analyze: function () {
          return [{}, {}, {}];
        },
      },
      spectrum: [0, 1, 2]
    };
    this.fillSpy = sinon.spy(this.p5Sketch, 'fill');
    this.ellipseSpy = sinon.spy(this.p5Sketch, 'ellipse');
    this.noStrokeSpy = sinon.spy(this.p5Sketch, 'noStroke');
  });
  this.afterEach(function () {
    sinon.restore();
  });
  it('should call fill once for each item in spectrum', function () {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.fillSpy).calledThrice;
  });
  it('should call fill once for each item in spectrum', function () {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.ellipseSpy).calledThrice;
  });
  it('should call noStroke once', function () {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.noStrokeSpy).calledOnce;
  });
});
