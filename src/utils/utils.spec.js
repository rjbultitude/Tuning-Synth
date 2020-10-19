import chai, { expect } from 'chai';
import sinon, { spy } from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import {updateUI} from './utils';

describe('updateUI', function() {
  beforeEach(function () {
    this.el = {
      innerText: ''
    }
  });
  afterEach(function () {
    this.el = null;
  });
  it('should set the innter text of element to value', function() {
    expect(updateUI('test', this.el).innerText).to.equal('test');
  });
  it('should convert a number value to a string', function() {
    const updatedEl = updateUI(10, this.el);
    expect(updatedEl.innerText).to.be.a('string');
  });
  it('should remove decimals from a number', function() {
    expect(updateUI(10.001, this.el).innerText).to.equal('10');
  });
  it('should return original element if value is neither string or number', function() {
    expect(updateUI([], this.el).innerText).to.equal('');
  });
});
