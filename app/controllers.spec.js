import { expect } from 'chai';
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
  });
  it('should return argument', function() {
    expect(changeWave('sawtooth', this.config)).to.equal('sawtooth');
  });
});
