class Synth {
  constructor() {
    this.audioContext = new AudioContext()
    this.oscillators = {}
  }

  _getOscillator(pitch) {
    let oscillator = this.oscillators[pitch.note]
    if (!oscillator) {
      oscillator = this.audioContext.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.value = pitch.frequency
      oscillator.start()
      this.oscillators[pitch.note] = oscillator
    }

    return oscillator
  }

  play(pitch) {
    this._getOscillator(pitch).connect(this.audioContext.destination)
  }

  stop(pitch) {
    this._getOscillator(pitch).disconnect()
  }
}

module.exports = Synth
