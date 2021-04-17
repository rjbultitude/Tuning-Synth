import { expect } from 'chai';

import { createTuningSysNotes } from './freqi-freqs';

describe('createTuningSysNotes', function () {
  beforeEach(function () {
    this.config = {
      startFreq: 1,
      intervals: [0],
      intervalsRange: {
        lower: -2,
        upper: 2,
      },
      freqiModes: ['eqTemp'],
    };
  });
  it('should create an object with one key', function () {
    expect(
      Object.keys(createTuningSysNotes(this.config).tuningSysNotes)
    ).to.have.length(1);
  });
});
