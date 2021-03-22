import { MIDI_NOTE_MIDDLE_C } from '../utils/constants';
import {
  playAndShowNote,
  stopAndHideNote,
  highlightNote,
} from '../keyboard/on-screen-keyboard';

export function offsetMIDIRange(note) {
  return note - MIDI_NOTE_MIDDLE_C;
}

export function getMIDIMessage(message, config) {
  const command = message.data[0];
  const note = message.data[1];
  const velocity = message.data.length > 2 ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
  const thisNote = offsetMIDIRange(note);

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        // noteOn(note, velocity);
        playAndShowNote({
          config,
          index: thisNote,
        });
        highlightNote(config, thisNote);
      } else {
        // noteOff(note);
        stopAndHideNote(config);
        highlightNote(config, thisNote, true);
      }
      break;
    case 128: // noteOff
      noteOff(note);
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
  console.log('Could not access your MIDI devices.');
}

export function initMIDIAccess(config) {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then((midiAccess) => {
      onMIDISuccess(midiAccess, config);
    }, onMIDIFailure);
  } else {
    // TODO handle UI
    console.log('WebMIDI is not supported in this browser.');
  }
}
