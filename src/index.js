require('./index.less')
const queryString = require('query-string')
const Instrument = require('./Instrument')
const Gallery = require('./Gallery')
const Button = require('./Button')
const Overlay = require('./Overlay')

const main = () => {
  const userParams = queryString.parse(location.search);
  const useColor = !!userParams.colorful

  const helpOverlayContents = document.createElement('div')
  helpOverlayContents.classList.add('help-contents')
  const helpText = document.createElement('div')
  helpText.innerHTML = `
  <h4>Waves (2018)</h4>
  <p>
    ${useColor ? 'Color' : 'Black'} dots on transparent canvas.
  </p>
  <p>
    Dots are chosen randomly according to probabilities given by a sine wave. The wavelengths are proportional to those of musical pitches in air.
  </p>
  `
  helpOverlayContents.appendChild(helpText)
  const helpHideButton = new Button('thanks', () => {
    helpOverlay.hide()
  })
  helpHideButton.html.style.position = 'inherit'
  helpOverlayContents.appendChild(helpHideButton.html)

  const helpOverlay = new Overlay(helpOverlayContents, window.innerWidth, window.innerHeight, true)
  document.body.appendChild(helpOverlay.html)

  const helpShowButton = new Button('?', () => {
    helpOverlay.show()
  })
  helpShowButton.html.classList.add('left')
  document.body.appendChild(helpShowButton.html)

  const gallery = new Gallery(useColor)
  document.body.appendChild(gallery.html)

  const instrument = new Instrument(useColor)
  document.body.appendChild(instrument.html)
  instrument.html.style.display = 'none'

  let onGallery = true;

  const showGallery = () => {
    instrument.html.style.display = 'none'
    gallery.html.style.display = 'flex'
    if (instrument.initialized) {
      instrument.deactivate()
    }
  }

  const showInstrument = () => {
    gallery.html.style.display = 'none'
    instrument.html.style.display = 'flex'
    if (!instrument.initialized) {
      setTimeout(() => {
        instrument.initialize()
      }, 100)
    } else {
      instrument.activate()
    }
  }

  const viewToggleButton = new Button('play instrument', () => {
    if (onGallery) {
      showInstrument()
      viewToggleButton.html.innerText = 'view gallery'
      onGallery = false
    } else {
      showGallery()
      viewToggleButton.html.innerText = 'play instrument'
      onGallery = true
    }
  })
  viewToggleButton.html.classList.add('right')
  document.body.appendChild(viewToggleButton.html)

  setTimeout(() => {
    gallery.initialize()
  }, 100)
}

window.addEventListener('load', main)
