import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  setUpGrainControl,
  createIdleStateArr,
  resetIdleStateArray,
  updateZoomUI,
  setSpectrum,
  drawFreqs,
} from './visual-controllers.js';

import { IDLE_STATE_ARR_DENOMINATOR } from '../utils/constants';

describe('createIdleStateArr', function() {
  before(function() {
    this.config = {
      idleStateArr: [],
      numFreqBands: 80
    };
  });
  it('should create idleString array of length numFreqbands / IDLE_STATE_ARR_DENOMINATOR', function() {
    expect(createIdleStateArr(this.config).idleStateArr.length).to.equal(10);
  });
  it('idleString array items should be ascending number starting with zero', function() {
    expect(createIdleStateArr(this.config).idleStateArr[0]).to.equal(0);
    expect(createIdleStateArr(this.config).idleStateArr[1]).to.equal(1);
  });
});

describe('resetIdleStateArray', function() {
  before(function() {
    this.config = {
      idleStateArr: [3.24, 7.19],
      numFreqBands: 80
    };
  });
  it('should reset values of idleStateArr to ascending number starting with zero', function() {
    expect(resetIdleStateArray(this.config).idleStateArr[0]).to.equal(0);
    expect(resetIdleStateArray(this.config).idleStateArr[1]).to.equal(1);
  });
});

describe('setupGrainControl', function () {
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
    setUpGrainControl(this.config, this.grainControl);
    expect(this.addEventSpy).calledOnce;
  });
});

describe('updateZoomUI', function () {
  this.beforeAll(function () {
    this.slidervals = {
      sliderLow: 10,
      sliderHigh: 20,
    };
    this.config = {
      sliders: {
        one: null,
        two: null,
      },
    };
    this.textNode = {
      innerText: '',
    };
  });
  it('should set config.slider.one value using to sliderVals.sliderLow', function () {
    expect(
      updateZoomUI(this.config, this.slidervals, this.textNode).sliders.one
    ).to.equal(10);
  });
  it('should set config.slider.two value using to sliderVals.sliderHigh', function () {
    expect(
      updateZoomUI(this.config, this.slidervals, this.textNode).sliders.two
    ).to.equal(20);
  });
});

describe('set Spectrum', function () {
  this.beforeAll(function () {
    this.config = {
      fft: {
        analyze: function () {
          return [0, 1, 2, 3];
        },
      },
      spectrum: [],
      sliders: {
        one: 1,
        two: 3,
      },
    };
  });
  it('should set the spectrum array prop of config using slice values', function () {
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
      spectrum: [0, 1, 2],
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
