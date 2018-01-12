require('./index.less')
const queryString = require('query-string')
const Instrument = require('./Instrument')
const Gallery = require('./Gallery')

const main = () => {
  const galleryArrow = document.createElement('div')
  galleryArrow.classList.add('arrow', 'left')
  galleryArrow.innerText = 'view gallery'
  document.body.appendChild(galleryArrow)

  const instrumentArrow = document.createElement('div')
  instrumentArrow.classList.add('arrow', 'right')
  instrumentArrow.innerText = 'play instrument'
  document.body.appendChild(instrumentArrow)

  const userParams = queryString.parse(location.search);
  const useColor = !!userParams.colorful

  const gallery = new Gallery(useColor)
  document.body.appendChild(gallery.html)
  setTimeout(() => {
    gallery.initialize()
  }, 100)

  //  const instrument = new Instrument(useColor)
  //  document.body.appendChild(instrument.html)
  //  setTimeout(() => {
  //    instrument.initialize()
  //  }, 100)
}

window.addEventListener('load', main)
