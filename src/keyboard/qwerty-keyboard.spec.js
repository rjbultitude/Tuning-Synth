import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ONESHOT } from '../utils/constants';
chai.use(sinonChai);

import * as qwertyKbd from './qwerty-keyboard';
import * as onScreenKbd from './on-screen-keyboard';

describe('isEsc', function () {
  it('should return true if key arg is "Escape"', function () {
    expect(qwertyKbd.isEsc('Escape')).to.be.true;
  });
  it('should return true if key arg is "Esc"', function () {
    expect(qwertyKbd.isEsc('Esc')).to.be.true;
  });
  it('should return true if key arg is 27', function () {
    expect(qwertyKbd.isEsc(27)).to.be.true;
  });
});

describe('setQwertyEvents', function () {
  beforeEach(function () {
    this.config = {};
    this.cb = () => {};
    this.eventListenerSpy = sinon.spy(document, 'addEventListener');
  });
  afterEach(function () {
    this.eventListenerSpy.restore();
  });
  it('should call addEventListener', function () {
    qwertyKbd.setQwertyEvents();
    expect(this.eventListenerSpy).called;
  });
});

describe('qwertyKeyupCB', function() {
  before(function() {
    this.config = {
      currKbdBtnID: 1,
      playMode: 'oneShot',
      intervalsRange: {
        lower: 0,
      },
      keyBoardButtonStyles: ['styleOne', 'styleTwo'],
      osc: {
        stop: () => {}
      }
    };
    this.args = {
      e: {
        key: 'Esc'
      },
      config: {
        currKbdBtnID: 1,
        playMode: 'ONESHOT',
        intervalsRange: {
          lower: 0,
        },
        keyBoardButtonStyles: ['styleOne', 'styleTwo'],
        osc: {
          stop: () => {}
        }
      },
      updateAudioOutput: () => {}
    };
    this.argsQWERTY = {
      e: {
        key: 'q'
      },
      config: this.config,
      updateAudioOutput: () => {}
    };
    const btnOne = document.createElement('button');
    const btnTwo = document.createElement('button');
    btnOne.setAttribute('id', 'key_0');
    btnTwo.setAttribute('id', 'key_1');
    document.body.insertAdjacentElement('afterbegin', btnOne);
    document.body.insertAdjacentElement('afterbegin', btnTwo);
  });
  after(function() {
    document.body.innerHTML = '';
  });
  it('should call stopAndResetKbd if key is Esc key', function() {
    const spy = sinon.spy();
    qwertyKbd.qwertyKeyupCB(this.args, spy, () => {});
    expect(spy).to.have.been.called;
  });
  it('should call highlightNote when key is in QWERTY array', function() {
    const spy = sinon.spy(onScreenKbd, 'highlightNote');
    qwertyKbd.qwertyKeyupCB(this.argsQWERTY, () => {}, () => {});
    expect(spy).to.have.been.called;
  });
})

describe('qwertyKeydownCB', function() {
  before(function() {
    const btnOne = document.createElement('button');
    const btnTwo = document.createElement('button');
    btnOne.setAttribute('id', 'key_-12');
    btnTwo.setAttribute('id', 'key_-11');
    document.body.insertAdjacentElement('afterbegin', btnOne);
    document.body.insertAdjacentElement('afterbegin', btnTwo);
  });
  after(function() {
    document.body.innerHTML = '';
  });
  beforeEach(function() {
    this.argsObjNotPlaying = {
      e: {
        key: 'q'
      },
      config: {
        playing: false,
        playMode: ONESHOT,
        intervalsRange: {
          lower: -12,
          upper: 12,
        },
        keyBoardButtonStyles: ['style0', 'style1'],
        tuningSysNotes: {
          eqTemp: [220],
        },
        selectedTuningSys: 'eqTemp',
        currentFreq: 440,
        selectedInterval: 0,
        osc: {
          freq: (freq) => {},
          start: (start) => {},
        },
      },
    };
    this.argsObjPlaying = {
      e: {
        key: 'd' //TODO should it be a?
      },
      config: {
        playing: true,
        playMode: ONESHOT,
      },
    };
    this.playAndShowNoteStub = sinon.stub(onScreenKbd, 'playAndShowNote');
  });
  afterEach(function () {
    this.playAndShowNoteStub.restore();
  });
  it('should return false if config playing is true and playMode is oneshot', function () {
    expect(qwertyKbd.qwertyKeydownCB(this.argsObjPlaying)).to.be.false;
  });
  it('should return true if playAndShowNote if playing is false and QWERTY includes e.key', function () {
    const result = qwertyKbd.qwertyKeydownCB(
      this.argsObjNotPlaying,
      this.playAndShowNoteStub
    );
    expect(result).to.be.true;
  });
  it('should call playAndShowNote if playing is false and QWERTY includes e.key', function () {
    qwertyKbd.qwertyKeydownCB(this.argsObjNotPlaying);
    expect(this.playAndShowNoteStub).called;
  });
  it('should call playCurrentNoteSpy', function () {
    qwertyKbd.qwertyKeydownCB(this.argsObjNotPlaying);
    expect(this.playAndShowNoteStub).called;
  });
});
