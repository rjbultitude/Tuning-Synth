import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as freqiFreqs from '../freqi-freqs/freqi-freqs';
import * as freqiCtrls from './freqi-controls';

describe('setOscFreqToTuningSys', function() {
  beforeEach(function() {
    this.config = {
      startFreq: 0,
      currentFreq: 0,
      intervalsRange: {
        lower: 1,
        upper: 2
      },
      tuningSysNotes: {
        eqTemp: [200, 400],
      },
      selectedTuningSys: 'eqTemp',
      selectedInterval: 0,
      osc: {
        started: false,
        freq: (freq) => { return freq }
      }
    };
    this.configOscStarted = {
      startFreq: 0,
      currentFreq: 0,
      intervalsRange: {
        lower: 1,
        upper: 2
      },
      tuningSysNotes: {
        eqTemp: [200, 400],
      },
      selectedTuningSys: 'eqTemp',
      selectedInterval: 0,
      osc: {
        started: true,
        freq: (freq) => { return freq }
      }
    };
    this.fn = () => {};
  });
  it('should call setTuningSysNotes', function () {
    const spy = sinon.spy(freqiFreqs, 'setTuningSysNotes');
    freqiCtrls.setOscFreqToTuningSys(this.config, this.fn);
    expect(spy).calledOnce;
    spy.restore();
  });
  it('should call setTuningSysNotes with config', function () {
    const spy = sinon.spy(freqiFreqs, 'setTuningSysNotes');
    freqiCtrls.setOscFreqToTuningSys(this.config, this.fn);
    expect(spy).calledOnceWith(this.config);
    spy.restore();
  });
  it('should osc freq when osc started is true', function () {
    const spy = sinon.spy(this.configOscStarted.osc, 'freq');
    freqiCtrls.setOscFreqToTuningSys(this.configOscStarted, this.fn);
    expect(spy).calledOnce;
    spy.restore();
  });
  it('should call callback', function () {
    const spy = sinon.spy(this, 'fn');
    freqiCtrls.setOscFreqToTuningSys(this.configOscStarted, this.fn);
    expect(spy).calledOnce;
    spy.restore();
  });
});
