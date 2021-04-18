import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as midiKbd from './midi-keyboard';

describe('offsetMIDIRange', function () {
  beforeEach(function () {
    this.config = {
      intervalsRange: {
        lower: -10
      }
    }
  });
  it('should return a number', function () {
    expect(midiKbd.offsetMIDIRange(this.config, 10)).to.be.a('number');
  });
  it('should return 86 when passed config lower and 10 note arg', function () {
    expect(midiKbd.offsetMIDIRange(this.config, 10)).to.equal(-40);
  });
});

describe('MIDIKeyInRange', function () {
  beforeEach(function () {
    this.config = {
      intervalsRange: {
        lower: -10,
        upper: 10
      }
    }
  });
  it('should return a boolean', function () {
    expect(midiKbd.MIDIKeyInRange(this.config, 10)).to.be.a('boolean');
  });
  it('should return true if note is greater than 0 but less than 20', function () {
    expect(midiKbd.MIDIKeyInRange(this.config, 10)).to.be.true;
  });
});

describe('onMIDISuccess', function() {
  before(function() {
    class MidiAccess {
      constructor() {
        this.inputs = {
          values: () => this.inputArr
        }
        this.inputArr = [{ onmidimessage: null, }]
      }
    };
    this.midiAccess = new MidiAccess();
    this.config = {};
    this.midiAccess.inputs
  });
  it('should set onmidimessage to a function', function() {
    const midiAccess = midiKbd.onMIDISuccess(this.midiAccess, this.config);
    const input = midiAccess.inputs.values()[0];
    expect(input.onmidimessage).to.be.a('function');
  });
});

describe('initMIDIAccess', function() {
  before(function() {
    global.navigator = {
      requestMIDIAccess: () => new Promise((resolve, reject) => { return true })
    };
    this.config = {
      MIDINotSupported: false,
    }
  });
  it('should set config.midisupported to false', function() {
    console.log('global.navigator', global.navigator);
    expect(midiKbd.initMIDIAccess(this.config).MIDINotSupported).to.be.false;
  });
});
