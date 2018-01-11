// (() => {
//
require('./app.less')
const Point = require('./Point')
const Pitch = require('./Pitch')
const Canvas = require('./Canvas')
const Key = require('./Key')
const Synth = require('./Synth')

const main = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const keyContainer = document.getElementById('key-container')
  keyContainer.style.width = width

  const canvasContainer = document.getElementById('canvas-container')
  canvasContainer.style.width = width
  canvasContainer.style.height = height

  // const keyMap = {
  //   'a': new Pitch('A'),
  //   'w': new Pitch('A#'),
  //   's': new Pitch('B'),
  //   'd': new Pitch('C'),
  //   'r': new Pitch('C#'),
  //   'f': new Pitch('D'),
  //   't': new Pitch('D#'),
  //   'g': new Pitch('E'),
  //   'h': new Pitch('F'),
  //   'u': new Pitch('F#'),
  //   'j': new Pitch('G'),
  //   'i': new Pitch('G#'),
  //   'k': new Pitch("A'")
  // }

  const keyMap = {
    'z': new Pitch('C'),
    's': new Pitch('C#'),
    'x': new Pitch('D'),
    'd': new Pitch('D#'),
    'c': new Pitch('E'),
    'v': new Pitch('F'),
    'g': new Pitch('F#'),
    'b': new Pitch('G'),
    'h': new Pitch('G#'),
    'n': new Pitch('A'),
    'j': new Pitch('A#'),
    'm': new Pitch('B'),
    ',': new Pitch("C'")
  }

  const canvasses = {}
  const synth = new Synth()

  for (keyName in keyMap) {
    const pitch = keyMap[keyName]
    const canvas = Canvas.fromPitches([pitch], width, height)
    canvas.canvas.style.display = 'none'
    canvas.canvas.style.position = 'absolute'
    canvasses[pitch.note] = canvas
    canvasContainer.appendChild(canvas.canvas)

    const key = new Key(keyName, pitch, () => {
      canvas.canvas.style.display = 'inherit'
      synth.play(pitch)
    }, () => {
      canvas.canvas.style.display = 'none'
      synth.stop(pitch)
    })

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
}

window.onload = main
