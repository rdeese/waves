require('./gallery.less')
const Pitch = require('./Pitch')
const Canvas = require('./Canvas')
const Overlay = require('./Overlay')

class Gallery {
  constructor(useColor) {
    this.initialized = false;
    this.useColor = useColor

    this.html = document.createElement('div')
    this.html.classList.add('gallery-object')

    this.width = window.innerWidth
    this.height = window.innerHeight

    this.loadingElement = new Overlay('hello! please stand by...', this.width, this.height)
    this.html.appendChild(this.loadingElement.html)

    // this.canvasDisplay = document.createElement('div')
    // this.canvasDisplay.classList.add('canvas-display')
    // this.canvasDisplay.style.width = window.innerWidth;
    // this.canvasDisplay.style.height = window.innerHeight;
    // this.html.appendChild(this.canvasDisplay)
  }

  initialize() {
    const pitches = []
    for (let i = 40; i < 53; i++) {
      pitches.push(new Pitch(i))
    }
    
    const limitingDimension = Math.min(this.width, this.height)
    const width = limitingDimension - limitingDimension / 5
    const height = width

    for (let i in pitches) {
      const canvas = Canvas.fromPitches([pitches[0], pitches[i]], width, height, this.useColor)
      canvas.html.style.position = 'relative'
      const wrapperDiv = document.createElement('div')
      wrapperDiv.classList.add('canvas-wrapper')
      wrapperDiv.appendChild(canvas.html)
      const titleDiv = document.createElement('div')
      titleDiv.classList.add('title')
      canvas.html.appendChild(titleDiv)
      titleDiv.innerText = `${pitches[i].note} / ${pitches[0].note}`
      this.html.appendChild(wrapperDiv)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.loadingElement.hide()
        this.initialized = true;
      })
    })
  }
}

module.exports = Gallery
