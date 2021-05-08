import {
  startPlayback,
  highlightNote,
  stopPlayback,
} from './on-screen-keyboard';

export function noteOn(
  config,
  index,
  _startPlayback = startPlayback,
  _highlightNote = highlightNote
) {
  _startPlayback({
    config,
    index,
  });
  _highlightNote(config, index, false);
}

export function noteOff(
  config,
  index,
  _stopPlayback = stopPlayback,
  _highlightNote = highlightNote
) {
  _highlightNote(config, index, true);
  _stopPlayback(config);
}
