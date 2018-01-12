require('./instrument.less')

const Pitch = require('./Pitch')
const Canvas = require('./Canvas')
const Key = require('./Key')
const Synth = require('./Synth')
const Overlay = require('./Overlay')

class Instrument {
  constructor(useColor, highDef) {
    this.initialized = false;
    this.active = false;
    this.useColor = useColor
    this.highDef = highDef

    this.html = document.createElement('div')
    this.html.classList.add('instrument-object')

    this.width = window.innerWidth
    this.height = window.innerHeight

    this.loadingElement = new Overlay('loading instrument...', this.width, this.height)
    this.html.appendChild(this.loadingElement.html)

    this.keyContainer = document.createElement('div')
    this.keyContainer.classList.add('key-container')
    this.html.appendChild(this.keyContainer)

    this.canvasContainer = document.createElement('div')
    this.canvasContainer.classList.add('canvas-container')
    this.canvasContainer.style.width = this.width
    this.canvasContainer.style.height = this.height
    this.html.appendChild(this.canvasContainer)
  }

  initialize() {
    this.keyMap = {
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
      "'": new Pitch('f')
    }

    const canvases = {}
    const synth = new Synth()

    for (let keyName in this.keyMap) {
      const pitch = this.keyMap[keyName]
      const canvas = Canvas.fromPitches([pitch], this.width, this.height, this.useColor, this.highDef)
      canvases[pitch.note] = canvas
      this.canvasContainer.appendChild(canvas.html)

      const key = new Key(keyName, pitch, () => {
        canvas.show()
        synth.play(pitch)
      }, () => {
        canvas.hide()
        synth.stop(pitch)
      }, this.useColor)

      this.keyContainer.appendChild(key.html)

      this.keyMap[keyName] = key
    }

    this.keyContainer.addEventListener('touchstart', this.touchStartCallback.bind(this))
    this.keyContainer.addEventListener('touchmove', this.touchStartCallback.bind(this))
    this.keyContainer.addEventListener('touchend', this.touchEndCallback.bind(this))

    document.addEventListener('keydown', (event) => {
      if (!(event.ctrlKey || event.altKey || event.metaKey)) {
        event.preventDefault()
        this._keyDown(event)
      }
    })

    document.addEventListener('keyup', (event) => {
      event.preventDefault()
      this._keyUp(event)
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (let key in canvases) {
          canvases[key].hide()
        }

        this.loadingElement.hide()

        this.active = true;
        this.initialized = true;
      })
    })
  }

  _keyDown(event) {
    if (this.active) {
      if (event.key in this.keyMap) {
        this.keyMap[event.key].down()
      }
    }
  }

  _keyUp(event) {
    if (this.active) {
      if (event.key in this.keyMap) {
        this.keyMap[event.key].up()
      }
    }
  }

  activate() {
    this.active = true
  }
  
  deactivate() {
    this.active = false
    for (let keyName in this.keyMap) {
      this.keyMap[keyName].up()
    }
  }

  touchStartCallback(event) {
    event.preventDefault()
    for (let k in this.keyMap) {
      const key = this.keyMap[k]
      let isTouched = false
      for (let i in event.touches) {
        const touch = event.touches[i]
        const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY)
        if (key.html.contains(touchedElement)) {
          isTouched = true
        }
      }
      if (key.isPressed && !isTouched) {
        key.up()
      } else if (!key.isPressed && isTouched) {
        key.down()
      }
    }
  }

  touchEndCallback(event) {
    event.preventDefault()
    for (let k in this.keyMap) {
      const key = this.keyMap[k]
      let isReleased = false
      for (let i in event.changedTouches) {
        const touch = event.changedTouches[i]
        const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY)
        if (key.html.contains(touchedElement)) {
          isReleased = true
        }
      }
      if (key.isPressed && isReleased) {
        key.up()
      }
    }
  }
}

module.exports = Instrument
