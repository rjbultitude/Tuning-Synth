import { MIDI_NOTE_MIDDLE_C, ONESHOT } from '../utils/constants';
import {
  playAndShowNote,
  stopPlayback,
  highlightNote,
} from '../keyboard/on-screen-keyboard';

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

export function getMIDIMessage(message, config) {
  const command = message.data[0];
  const note = message.data[1];
  const velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  const thisNote = offsetMIDIRange(config, note);

  switch (command) {
    case 144: // noteOn
      // TODO make sure notes are in range
      if (velocity > 0 && MIDIKeyInRange(config, thisNote)) {
        playAndShowNote({
          config,
          index: thisNote,
        });
        highlightNote(config, thisNote, false);
      }
      break;
    case 128: // noteOff
      // TODO make sure notes are in range
      if (MIDIKeyInRange(config, thisNote) && config.playMode === ONESHOT) {
        highlightNote(config, thisNote, true);
        stopPlayback(config);
      }
      break;
  }
}

export function onMIDISuccess(midiAccess, config) {
  for (let input of midiAccess.inputs.values()) {
    input.onmidimessage = (message) => {
      getMIDIMessage(message, config);
    };
  }
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
}
