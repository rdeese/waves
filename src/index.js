// (() => {
let context;

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
    return 440 * Math.pow(1.059463, noteNumber - 49)
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

  static randomOnCanvas (canvas) {
    return new Point(Math.random()*canvas.width, Math.random()*canvas.height)
  }
}

const Random = {
  inRange: (low, high) => {
    return (high - low) * Math.random() + low
  }
}

const main = () => {
  const canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')
  let lastPoint = null
  let secondLastPoint = null

  canvas.height = 500
  canvas.width = canvas.height*3
  const numPoints = 0.5*canvas.width*canvas.height

  const earthRadius = 20000
  const moonRadius = 60

  const moonWavelength = 90
  const earthWavelength = moonWavelength/64

  const canvasCenter = new Point(canvas.width/2, canvas.height/2)
  const earthHorizonMiddle = canvasCenter.offset(0, -canvas.height/6-10) // canvas.height/6)

  const moonCenter = canvasCenter.offset(0, canvas.height/10)
  const earthCenter = earthHorizonMiddle.offset(0, earthRadius)

  const randParams = [-2.5, 0.5]

  // context.fillStyle = "#FF0000"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let dist = dot.distanceFrom(earthCenter)
    if (dist > earthRadius && dot.distanceFrom(moonCenter) > moonRadius && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {
    // if (dist > earthRadius && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  // context.fillStyle = "#0000FF"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let distFromMoonCenter = dot.distanceFrom(moonCenter)
    let distFromEarthCenter = dot.distanceFrom(earthCenter)
    // if (distFromMoonCenter > moonRadius && distFromEarthCenter < earthRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {
    if (distFromEarthCenter < earthRadius && -Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {
    // if (distFromMoonCenter > moonRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  canvas.onclick = (event) => {
    let point = Point.fromEvent(event)
    context.fillText(`${point.x}, ${point.y}`, point.x, point.y);
    if (lastPoint && secondLastPoint) {
      context.moveTo(lastPoint.x, lastPoint.y)
      context.quadraticCurveTo(point.x, point.y, secondLastPoint.x, secondLastPoint.y)
      context.stroke()
    }
    secondLastPoint = lastPoint
    lastPoint = point;
  }
}

window.onload = main;
// })();
