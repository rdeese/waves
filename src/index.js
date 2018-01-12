require('./index.less')
const queryString = require('query-string')
const Instrument = require('./Instrument')
const Gallery = require('./Gallery')

const main = () => {
  const userParams = queryString.parse(location.search);
  const useColor = !!userParams.colorful

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

  const galleryArrow = document.createElement('div')
  galleryArrow.classList.add('arrow', 'right')
  galleryArrow.innerText = 'play instrument'
  galleryArrow.addEventListener('click', () => {
    if (onGallery) {
      showInstrument()
      galleryArrow.innerText = 'view gallery'
      onGallery = false
    } else {
      showGallery()
      galleryArrow.innerText = 'play instrument'
      onGallery = true
    }
  })
  document.body.appendChild(galleryArrow)

  setTimeout(() => {
    gallery.initialize()
  }, 100)
}

window.addEventListener('load', main)
