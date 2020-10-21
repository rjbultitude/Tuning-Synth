import chai, { expect } from 'chai';

import { updateUI, getDefaultIntervals, getInitialSelectVal } from './utils';

describe('updateUI', function () {
  beforeEach(function () {
    this.el = {
      innerText: '',
    }
  });
  afterEach(function () {
    this.el = null;
  });
  it('should set the innter text of element to value', function () {
    expect(updateUI('test', this.el).innerText).to.equal('test');
  });
  it('should convert a number value to a string', function () {
    const updatedEl = updateUI(10, this.el);
    expect(updatedEl.innerText).to.be.a('string');
  });
  it('should remove decimals from a number', function () {
    expect(updateUI(10.001, this.el).innerText).to.equal('10');
  });
  it('should return original element if value is neither string or number', function () {
    expect(updateUI([], this.el).innerText).to.equal('');
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
    expect(Array.isArray(getDefaultIntervals(this.config))).to.be.true;
  });
  it('should return an array of length equal to all the integers between lower and upper vals', function () {
    expect(getDefaultIntervals(this.config)).to.have.length(5);
  });
});

describe('getInitialSelectVal', function () {
  this.beforeEach(function () {
    this.el = {
      value: 'sawtooth'
    };
  });
  it('should return "sine" when default argument is "sine" but no el is passed', function () {
    expect(getInitialSelectVal(null, 'sine')).to.equal('sine');
  });
  it('should return el.value when el argument is passed', function () {
    expect(getInitialSelectVal(this.el)).to.equal('sawtooth');
  });
});
