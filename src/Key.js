require('./key.less')

class Key {
  constructor(key, pitch, onDown, onUp) {
    this.key = key
    this.pitch = pitch
    this.onDown = onDown
    this.onUp = onUp

    this.html = document.createElement('div')
    this.html.classList.add('key-object')
    if (pitch.note.match('#')) {
      this.html.classList.add('sharp')
    }

    this.noteNameDiv = document.createElement('div')
    this.noteNameDiv.classList.add('note-name')
    this.html.appendChild(this.noteNameDiv)

    this.keyNameDiv = document.createElement('div')
    this.keyNameDiv.classList.add('key-name')
    this.keyNameDiv.innerText = this.key
    this.html.appendChild(this.keyNameDiv)
  }

  down() {
    this.html.classList.add('pressed')
    this.onDown()
  }

  up() {
    this.html.classList.remove('pressed')
    this.onUp()
  }
}

module.exports = Key
