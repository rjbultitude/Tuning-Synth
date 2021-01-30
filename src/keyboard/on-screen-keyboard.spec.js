import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import {
  playCurrentNote,
  stopCurrentNote,
  highlightOctaves,
  stopAndHideNote,
  playAndShowNote,
  createKeyboard
} from './on-screen-keyboard';

describe('playCurrentNote', function() {
  beforeEach(function() {
    this.config = {
      osc: {
        freq: sinon.spy(),
        start: sinon.spy(),
      }
    };
    this.freq = 440;
  });
  it('should call osc freq with freq arg val', function() {
    playCurrentNote({ config: this.config, freq: this.freq });
    expect(this.config.osc.freq).to.have.been.calledWith(this.freq);
  });
});

describe('stopCurrentNote', function() {
  beforeEach(function() {
    this.config = {
      osc: {
        stop: sinon.spy(),
      }
    };
  });
  it('should call osc stop', function() {
    stopCurrentNote(this.config);
    expect(this.config.osc.stop).to.have.been.called;
  });
});

describe('highlightOctaves', function() {
  beforeEach(function() {
    this.config = {
      selectedTuningSys: 'eqTemp',
      freqiTuningSysMeta: {
        eqTemp: {
          shortName: 'equal temperament',
          intervalsInOctave: 2
        },
      },
      keyboardButtons: [
        {
          id: 'key_1',
          style: {
            boxShadow: ''
          }
        },
        {
          id: 'key_2',
          style: {
            boxShadow: ''
          }
        }
      ]
    };
    this.KEYBOARD_OCT_STYLE = 'inset 0 0 4px #fff';
  });
  it('should set box shadow to none', function() {
    highlightOctaves({ config: this.config, KEYBOARD_OCT_STYLE: this.KEYBOARD_OCT_STYLE });
    expect(this.config.keyboardButtons[0].style.boxShadow).to.equal('none');
  });
  it('should style element when item is octave', function() {
    highlightOctaves({ config: this.config, KEYBOARD_OCT_STYLE: this.KEYBOARD_OCT_STYLE });
    expect(this.config.keyboardButtons[1].style.boxShadow).to.equal(this.KEYBOARD_OCT_STYLE);
  });
});

describe('stopAndHideNote', function() {
  beforeEach(function() {
    this.config = {
      playing: true,
      osc: {
        start: function() {},
        stop: function() {},
      }
    };
    this.cb = sinon.spy();
  });
  it('should call cb', function() {
    stopAndHideNote({ config: this.config, updateAudioOutput: this.cb });
    expect(this.cb).to.have.been.called;
  });
  it('should set config playing to false', function() {
    stopAndHideNote({ config: this.config, updateAudioOutput: this.cb });
    expect(this.config.playing).to.be.false;
  });
});
