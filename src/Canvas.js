const Point = require('./Point')

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
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

module.exports = Canvas
