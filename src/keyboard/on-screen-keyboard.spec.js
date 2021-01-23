import chai, { config, expect } from 'chai';
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
    playCurrentNote(this.config, this.freq);
    expect(this.config.osc.freq).to.have.been.calledWith(this.freq);
  });
});
