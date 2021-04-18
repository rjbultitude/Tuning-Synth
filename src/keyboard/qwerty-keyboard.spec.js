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
    };
    this.argsQWERTY = {
      e: {
        key: 'q'
      },
      config: this.config,
    };
  });
  after(function() {
    document.body.innerHTML = '';
  });
  it('should call stopAndResetKbd if key is Esc key', function() {
    const spy = sinon.spy();
    qwertyKbd.qwertyKeyupCB(this.args, spy, () => {});
    expect(spy).to.have.been.called;
  });
  it('should call noteOff when key is in QWERTY array', function() {
    const spy = sinon.spy();
    qwertyKbd.qwertyKeyupCB(this.argsQWERTY, () => {}, spy);
    expect(spy).to.have.been.called;
  });
})

describe('qwertyKeydownCB', function() {
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
    this.noteOnSpy = sinon.spy();
  });
  it('should return false if config playing is true and playMode is oneshot', function () {
    expect(qwertyKbd.qwertyKeydownCB(this.argsObjPlaying)).to.be.false;
  });
  it('should call noteOnSpy if playing is false or playMode is not oneShot and QWERTY includes e.key', function () {
    const result = qwertyKbd.qwertyKeydownCB(
      this.argsObjNotPlaying,
      this.noteOnSpy
    );
    expect(this.noteOnSpy).to.have.been.called;
  });
});
