import chai, { config, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import * as visCntrl from './visual-controllers.js';

describe('shapeControlCB', function() {
  beforeEach(function() {
    this.config = {
      shape: 'rect'
    };
    this.event = {
      target: {
        value: 'ellipse'
      }
    };
  });
  it('should set shape to value of event target', function() {
    expect(visCntrl.shapeControlCB(this.event, this.config).shape).to.equal('ellipse');
  });
});

describe('setupShapeControls', function() {
  beforeEach(function() {
    this.config = {
      shape: 'rect'
    };
    this.DomNode = function DomNode() {
      this.addEventListener = function () {
        return this;
      };
      this.value = 'ellipse';
    };
    this.shapeControl = new this.DomNode();
  });
  it('should call addEventListener of shapeControl', function() {
    const addEventSpy = sinon.spy(this.shapeControl, 'addEventListener');
    visCntrl.setupShapeControls(this.config, this.shapeControl)
    expect(addEventSpy).called;
  });
});

describe('grainCtrlCB', function() {
  beforeEach(function() {
    this.config = {
      grainSize: null,
    };
    this.event = {
      target: {
        value: 12,
      }
    };
    this.el = {};
    this.CB = () => {};
  });
  it('should set grainSize to event target value', function() {
    expect(visCntrl.grainCtrlCB(this.event, this.config, this.el, this.CB).grainSize).to.equal(12);
  });
});

describe('setUpGrainControl', function () {
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
    visCntrl.setUpGrainControl(this.config, this.grainControl);
    expect(this.addEventSpy).calledOnce;
  });
});

describe('createIdleStateArr', function() {
  beforeEach(function() {
    this.config = {
      idleStateArr: [],
      numFreqBands: 80
    };
  });
  it('should create an array of numFreqBands divided by 8', function() {
    expect(visCntrl.createIdleStateArr(this.config).idleStateArr.length).to.equal(10);
  });
});

describe('resetIdleStateArray', function() {
  beforeEach(function() {
    this.config = {
      idleStateArr: [100, 50, 22]
    }
  });
  it('should set idleStateArr vals to ascending numbers starting at zero', function() {
    expect(visCntrl.resetIdleStateArray(this.config).idleStateArr[0]).to.equal(0);
    expect(visCntrl.resetIdleStateArray(this.config).idleStateArr[1]).to.equal(1);
    expect(visCntrl.resetIdleStateArray(this.config).idleStateArr[2]).to.equal(2);
  });
});

describe('updateZoomUI', function() {
  this.beforeAll(function() {
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
  it('should set config.slider.one value using to sliderVals.sliderLow', function() {
    expect(visCntrl.updateZoomUI(this.config, this.slidervals, this.textNode).sliders.one).to.equal(10);
  });
  it('should set config.slider.two value using to sliderVals.sliderHigh', function() {
    expect(visCntrl.updateZoomUI(this.config, this.slidervals, this.textNode).sliders.two).to.equal(20);
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
  it('should set the spectrum array prop of config using slice values', function() {
    expect(visCntrl.setSpectrum(this.config).spectrum).to.eql([1, 2]);
  });
});

describe('drawShape', function() {
  beforeEach(function() {
    this.configEllipse = {
      shape: 'ellipse'
    };
    this.configRect = {
      shape: 'rect'
    };
    this.argsObjEllipse = {
      config: this.configEllipse,
      p5Sketch: {
        ellipse: sinon.spy(),
        rect: sinon.spy(),
      },
      x: 10,
      y: 20,
    };
    this.argsObjRect = {
      config: this.configRect,
      p5Sketch: {
        ellipse: sinon.spy(),
        rect: sinon.spy(),
      },
      x: 10,
      y: 20,
    };
  });
  it('should call p5Sketch ellipse when config shape ellipse', function() {
    visCntrl.drawShape(this.argsObjEllipse);
    expect(this.argsObjEllipse.p5Sketch.ellipse).called;
  });
  it('should call p5Sketch rect when config shape rect', function() {
    visCntrl.drawShape(this.argsObjRect);
    expect(this.argsObjRect.p5Sketch.rect).called;
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
    visCntrl.drawFreqs(this.p5Sketch, this.config);
    expect(this.fillSpy).calledThrice;
  });
  it('should call fill once for each item in spectrum', function () {
    visCntrl.drawFreqs(this.p5Sketch, this.config);
    expect(this.ellipseSpy).calledThrice;
  });
  it('should call noStroke once', function () {
    visCntrl.drawFreqs(this.p5Sketch, this.config);
    expect(this.noStrokeSpy).calledOnce;
  });
});
