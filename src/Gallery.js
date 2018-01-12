require('./gallery.less')
const Pitch = require('./Pitch')
const Canvas = require('./Canvas')

class Gallery {
  constructor(useColor) {
    this.useColor = useColor

    this.html = document.createElement('div')
    this.html.classList.add('gallery-object')

    this.width = window.innerWidth
    this.height = window.innerHeight

    // DRY up in new component
    this.loadingElement = document.createElement('div')
    this.loadingElement.classList.add('loading')
    this.loadingElement.style.width = window.innerWidth;
    this.loadingElement.style.height = window.innerHeight;
    this.loadingElement.innerText = 'hello! please stand by...'
    this.html.appendChild(this.loadingElement)

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
      canvas.html.style.position = 'inherit'
      const wrapperDiv = document.createElement('div')
      wrapperDiv.classList.add('canvas-wrapper')
      wrapperDiv.appendChild(canvas.html)
      this.html.appendChild(wrapperDiv)
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.loadingElement.classList.add('hidden')
        this.loadingElement.addEventListener('animationend', () => {
          this.loadingElement.style.display = 'none'
        })
      })
    })
  }
}

module.exports = Gallery
