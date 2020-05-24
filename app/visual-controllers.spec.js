import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  setUpGrainControl,
  updateSliderVals,
  setSpectrum,
  drawFreqs,
} from './visual-controllers.js';

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

describe('set Spectrum', function() {
  this.beforeAll(function() {
    this.config = {
      fft: {
        analyze: function() {
          return [0, 1, 2, 3];
        }
      },
      spectrum: [],
      slider1: 1,
      slider2: 3
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
