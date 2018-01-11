class Synth {
  constructor() {
    this.audioContext = new AudioContext()
    this.oscillators = {}
  }

  _getGainNode(pitch) {
    let gainNode = this.oscillators[pitch.note]
    if (!gainNode) {
      const oscillator = this.audioContext.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(pitch.frequency, this.audioContext.currentTime)
      oscillator.start()
      gainNode = this.audioContext.createGain()
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      this.oscillators[pitch.note] = gainNode
    }

    return gainNode
  }

  play(pitch) {
    const gainNode = this._getGainNode(pitch)
    gainNode.gain.setTargetAtTime(1, this.audioContext.currentTime, 0.015)
  }

  stop(pitch) {
    const gainNode = this._getGainNode(pitch)
    gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.015)
  }
}

module.exports = Synth
