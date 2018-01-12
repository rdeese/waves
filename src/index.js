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

  const galleryArrow = document.createElement('div')
  galleryArrow.classList.add('arrow', 'left')
  galleryArrow.innerText = 'view gallery'
  galleryArrow.addEventListener('click', () => {
    instrument.html.style.display = 'none'
    gallery.html.style.display = 'block'
    if (instrument.initialized) {
      instrument.deactivate()
    }
  })
  document.body.appendChild(galleryArrow)

  const instrumentArrow = document.createElement('div')
  instrumentArrow.classList.add('arrow', 'right')
  instrumentArrow.innerText = 'play instrument'
  document.body.appendChild(instrumentArrow)
  instrumentArrow.addEventListener('click', () => {
    gallery.html.style.display = 'none'
    instrument.html.style.display = 'block'
    if (!instrument.initialized) {
      setTimeout(() => {
        instrument.initialize()
      }, 100)
    } else {
      instrument.activate()
    }
  })

  setTimeout(() => {
    gallery.initialize()
  }, 100)
}

window.addEventListener('load', main)
