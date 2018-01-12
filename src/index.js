// (() => {
//
require('./app.less')

const queryString = require('query-string')

const Point = require('./Point')
const Pitch = require('./Pitch')
const Canvas = require('./Canvas')
const Key = require('./Key')
const Synth = require('./Synth')

const main = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  const userParams = queryString.parse(location.search);
  const useColor = !!userParams.colorful

  const keyContainer = document.getElementById('key-container')
  keyContainer.style.width = width

  const canvasContainer = document.getElementById('canvas-container')
  canvasContainer.style.width = width
  canvasContainer.style.height = height

  const keyMap = {
    'a': new Pitch('C'),
    'w': new Pitch('C#'),
    's': new Pitch('D'),
    'e': new Pitch('D#'),
    'd': new Pitch('E'),
    'f': new Pitch('F'),
    't': new Pitch('F#'),
    'g': new Pitch('G'),
    'y': new Pitch('G#'),
    'h': new Pitch('A'),
    'u': new Pitch('A#'),
    'j': new Pitch('B'),
    'k': new Pitch('c'),
    'o': new Pitch('c#'),
    'l': new Pitch('d'),
    'p': new Pitch('d#'),
    ';': new Pitch('e'),
    "'": new Pitch('f'),
  }

  const canvasses = {}
  const synth = new Synth()

  for (keyName in keyMap) {
    const pitch = keyMap[keyName]
    const canvas = Canvas.fromPitches([pitch], width, height, useColor)
    canvasses[pitch.note] = canvas
    canvasContainer.appendChild(canvas.html)

    const key = new Key(keyName, pitch, () => {
      canvas.show()
      synth.play(pitch)
    }, () => {
      canvas.hide()
      synth.stop(pitch)
    }, useColor)

    keyContainer.appendChild(key.html)

    keyMap[keyName] = key
  }

  document.addEventListener('keydown', (event) => {
    if (event.key in keyMap) {
      keyMap[event.key].down()
    }
  })

  document.addEventListener('keyup', (event) => {
    if (event.key in keyMap) {
      keyMap[event.key].up()
    }
  })

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      for (key in canvasses) {
        canvasses[key].hide()
        const loadingElement = document.getElementById('loading')
        loadingElement.classList.add('hidden')
        loadingElement.addEventListener('animationend', () => {
          loadingElement.style.display = 'none'
        })
      }
    })
  })
}

window.addEventListener('load', () => {
  const loadingElement = document.getElementById('loading')
  loadingElement.style.width = window.innerWidth;
  loadingElement.style.height = window.innerHeight;
  setTimeout(main, 100)
})
