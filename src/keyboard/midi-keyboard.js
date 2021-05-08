import { noteOn, noteOff } from './keyboard-utils';
import { MIDI_NOTE_MIDDLE_C, ONESHOT } from '../utils/constants';

export function offsetMIDIRange(config, note) {
  return Math.abs(config.intervalsRange.lower) + note - MIDI_NOTE_MIDDLE_C;
}

export function MIDIKeyInRange(config, note) {
  const lowestNoteAbs = Math.abs(config.intervalsRange.lower);
  const highestNote = lowestNoteAbs + config.intervalsRange.upper;
  if (note < 0) {
    return false;
  }
  if (note > highestNote) {
    return false;
  }
  return true;
}

export function getVelocity(message) {
  // a velocity value might not be included with a noteOff command
  return message.data.length > 2 ? message.data[2] : 0;
}

export function getMIDIMessage(
  message,
  config,
  _noteOn = noteOn,
  _noteOff = noteOff
) {
  const command = message.data[0];
  const note = message.data[1];
  const velocity = getVelocity(message);
  const thisNote = offsetMIDIRange(config, note);

  switch (command) {
    case 144: // noteOn
      if (velocity > 0 && MIDIKeyInRange(config, thisNote)) {
        _noteOn(config, thisNote);
      }
      break;
    case 128: // noteOff
      if (MIDIKeyInRange(config, thisNote) && config.playMode === ONESHOT) {
        _noteOff(config, thisNote);
      }
      break;
  }
}

export function onMIDISuccess(
  midiAccess,
  config,
  _getMIDIMessage = getMIDIMessage
) {
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = (message) => {
      _getMIDIMessage(message, config);
    };
  }
  return midiAccess;
}

export function onMIDIFailure() {
  console.warn('Could not access your MIDI devices.');
}

export function initMIDIAccess(config) {
  if (navigator.requestMIDIAccess) {
    config.MIDINotSupported = false;
    navigator.requestMIDIAccess().then((midiAccess) => {
      onMIDISuccess(midiAccess, config);
    }, onMIDIFailure);
  } else {
    config.MIDINotSupported = true;
    console.warn('WebMIDI is not supported in this browser.');
  }
  return config;
}
