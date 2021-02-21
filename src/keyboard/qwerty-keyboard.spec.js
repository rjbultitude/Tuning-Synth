import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ONESHOT } from '../utils/constants';
chai.use(sinonChai);

import * as qwertyKbd from './qwerty-keyboard';
import * as onScreenKbd from './on-screen-keyboard';

describe('isEsc', function() {
  it('should return true if key arg is "Escape"', function() {
    expect(qwertyKbd.isEsc('Escape')).to.be.true;
  });
  it('should return true if key arg is "Esc"', function() {
    expect(qwertyKbd.isEsc('Esc')).to.be.true;
  });
  it('should return true if key arg is 27', function() {
    expect(qwertyKbd.isEsc(27)).to.be.true;
  });
});

describe('setQwertyEvents', function() {
  beforeEach(function() {
    this.config = {
    };
    this.cb = () => {};
    this.eventListenerSpy = sinon.spy(document, 'addEventListener');
  });
  afterEach(function() {
    this.eventListenerSpy.restore();
  });
  it('should call addEventListener', function() {
    qwertyKbd.setQwertyEvents();
    expect(this.eventListenerSpy).called;
  });
});

describe('qwertyKeydownCB', function() {
  beforeEach(function() {
    this.argsObjNotPlaying = {
      e: {
        key: 'a'
      },
      config: {
        playing: false,
        playMode: ONESHOT,
        tuningSysNotes: {
          'eqTemp': [220]
        },
        selectedTuningSys: 'eqTemp',
        currentFreq: 440,
        selectedInterval: 0,
        osc: {
          freq: (freq) => {},
          start: (start) => {}
        }
      },
      updateAudioOutput: () => {}
    };
    this.argsObjPlaying = {
      e: {
        key: 'a'
      },
      config: {
        playing: true,
        playMode: ONESHOT
      },
      updateAudioOutput: () => {}
    };
    this.playAndShowNoteStub = sinon.stub(onScreenKbd, 'playAndShowNote');
  });
  afterEach(function() {
    this.playAndShowNoteStub.restore();
  });
  it('should return false if config playing is true and playMode is oneshot', function() {
    expect(qwertyKbd.qwertyKeydownCB(this.argsObjPlaying)).to.be.false;
  });
  it('should return true if playAndShowNote if playing is false and QWERTY includes e.key', function() {
    const result = qwertyKbd.qwertyKeydownCB(this.argsObjNotPlaying, this.playAndShowNoteStub);
    expect(result).to.be.true;
  });
  it('should call playAndShowNote if playing is false and QWERTY includes e.key', function() {
    qwertyKbd.qwertyKeydownCB(this.argsObjNotPlaying);
    expect(this.playAndShowNoteStub).called;
  });
  it('should call playCurrentNoteSpy', function() {
    qwertyKbd.qwertyKeydownCB(this.argsObjNotPlaying);
    expect(this.playAndShowNoteStub).called;
  });
});
