import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import __RewireAPI__, * as freqiCtrls from './freqi-controls';

const tuningSysMap = new Map();
tuningSysMap.set('eqTemp','Equal Temperament');
tuningSysMap.set('pythagorean', 'pythagorean');

const selectValue = 'test';
//Note: write can only be performed once
document.write(`<select id="freqiControls"></select><select id="tuningSystem"><option value="${selectValue}" selected></select>`);

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
    this.setTuningSysNotesSpy = sinon.spy();
  });
  it('should call setTuningSysNotes', function () {
    __RewireAPI__.__Rewire__('setTuningSysNotes', this.setTuningSysNotesSpy);
    freqiCtrls.setOscFreqToTuningSys(this.config, this.fn);
    expect(this.setTuningSysNotesSpy).calledOnce;
  });
  it('should call setTuningSysNotes with config', function () {
    __RewireAPI__.__Rewire__('setTuningSysNotes', this.setTuningSysNotesSpy);
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
    this.setTuningSysNotesSpy = sinon.spy();
    this.highlightOctavesSpy = sinon.spy();
  });
  // afterEach(function() {
  //   this.setTuningSysNotesSpy.restore();
  //   this.highlightOctavesSpy.restore();
  // });
  it('should set selectedTuningSys to event target value', function() {
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.config.selectedTuningSys).to.equal(this.event.target.value);
  });
  it('should call setTuningSysNotes', function() {
    __RewireAPI__.__Rewire__('setTuningSysNotes', this.setTuningSysNotesSpy);
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.setTuningSysNotesSpy).calledOnce;
  });
  it('should call highlightOctaves', function() {
    __RewireAPI__.__Rewire__('highlightOctaves', this.highlightOctavesSpy);
    freqiCtrls.applyTuningSystem(this.event, this.config, this.fn);
    expect(this.highlightOctavesSpy).calledOnce;
  });
});

describe('createTuningOptions', function() {
  beforeEach(function() {
    this.option = document.createElement('option');
    this.tuningSysVal = 'test';
  });
  it('should set innertext to tuningSysVal', function() {
    const select = freqiCtrls.addOptionsAttrs({
      newOption: this.option,
      count: 0,
      tuningSysVal: this.tuningSysVal,
      tuningSysKey: 'eqTemp',
    });
    expect(select.innerText).to.equal(this.tuningSysVal);
  });
  it('should set selected to selected if count is zero', function() {
    const select = freqiCtrls.addOptionsAttrs({
      newOption: this.option,
      count: 0,
      tuningSysVal: 'test',
      tuningSysKey: 'eqTemp',
    });
    expect(select.selected).to.be.true;
  });
});

describe('createTuningOptions', function() {
  beforeEach(function() {
    this.config = {
      tuningSystems: tuningSysMap
    };
    this.el = {
      setAttribute: function(key, value) {
        Object.defineProperty(this, key, { value })
      },
      innerText: ''
    }
    this.createElSpy = sinon.spy(document, 'createElement');
    this.wrapper = document.createElement('select');
    this.wrapperAppendSpy = sinon.spy(this.wrapper, 'appendChild');
  });
  afterEach(function() {
    this.createElSpy.restore();
  });
  it('should create an element for each tuningSystems item', function() {
    // This call must be added to expected result
    freqiCtrls.createTuningOptions(this.wrapper, this.config);
    const numKeys = this.config.tuningSystems.size;
    expect(this.createElSpy.callCount).to.equal(numKeys + 1);
  });
  it('should call select appendChild', function() {
    // This call must be added to expected result
    freqiCtrls.createTuningOptions(this.wrapper, this.config);
    const numKeys = this.config.tuningSystems.size;
    expect(this.wrapperAppendSpy.callCount).to.equal(numKeys);
  });
});

describe('createTuningSelect', function() {
  beforeEach(function() {
    this.config = {
      selectedTuningSys: 'eqTemp',
      tuningSystems: tuningSysMap
    };
    this.cb = () => {};
    this.createElSpy = sinon.spy(document, 'createElement');
    this.tSlctLSpy = sinon.spy();
  });
  afterEach(function() {
    this.createElSpy.restore();
  });
  it('should call createElement', function() {
    freqiCtrls.createTuningSelect(this.config, this.cb);
    expect(this.createElSpy).calledThrice;
  });
  it('should call addTuningSelectListener', function() {
    __RewireAPI__.__Rewire__('addTuningSelectListener', this.tSlctLSpy);
    const select = freqiCtrls.createTuningSelect(this.config, this.cb);
    freqiCtrls.addTuningSelectListener(select, this.config, this.cb);
    expect(this.tSlctLSpy).calledOnce;
  });
})

describe('writeFreqiControls', function() {
  beforeEach(function() {
    this.config = {
      selectedTuningSys: 'eqTemp',
      tuningSystems: tuningSysMap
    };
    this.cb = () => {};
    this.getElByIdSpy = sinon.spy(document, 'getElementById');
    this.tuningSelectSpy = sinon.spy();
    this.select = document.createElement('select');
    this.tuningSelectStub = sinon.stub(freqiCtrls, 'createTuningSelect').returns(this.select);
  });
  afterEach(function() {
    this.getElByIdSpy.restore();
  });
  it('should call getElementById', function() {
    freqiCtrls.writeFreqiControls(this.config, this.cb);
    expect(this.getElByIdSpy).calledTwice;
  });
  it('should call createTuningSelect', function() {
    __RewireAPI__.__Rewire__('createTuningSelect', this.tuningSelectStub);
    freqiCtrls.writeFreqiControls(this.config, this.cb);
    expect(this.tuningSelectStub).called;
  });
  it('should set selectedTuningSys to value of tuningSys Select', function() {
    freqiCtrls.writeFreqiControls(this.config, this.cb);
    expect(this.config.selectedTuningSys).to.equal(selectValue);
  });
});
