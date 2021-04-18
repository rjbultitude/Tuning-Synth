import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as kbdUtils from './keyboard-utils';

describe('noteOn', function() {
  before(function() {
    this.config = {};
    this.playAndShowSpy = sinon.spy();
  });
  it('should call playAndShowSpy', function() {
    kbdUtils.noteOn(this.config, 1, this.playAndShowSpy, () => {});
  });
});

describe('noteOff', function() {
  before(function() {
    this.config = {};
    this.stopPlaybackSpy = sinon.spy();
  });
  it('should call stopPlayback', function() {
    kbdUtils.noteOff(this.config, 1, this.stopPlaybackSpy, () => {});
  });
});
