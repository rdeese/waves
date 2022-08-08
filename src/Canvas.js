require('./canvas.less')
const Point = require('./Point')

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

class Canvas {
  constructor(canvasElement, useColor, highDef) {
    this.useColor = useColor
    this.highDef = highDef
    this.html = document.createElement('div')
    this.html.classList.add('canvas-object')
    this.canvas = canvasElement
    this.html.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')

    const area = this.canvas.width * this.canvas.height
    this.numDots = area / (this.highDef ? 1 : 1.5)
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
    for (let i = 0; i < this.numDots; i++) {
      let dot = this.randomPoint()
      if (Math.sin(dot.distanceFrom(this.center())*pitch.visualFrequency) > Random.inRange(-1, 1)) {
        this.context.fillRect(dot.x, dot.y, 0.8, 0.8)
      }
    }
  }

  drawVesicaPiscis(lightness, separation, focusDist, frequency, focusWindow, focusPower) {
    this.context.fillStyle = 'black'

    const leftCenter = this.center().offset(-separation/2, 0)
    const rightCenter = this.center().offset(separation/2, 0)
    const numDots = this.numDots*lightness;

    for (let i = 0; i < numDots; i++) {
      const dot = this.randomPoint()
      const distanceFromCenter = dot.distanceFrom(leftCenter)
      if (
        Math.sin(distanceFromCenter*frequency) > Random.inRange(-1, 1) &&
        Math.pow(Math.abs(distanceFromCenter - focusDist), focusPower) < Random.inRange(0, focusWindow)
      ) {
        this.context.fillRect(dot.x, dot.y, 0.8, 0.8)
      }
    }

    for (let i = 0; i < numDots; i++) {
      const dot = this.randomPoint()
      const distanceFromCenter = dot.distanceFrom(rightCenter)
      if (
        Math.sin(distanceFromCenter*frequency) > Random.inRange(-1, 1) &&
        Math.pow(Math.abs(distanceFromCenter - focusDist), focusPower) < Random.inRange(0, focusWindow)
      ) {
        this.context.fillRect(dot.x, dot.y, 0.8, 0.8)
      }
    }
  }

  static fromPitches(pitches, width, height, useColor, highDef) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = width
    canvasElement.height = height
    const canvas = new Canvas(canvasElement, useColor, highDef)

    for (let i in pitches) {
      canvas.drawPitch(pitches[i])
    }

    return canvas
  }

  static vesicaPiscis(width, height) {
    const canvasElement = document.createElement('canvas')
    canvasElement.width = width
    canvasElement.height = height
    const canvas = new Canvas(canvasElement, false, true)
    canvas.drawVesicaPiscis(1/4, 200, 200, 0.2, 3, 1/5)
    canvas.drawVesicaPiscis(1, 200, 200, 0.2, 3.5, 1/3)
    return canvas;
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
