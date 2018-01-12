require('./overlay.less')
class Overlay {
  constructor(text, width, height) {
    this.html = document.createElement('div')
    this.html.classList.add('overlay-object')
    this.html.style.width = width
    this.html.style.height = height
    this.html.innerText = text
  }

  hide() {
    this.html.classList.add('hidden')
    this.html.addEventListener('animationend', () => {
      this.html.style.display = 'none'
    })
  }

  show() {
      this.html.style.display = 'unset'
    this.html.classList.remove('hidden')
  }
}

module.exports = Overlay
