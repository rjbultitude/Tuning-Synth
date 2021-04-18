import {
  playAndShowNote,
  highlightNote,
  stopPlayback,
} from './on-screen-keyboard';

export function noteOn(
  config,
  index,
  _playAndShowNote = playAndShowNote,
  _highlightNote = highlightNote
) {
  _playAndShowNote({
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
