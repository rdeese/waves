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

  static fromPitches(pitches, width, height) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = width
    canvasElement.height = height
    const canvas = new Canvas(canvasElement)

    for (let i in pitches) {
      canvas.drawPitch(pitches[i])
    }

    return canvas
  }
}


const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

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

class Key {
  constructor(key, pitch, onDown, onUp) {
    this.key = key
    this.pitch = pitch
    this.onDown = onDown
    this.onUp = onUp
    this.html = document.createElement('div')
    this.html.style.display = 'flex'
    this.html.style.alignItems = 'column'
    this.html.style.flexDirection = 'center'
    this.html.style.color = 'white'
    this.html.style.backgroundColor = 'black'
    this.html.style.padding = '10px'
    this.html.style.height = '30px'
    this.html.innerText = `${pitch.note} (${this.key})`
  }

  down() {
    this.html.style.color = 'black'
    this.html.style.backgroundColor = 'white'
    this.onDown()
  }

  up() {
    this.html.style.color = 'white'
    this.html.style.backgroundColor = 'black'
    this.onUp()
  }
}

const main = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const keyContainer = document.getElementById('key-container')
  keyContainer.style.width = width
  keyContainer.style.height = 100
  keyContainer.style.position = 'absolute'
  keyContainer.style.bottom = 0
  keyContainer.style.zIndex = 100

  const canvasContainer = document.getElementById('canvas-container')
  canvasContainer.style.width = width
  canvasContainer.style.height = height

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

  const canvasses = {}
  const synth = new Synth()

  for (keyName in keyMap) {
    const pitch = keyMap[keyName]
    const canvas = Canvas.fromPitches([pitch], width, height)
    canvas.canvas.style.display = 'none'
    canvas.canvas.style.position = 'absolute'
    canvasses[pitch.note] = canvas
    canvasContainer.appendChild(canvas.canvas)

    const key = new Key(keyName, pitch, () => {
      canvas.canvas.style.display = 'inherit'
      synth.play(pitch)
    }, () => {
      canvas.canvas.style.display = 'none'
      synth.stop(pitch)
    })

    keyContainer.appendChild(key.html)

    keyMap[keyName] = key
  }

  document.addEventListener('keydown', (event) => {
    if (event.key in keyMap) {
      keyMap[event.key].down()
    }
  })

  document.addEventListener('keyup', (event) => {
    if (event.key in keyMap) {
      keyMap[event.key].up()
    }
  })
}

window.onload = main
