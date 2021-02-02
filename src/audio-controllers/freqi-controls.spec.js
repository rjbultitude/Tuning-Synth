import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import 'jsdom-global/register'
chai.use(sinonChai);

import * as freqiFreqs from '../freqi-freqs/freqi-freqs';
import * as onScreenKeyboard from '../keyboard/on-screen-keyboard';
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
    this.setTuningSysNotesSpy = sinon.spy(freqiFreqs, 'setTuningSysNotes');
  });
  afterEach(function() {
    this.setTuningSysNotesSpy.restore();
  });
  it('should call setTuningSysNotes', function () {
    freqiCtrls.setOscFreqToTuningSys(this.config, this.fn);
    expect(this.setTuningSysNotesSpy).calledOnce;
  });
  it('should call setTuningSysNotes with config', function () {
    freqiCtrls.setOscFreqToTuningSys(this.config, this.fn);
    expect(this.setTuningSysNotesSpy).calledOnceWith(this.config);
  });
  it('should osc freq when osc started is true', function () {
    const spy = sinon.spy(this.configOscStarted.osc, 'freq');
    freqiCtrls.setOscFreqToTuningSys(this.configOscStarted, this.fn);
    spy.restore();
    expect(spy).calledOnce;
  });
  it('should call callback', function () {
    const spy = sinon.spy(this, 'fn');
    freqiCtrls.setOscFreqToTuningSys(this.configOscStarted, this.fn);
    spy.restore();
    expect(spy).calledOnce;
  });
});

describe('applyTuningSystem', function() {
  this.beforeEach(function() {
    this.event = {
      target: {
        value: 'eqTemp'
      }
    };
    this.config = {
      startFreq: 0,
      currentFreq: 0,
      selectedInterval: 0,
      currentFreq: 400,
      osc: {
        freq: 200,
        started: false,
      },
      selectedTuningSys: 'eqTemp',
      tuningSysNotes: {
        eqTemp: [200, 400]
      },
      freqiTuningSysMeta: {
        eqTemp: {
          shortName: 'equal temp',
          intervalsInOctave: 2
        }
      },
      intervalsRange: {
        lower: 1,
        upper: 2
      },
      keyboardButtons: [{
        id: 'id_1',
        style: {
          boxShadow: ''
        }
      }]
    };
    this.fn = () => {};
    this.setTuningSysNotesSpy = sinon.spy(freqiFreqs, 'setTuningSysNotes');
    this.highlightOctavesSpy = sinon.spy(onScreenKeyboard, 'highlightOctaves');
  });
  afterEach(function() {
    this.setTuningSysNotesSpy.restore();
    this.highlightOctavesSpy.restore();
  });
  it('should set selectedTuningSys to event target value', function() {
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.config.selectedTuningSys).to.equal(this.event.target.value);
  });
  it('should call setOscFreqToTuningSys', function() {
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.setTuningSysNotesSpy).calledOnce;
  });
  it('should call setOscFreqToTuningSys', function() {
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.highlightOctavesSpy).calledOnce;
  });
});

describe('createTuningOptions', function() {
  beforeEach(function() {
    const tuningSysMap = new Map();
    tuningSysMap.set('eqTemp','Equal Temperament');
    tuningSysMap.set('pythagorean', 'pythagorean');
    this.config = {
      tuningSystems: tuningSysMap
    };
    this.el = {
      setAttribute: function(key, value) {
        Object.defineProperty(this, key, { value })
      },
      innerText: ''
    }
    this.creatElSpy = sinon.spy(document, 'createElement');
    this.wrapper = document.createElement('select');
    this.wrapperAppendSpy = sinon.spy(this.wrapper, 'appendChild');
  });
  afterEach(function() {
    this.creatElSpy.restore();
  });
  it('should create an element for each tuningSystems item', function() {
    // This call must be added to expected result
    freqiCtrls.createTuningOptions(this.wrapper, this.config);
    const numKeys = this.config.tuningSystems.size;
    expect(this.creatElSpy.callCount).to.equal(numKeys + 1);
  });
  it('should call select appendChild', function() {
    // This call must be added to expected result
    freqiCtrls.createTuningOptions(this.wrapper, this.config);
    const numKeys = this.config.tuningSystems.size;
    expect(this.wrapperAppendSpy.callCount).to.equal(numKeys);
  });
  xit('should set first element\'s innertext to first item\'s value', function() {
    freqiCtrls.createTuningOptions(this.wrapper, this.config);
    const args = this.creatElSpy.getCall(0).args;
    console.log('HEY args', args);
    expect(args[0]).to.equal('eqTemp');
  });
});
