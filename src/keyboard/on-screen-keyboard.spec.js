import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import * as onScreenKB from './on-screen-keyboard';

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
    onScreenKB.playCurrentNote({ config: this.config, freq: this.freq });
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
    onScreenKB.stopCurrentNote(this.config);
    expect(this.config.osc.stop).to.have.been.called;
  });
});

describe('getKeyIDFromIndex', function() {
  it('should return a number', function() {
    expect(onScreenKB.getKeyIDFromIndex(5, -12)).to.be.a('number');
  });
  it('should add numNegativeKeys to index', function() {
    expect(onScreenKB.getKeyIDFromIndex(5, -12)).to.equal(-7);
  });
});

describe('getKeyIDNum', function() {
  beforeEach(function() {
    this.item = {
      id: 'id_1'
    }
  });
  it('should return a number when passed an object with prop id string', function() {
    expect(onScreenKB.getKeyIDNum(this.item)).to.be.a('number');
  });
  it('should return the number it was passed as a string in object', function() {
    expect(onScreenKB.getKeyIDNum(this.item)).to.equal(1);
  });
});

describe('getKeyIDNumAbs', function(){
  beforeEach(function() {
    this.item = {
      id: 'id_1'
    }
    this.itemNeg = {
      id: 'id_-2'
    }
  });
  it('should return a number when passed an object with id prop string', function() {
    expect(onScreenKB.getKeyIDNumAbs(this.item)).to.be.a('number');
  });
  it('should return a postive number when passed a an id string with a negative number', function() {
    expect(onScreenKB.getKeyIDNumAbs(this.itemNeg)).to.equal(2);
  });
});

describe('getIndexFromKeyID', function() {
  it('should return a number', function() {
    expect(onScreenKB.getIndexFromKeyID(-12, 5)).to.be.a('number');
  });
  it('should always return a positive number', function() {
    expect(onScreenKB.getIndexFromKeyID(-12, 5)).to.be.gte(0);
  });
  it('should convert numNegativeKeys to a positive number and add to index', function() {
    expect(onScreenKB.getIndexFromKeyID(-12, 5)).to.equal(17);
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
    onScreenKB.highlightOctaves({ config: this.config, KEYBOARD_OCT_STYLE: this.KEYBOARD_OCT_STYLE });
    expect(this.config.keyboardButtons[0].style.boxShadow).to.equal('none');
  });
  it('should style element when item is octave', function() {
    onScreenKB.highlightOctaves({ config: this.config, KEYBOARD_OCT_STYLE: this.KEYBOARD_OCT_STYLE });
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
    onScreenKB.stopAndHideNote({ config: this.config, updateAudioOutput: this.cb });
    expect(this.cb).to.have.been.called;
  });
  it('should set config playing to false', function() {
    onScreenKB.stopAndHideNote({ config: this.config, updateAudioOutput: this.cb });
    expect(this.config.playing).to.be.false;
  });
});

describe('playAndShowNote', function() {
  beforeEach(function() {
    this.config = {
      osc: {
        freq: sinon.spy(),
        start: sinon.spy(),
      },
      currentFreq: 440,
      selectedInterval: 0,
      selectedTuningSys: 'eqTemp',
      tuningSysNotes: {
        eqTemp: [200, 400]
      },
      playing: false
    };
    this.index = 1;
    this.updateCB = sinon.spy();
    this.playCB = sinon.stub();
  });
  it('should set config playing to true', function() {
    onScreenKB.playAndShowNote({
      config: this.config,
      index: this.index,
      updateAudioOutput: this.updateCB
    });
    expect(this.config.playing).to.be.true;
  });
  it('should call the updateAudioOutput callback', function() {
    onScreenKB.playAndShowNote({
      config: this.config,
      index: this.index,
      updateAudioOutput: this.updateCB
    });
    expect(this.updateCB).to.have.been.called;
  });
  it('should set config selectedInterval to index', function() {
    onScreenKB.playAndShowNote({ config: this.config, index: this.index, updateAudioOutput: this.updateCB, playCurrentNote: this.playCB });
    expect(this.config.selectedInterval).to.equal(this.index);
  });
  it('should have called playCurrentNote', function() {
    onScreenKB.playAndShowNote({
        config: this.config,
        index: this.index,
        updateAudioOutput: this.updateCB
      },
      this.playCB
    );
    expect(this.playCB).to.have.been.called;
  });
});

describe('getBtnColour', function() {
  beforeEach(function() {
    this.index = 1;
    this.defaultIntervals = [0, 1, 2];
    this.p5Sketch = {
      map: num => {},
    }
  });
  it('should return an object with keys r, g, b', function() {
    const obj = onScreenKB.getBtnColour(this.index, this.defaultIntervals, this.p5Sketch);
    expect(obj).to.have.all.keys('r', 'g', 'b');
  });
});

describe('setBtnAttrs', function() {
  beforeEach(function() {
    this.num = 1;
    this.keyButton = {
      innerText: '',
      setAttribute: function(key, value) {
        Object.defineProperty(this, key, { value })
      }
    };
  });
  it('should set innerText to num as string', function() {
    const el = onScreenKB.setBtnAttrs({ num: this.num, keyButton: this.keyButton });
    expect(el.innerText).to.equal(`${this.num}`);
  });
  it('should set attribute id to "key_[num]"', function() {
    const el = onScreenKB.setBtnAttrs({ num: this.num, keyButton: this.keyButton });
    expect(el.id).to.equal(`key_${this.num}`);
  });
});

describe('addBtnListeners', function() {
  beforeEach(function() {
    const button = document.createElement('button');
    this.args = {
      keyButton: button,
      config: {},
      index: 0,
      updateAudioOutput: () => {},
    };
    this.addListenerSpy = sinon.spy(button, 'addEventListener');
  });
  afterEach(function() {
    this.addListenerSpy.restore();
  });
  it('should call addEventListener on keyButton arg', function() {
    onScreenKB.addBtnListeners(this.args);
    expect(this.addListenerSpy).to.have.been.called;
  });
});
