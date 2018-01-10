// (() => {
//
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

  static frequencyFromNumber(noteNumber) {
    return /* 440 */ 1 * Math.pow(1.059463, noteNumber - 49)
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

    this.frequency = Pitch.frequencyFromNumber(this.number)
    this.color = 'black'//chroma.hcl((this.number % 12) * 360/13, 80, 50).hex()
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
    this.context.globalCompositeOperation = 'normal'
  }

  center() {
    return new Point(this.canvas.width/2, this.canvas.height/2)
  }

  randomPoint() {
    return new Point(Math.random()*this.canvas.width, Math.random()*this.canvas.height)
  }

  drawPitch(pitch) {
    this.context.fillStyle = pitch.color
    for (let i = 0; i < 120000; i++) {
      let dot = this.randomPoint()
      if (Math.sin(dot.distanceFrom(this.center())*pitch.frequency) > Random.inRange(-1, 1)) {
        this.context.fillRect(dot.x, dot.y, 1, 1)
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
  const canvasList = Object.keys(Pitch.noteNumbers()).map((note) => { return ['A', note] })
  
  const limitingDimension = Math.min(window.innerWidth, window.innerHeight)/2
  const width = limitingDimension - limitingDimension / 5
  const height = width

  for (let i in canvasList) {
    appendCanvas(canvasList[i], width, height)
  }
}

window.onload = main
