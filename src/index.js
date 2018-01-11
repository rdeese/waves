// (() => {
//
const chroma = require('chroma-js')
const _ = require('lodash')

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

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  distanceFrom(point) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
  }

  offset(x, y) {
    return new Point(this.x + x, this.y + y);
  }
  
  static fromEvent (event) {
    return new Point(event.clientX, event.clientY)
  }
}

class Canvas {
  constructor(canvasElement) {
    this.canvas = canvasElement
    this.context = this.canvas.getContext('2d')
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  center() {
    return new Point(this.canvas.width/2, this.canvas.height/2)
  }

  randomPoint() {
    return new Point(Math.random()*this.canvas.width, Math.random()*this.canvas.height)
  }

  drawPitch(pitch) {
    this.context.fillStyle = pitch.color
    for (let i = 0; i < 800000; i++) {
      let dot = this.randomPoint()
      if (Math.sin(dot.distanceFrom(this.center())*pitch.visualFrequency) > Random.inRange(-1, 1)) {
        this.context.fillRect(dot.x, dot.y, 0.8, 0.8)
      }
    }
  }
}


const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

const appendCanvas = (noteNames, width, height) => {
  const canvasElement = document.createElement('canvas')
  canvasElement.style = 'margin: 10px'
  document.body.appendChild(canvasElement)
  canvasElement.width = width
  canvasElement.height = height
  const canvas = new Canvas(canvasElement)

  for (let i in noteNames) {
    const pitch = new Pitch(noteNames[i])
    canvas.drawPitch(pitch)
  }
}

const main = () => {
  const limitingDimension = Math.min(window.innerWidth, window.innerHeight)
  const width = limitingDimension - limitingDimension / 5
  const height = width

  const canvasElement = document.getElementById('canvas')
  canvasElement.width = width
  canvasElement.height = height
  const canvas = new Canvas(canvasElement)

  const activePitches = []
  const activeOscillators = {
  }

  const keyMap = {
    'a': new Pitch('A'),
    'w': new Pitch('A#'),
    's': new Pitch('B'),
    'd': new Pitch('C'),
    'r': new Pitch('C#'),
    'f': new Pitch('D'),
    't': new Pitch('D#'),
    'g': new Pitch('E'),
    'h': new Pitch('F'),
    'u': new Pitch('F#'),
    'j': new Pitch('G'),
    'i': new Pitch('G#'),
    'k': new Pitch("A'")
  }

  const audioContext = new AudioContext()

  document.addEventListener('keydown', (event) => {
    if (event.key in keyMap && !_.includes(activePitches, keyMap[event.key])) {
      const newPitch = keyMap[event.key]
      canvas.clear()
      activePitches.push(newPitch)
      for (let i in activePitches) {
        canvas.drawPitch(activePitches[i])
      }

      let oscillator = activeOscillators[newPitch.note]
      if (!oscillator) {
        oscillator = audioContext.createOscillator()
        oscillator.type = 'triangle'
        activeOscillators[newPitch.note] = oscillator
        oscillator.frequency.value = newPitch.frequency
        oscillator.start()
      }
      oscillator.connect(audioContext.destination)
    }
  })

  document.addEventListener('keyup', (event) => {
    if (event.key in keyMap) {
      const targetPitch = keyMap[event.key]

      canvas.clear()
      _.pull(activePitches, targetPitch)
      for (let i in activePitches) {
        canvas.drawPitch(activePitches[i])
      }
     
      const oscillator = activeOscillators[targetPitch.note]
      oscillator.disconnect()
    }
  })
}

window.onload = main
