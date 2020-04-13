import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

import {
  changeWave,
  isMouseInCanvas,
  togglePlay,
  getInitialWaveType,
  setupWaveControls,
  setUpGrainControl,
  constrainAndPlay,
  drawFreqs,
} from './controllers.js';

describe('change wave', function() {
  this.beforeEach(function() {
    this.config = {
      playing: false,
      fft: null,
      osc: {
        setType: function(waveType) {
          return waveType;
        },
      },
      grainSize: 10,
      mouseInCanvas: false,
    };
    this.setTypeSpy = sinon.spy(this.config.osc, 'setType');
  });
  it('should return the first argument', function() {
    expect(changeWave('sawtooth', this.config)).to.equal('sawtooth');
  });
  it('should call the setType method', function() {
    changeWave('sawtooth', this.config);
    expect(this.setTypeSpy).calledOnce;
  });
});
