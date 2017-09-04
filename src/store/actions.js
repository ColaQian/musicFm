import * as types from './actionTypes.js'

export function setPlayList(playList) {
  return {
    type: types.SET_PLAY_LIST,
    data: playList
  }
}

export function setCurrentIndex(index) {
  return {
    type: types.SET_CURRENT_INDEX,
    data: index
  }
}

export function setPlayingState(state) {
  return {
    type: types.SET_PLAYING_STATE,
    data: state
  }
}

export function setPlayingMode(mode) {
  return {
    type: types.SET_PLAYING_MODE,
    data: mode
  }
}

export function setCurrentSong() {
  return {
    type: types.SET_CURRENT_SONG
  }
}