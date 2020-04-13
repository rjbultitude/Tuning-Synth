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

describe('setup Grain Controls', function() {
  this.beforeEach(function() {
    this.config = {};
    this.DomNode = function DomNode() {
      this.addEventListener = function() {
        return this;
      };
      this.value = '10';
    };
    this.grainControl = new this.DomNode();
    this.addEventSpy = sinon.spy(this.grainControl, 'addEventListener');
  });
  this.afterEach(function() {
    sinon.restore();
  });
  it('should have called changeWave on each item in waveControls array', function() {
    setUpGrainControl(this.grainControl, this.config);
    expect(this.addEventSpy).calledOnce;
  });
});

describe('constrain And Play', function() {
  this.beforeEach(function() {
    this.p5SketchInRange = {
      mouseY: 100,
      mouseX: 200,
      height: 600,
      width: 1200,
      constrain: function() {
        return 440;
      },
      map: function() {
        return true;
      },
    };
    this.p5SketchOutOfRange = {
      mouseY: -100,
      mouseX: 200,
      height: 600,
      width: 1200,
      constrain: function() {
        return 440;
      },
      map: function() {
        return true;
      },
    };
    this.configPlaying = {
      osc: {
        freq: function(freq) {
          this.frequency = freq;
          return this;
        },
        frequency: null,
      },
      playing: true,
    };
    this.configStopped = {
      osc: {
        freq: function(freq) {
          this.frequency = freq;
          return this;
        },
        frequency: null,
      },
      playing: false,
    };
  });
  it('should set osc frequency if playing and mouse is in canvas', function() {
    expect(
      constrainAndPlay(this.p5SketchInRange, this.configPlaying).osc.frequency
    ).to.equal(440);
  });
  it('should not set osc frequency if playing is true but mouse is not in canvas', function() {
    expect(
      constrainAndPlay(this.p5SketchOutOfRange, this.configPlaying).osc
        .frequency
    ).to.be.null;
  });
  it('should not set osc frequency if playing is false and mouse is in canvas', function() {
    expect(
      constrainAndPlay(this.p5SketchInRange, this.configStopped).osc.frequency
    ).to.be.null;
  });
});

describe('draw freqs', function() {
  this.beforeEach(function() {
    this.p5Sketch = {
      noStroke: function() {
        return true;
      },
      map: function() {
        return true;
      },
      fill: function() {
        return true;
      },
      ellipse: function() {
        return true;
      },
    };
    this.config = {
      fft: {
        analyze: function() {
          return [{}, {}, {}];
        },
      },
    };
    this.fillSpy = sinon.spy(this.p5Sketch, 'fill');
    this.ellipseSpy = sinon.spy(this.p5Sketch, 'ellipse');
    this.noStrokeSpy = sinon.spy(this.p5Sketch, 'noStroke');
  });
  this.afterEach(function() {
    sinon.restore();
  });
  it('should call fill once for each item in spectrum', function() {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.fillSpy).calledThrice;
  });
  it('should call fill once for each item in spectrum', function() {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.ellipseSpy).calledThrice;
  });
  it('should call noStroke once', function() {
    drawFreqs(this.p5Sketch, this.config);
    expect(this.noStrokeSpy).calledOnce;
  });
});
