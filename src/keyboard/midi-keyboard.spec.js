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
  it('should return false if note is less than zero', function () {
    expect(midiKbd.MIDIKeyInRange(this.config, -2)).to.be.false;
  });
  it('should return false if note is larger than highest note', function () {
    expect(midiKbd.MIDIKeyInRange(this.config, 22)).to.be.false;
  });
});

describe('getVelocity', function() {
  before(function() {
    this.message = {
      data: [0, 1, 100]
    };
    this.messageNoVel = {
      data: [0, 1]
    }
  });
  it('should return third item of data array (velocity) if it\'s length is greater than 2', function() {
    expect(midiKbd.getVelocity(this.message)).to.equal(100);
  });
  it('should return velocity if message data length is less than 2', function() {
    expect(midiKbd.getVelocity(this.messageNoVel)).to.equal(0);
  });
});

describe('getMIDIMessage', function() {
  before(function() {
    this.message = {
      data: [144, 60, 100]
    };
    this.messageNoteOff = {
      data: [128, 60, 100]
    };
    this.config = {
      playMode: 'oneShot',
      intervalsRange: {
        lower: -10,
        upper: 10
      }
    };
    this.noteOnSpy = sinon.spy();
    this.noteOffSpy = sinon.spy();
  });
  it('should call playAndShow if command (1st item in data array) is 144', function() {
    midiKbd.getMIDIMessage(this.message, this.config, this.noteOnSpy, () => {});
    expect(this.noteOnSpy).to.have.been.called;
  });
  it('should call stopPlayback if command (1st item in data array) is 128', function() {
    midiKbd.getMIDIMessage(this.messageNoteOff, this.config, () => {}, this.noteOffSpy);
    expect(this.noteOffSpy).to.have.been.called;
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
  beforeEach(function() {
    global.navigator = {
      requestMIDIAccess: () => new Promise((resolve, reject) => { return true })
    };
    this.config = {
      MIDINotSupported: false,
    };
  });
  afterEach(function() {
    global.navigator = {
      requestMIDIAccess: undefined
    };
  });
  it('should set config.midisupported to false if requestMIDIAccess is truthy', function() {
    expect(midiKbd.initMIDIAccess(this.config).MIDINotSupported).to.be.false;
  });
  it('should set config.midisupported to true if requestMIDIAccess is falsy', function() {
    global.navigator.requestMIDIAccess = null;
    expect(midiKbd.initMIDIAccess(this.config).MIDINotSupported).to.be.true;
  });
});
