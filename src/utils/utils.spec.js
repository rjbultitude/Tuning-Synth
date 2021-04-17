import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import { SUSTAIN } from './constants';
import * as utils from './utils';
import { SINE, SAWTOOTH } from './constants';

describe('getFormInputVal', function () {
  it('should return value prop of el passed in', function () {
    const el = {
      value: 'test',
    };
    expect(utils.getFormInputVal(el)).to.equal('test');
  });
});

describe('updateBody', function () {
  it('returns empty string when playing arg is truthy ', function () {
    expect(utils.updateBody(true, 'test')).to.equal('');
  });
  it('returns a string when playing arg is false ', function () {
    expect(utils.updateBody(false, 'test')).to.equal('test');
  });
});

describe('updateUI', function () {
  beforeEach(function () {
    this.el = {
      innerText: '',
    };
  });
  afterEach(function () {
    this.el = null;
  });
  it('should set the innter text of element to value', function () {
    expect(utils.updateUI('test', this.el).innerText).to.equal('test');
  });
  it('should convert a number value to a string', function () {
    const updatedEl = utils.updateUI(10, this.el);
    expect(updatedEl.innerText).to.be.a('string');
  });
  it('should append unit arg to string when value arg is a number', function () {
    const unit = 'Hz';
    expect(utils.updateUI(10, this.el, unit).innerText).to.equal(`10 ${unit}`);
  });
  it('should remove decimals from a number', function () {
    expect(utils.updateUI(10.001, this.el, 'Hz').innerText).to.equal('10 Hz');
  });
  it('should return original element if value is neither string or number', function () {
    expect(utils.updateUI([], this.el).innerText).to.equal('');
  });
});

describe('updateAudioOutput', function () {
  beforeEach(function () {
    this.config = {
      playing: false,
      playMode: SUSTAIN,
    };
    this.el = {
      innerText: '',
    };
    this.updateUISpy = sinon.spy();
    this.updateBodySpy = sinon.spy();
  });
  it('should call updateUI when playing is false', function () {
    utils.updateAudioOutput(this.config, this.updateUISpy, this.updateBodySpy);
    expect(this.updateUISpy).to.have.been.called;
  });
  it('should call updateUI when playing is false', function () {
    utils.updateAudioOutput(this.config, this.updateUISpy, this.updateBodySpy);
    expect(this.updateUISpy).to.have.been.called;
  });
});

describe('getDefaultIntervals', function () {
  beforeEach(function () {
    this.config = {
      intervalsRange: {
        lower: -2,
        upper: 2,
      },
    };
  });
  it('should return an array when passed vaild config', function () {
    expect(Array.isArray(utils.getDefaultIntervals(this.config))).to.be.true;
  });
  it('should return an array of length equal to all the integers between lower and upper vals', function () {
    expect(utils.getDefaultIntervals(this.config)).to.have.length(5);
  });
});

describe('getInitialSelectVal', function () {
  this.beforeEach(function () {
    this.el = {
      value: SAWTOOTH,
    };
  });
  it('should return "sine" when default argument is "sine" but no el is passed', function () {
    expect(utils.getInitialSelectVal(null, SINE)).to.equal(SINE);
  });
  it('should return el.value when el argument is passed', function () {
    expect(utils.getInitialSelectVal(this.el)).to.equal(SAWTOOTH);
  });
});

describe('getGridLinesPosArr', function () {
  beforeEach(function () {
    this.config = {
      gridResolution: 10,
      displaySize: {
        width: 100,
      },
    };
  });
  it('should return an array', function () {
    const result = utils.getGridLinesPosArr(this.config);
    expect(Array.isArray(result)).to.be.true;
  });
  it('should return array of length gridResolution', function () {
    const result = utils.getGridLinesPosArr(this.config);
    expect(result.length).to.equal(this.config.gridResolution);
  });
});
