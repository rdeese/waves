require('./gallery.less')
const Pitch = require('./Pitch')
const Canvas = require('./Canvas')
const Overlay = require('./Overlay')

class Gallery {
  constructor(useColor, highDef) {
    this.initialized = false;
    this.useColor = useColor
    this.highDef = highDef

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


    const introText = document.createElement('div')
    introText.classList.add('intro-text')
    introText.style.width = limitingDimension - limitingDimension / 4
    introText.innerHTML = `
    <h4>Waves (2018)</h4>
    <p>
      ${this.useColor ? 'Color' : 'Black'} dots on transparent canvas.
    </p>
    <p>
      Dots are placed randomly according to probabilities given by a sine wave. The chosen wavelengths are proportional to those of musical pitches in air.
    </p>
    `
    this.html.appendChild(introText)

    // for (let i in pitches) {
    //   const canvas = Canvas.fromPitches([pitches[0], pitches[i]], width, height, this.useColor, this.highDef)
    //   canvas.html.style.position = 'relative'
    //   const wrapperDiv = document.createElement('div')
    //   wrapperDiv.classList.add('canvas-wrapper')
    //   wrapperDiv.appendChild(canvas.html)
    //   const titleDiv = document.createElement('div')
    //   titleDiv.classList.add('title')
    //   canvas.html.appendChild(titleDiv)
    //   titleDiv.innerText = `${pitches[i].note} / ${pitches[0].note}`
    //   this.html.appendChild(wrapperDiv)
    // }

    const canvas = Canvas.vesicaPiscis(1200, 1200);
    canvas.html.style.position = 'relative'
    const data = canvas.canvas.toDataURL('image/png')
    document.write('<img src="'+data+'"/>')



    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.loadingElement.hide()
        this.initialized = true;
      })
    })
  }
}

module.exports = Gallery
