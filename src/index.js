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
