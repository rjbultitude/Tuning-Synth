import chai, { expect } from 'chai';
import sinon, { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import {
  setDefaultIntervals,
  createTuningSysNotes,
  setTuningSysNotes
} from './freqi-freqs';

describe('setDefaultIntervals', function() {
  beforeEach(function() {
    this.config = {
      intervalsRange: {
        lower: -2,
        upper: 2,
      }
    }
  });
  it('should return an array when passed vaild config', function() {
    expect(Array.isArray(setDefaultIntervals(this.config))).to.be.true;
  });
  it('should return an array of length equal to all the integers between lower and upper vals', function() {
    expect(setDefaultIntervals(this.config)).to.have.length(5);
  });
});

describe('createTuningSysNotes', function() {
  beforeEach(function() {
    this.config = {
      startFreq: 1,
      intervals: [0],
      intervalsRange: {
        lower: -2,
        upper: 2,
      }
    };
    this.modes = ['eqTemp'];
    this.output = {
      eqTemp: []
    }
  });
  it('should create an object with one key', function() {
    expect(Object.keys(createTuningSysNotes(this.config, this.modes).tuningSysNotes)).to.have.length(1);
  });
});
