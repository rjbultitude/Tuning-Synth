import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  changeWave,
  togglePlay,
  constrainAndPlay,
  getInitialWaveType,
  setupWaveControls,
} from './audio-controllers.js';

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
