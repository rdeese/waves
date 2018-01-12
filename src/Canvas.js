require('./canvas.less')
const Point = require('./Point')

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

class Canvas {
  constructor(canvasElement, useColor) {
    this.useColor = useColor
    this.html = document.createElement('div')
    this.html.classList.add('canvas-object')
    this.canvas = canvasElement
    this.html.appendChild(this.canvas)
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
    this.context.fillStyle = this.useColor ? pitch.color : 'black'
    for (let i = 0; i < 800000; i++) {
      let dot = this.randomPoint()
      if (Math.sin(dot.distanceFrom(this.center())*pitch.visualFrequency) > Random.inRange(-1, 1)) {
        this.context.fillRect(dot.x, dot.y, 0.8, 0.8)
      }
    }
  }

  static fromPitches(pitches, width, height, useColor) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = width
    canvasElement.height = height
    const canvas = new Canvas(canvasElement, useColor)

    for (let i in pitches) {
      canvas.drawPitch(pitches[i])
    }

    return canvas
  }

  // Potentially for another class
  show() {
    this.html.classList.remove('hidden')
    this.html.classList.add('visible')
  }

  hide() {
    this.html.classList.remove('visible')
    this.html.classList.add('hidden')
  }
}

module.exports = Canvas
