const queryString = require('query-string')
const Instrument = require('./Instrument')

const main = () => {
  const userParams = queryString.parse(location.search);
  const useColor = !!userParams.colorful
  const instrument = new Instrument(useColor)
  document.body.appendChild(instrument.html)
  setTimeout(() => {
    instrument.initialize()
  }, 100)
}

window.addEventListener('load', main)
