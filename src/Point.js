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

module.exports = Point
