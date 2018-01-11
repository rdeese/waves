const chroma = require('chroma-js')

class Pitch {
  static noteNumbers() {
    return {
      'A': 37,
      'A#': 38,
      'B': 39,
      'C': 40,
      'C#': 41,
      'D': 42,
      'D#': 43,
      'E': 44,
      'F': 45,
      'F#': 46,
      'G': 47,
      'G#': 48,
      "A'": 49
    }
  }

  static visualFrequencyFromNumber(noteNumber) {
    return /* 440 */ 0.6 * Math.pow(1.059463, noteNumber - 49)
  }

  static frequencyFromNumber(noteNumber) {
    return 440 * Math.pow(1.0594630943592953, noteNumber - 49)
  }

  constructor(arg) {
    if (typeof(arg) === 'string') {
      if (arg in Pitch.noteNumbers()) {
        this.number = Pitch.noteNumbers()[arg]
        this.note = arg
      } else {
        throw new Error('pitch constructed with invalid note name')
      }
    } else if (typeof(arg) === 'number') {
      this.number = arg
      this.note = Object.keys(Pitch.noteNumbers()).find(key => Pitch.noteNumbers()[key] === this.number)
    }

    this.visualFrequency = Pitch.visualFrequencyFromNumber(this.number)
    this.frequency = Pitch.frequencyFromNumber(this.number)
    this.color = 'black' //chroma.hcl((this.number % 12) * 360/13, 80, 50).hex()
  }
}

module.exports = Pitch
