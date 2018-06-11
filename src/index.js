// (() => {
let context;

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

const moonrise = (horizonPosition, moonPosition, moonWavesFunction) => {
  let canvas = document.createElement('canvas')
  context = canvas.getContext('2d')

  canvas.height = 500
  canvas.width = canvas.height*3
  const numPoints = 0.5*canvas.width*canvas.height

  const earthRadius = 40*canvas.height
  const moonRadius = 0.12*canvas.height

  const moonWavelength = 0.18*canvas.height
  const earthWavelength = moonWavelength/64

  const canvasCenter = new Point(canvas.width/2, canvas.height/2)
  const earthHorizonMiddle = canvasCenter.offset(0, horizonPosition*canvas.height-10)

  const moonCenter = canvasCenter.offset(0, moonPosition*canvas.height)
  const earthCenter = earthHorizonMiddle.offset(0, earthRadius)

  const randParams = [-2.5, 0.5]

  // context.fillStyle = "#FF0000"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let dist = dot.distanceFrom(earthCenter)
    if (dist > earthRadius && dot.distanceFrom(moonCenter) > moonRadius && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {
    // if (dist > earthRadius && Math.sin(dist/earthWavelength) > Random.inRange(...randParams)) {}
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  // context.fillStyle = "#0000FF"
  for (let i = 0; i < numPoints; i++) {
    let dot = Point.randomOnCanvas(canvas)
    let distFromMoonCenter = dot.distanceFrom(moonCenter)
    let distFromEarthCenter = dot.distanceFrom(earthCenter)
    // if (distFromMoonCenter > moonRadius && distFromEarthCenter < earthRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {}
    if (distFromEarthCenter < earthRadius && moonWavesFunction(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {
    // if (distFromMoonCenter > moonRadius && Math.cos(distFromMoonCenter/moonWavelength) > Random.inRange(...randParams)) {}
      context.fillRect(dot.x, dot.y, 1, 1)
    }
  }

  return canvas
}


const main = () => {
  // moonrise 1
  // let canvas = moonrise(-1/6, 1/10, (x) => -Math.cos(x))
  // document.body.appendChild(canvas)
  // moonrise 2
  canvas = moonrise(1/10, -1/6, (x) => -Math.sin(x))
  document.body.appendChild(canvas)
}

window.onload = main;
// })();
