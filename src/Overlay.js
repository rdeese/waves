require('./overlay.less')
class Overlay {
  constructor(content, width, height, hidden) {
    this.html = document.createElement('div')
    this.html.classList.add('overlay-object')
    this.html.style.width = width
    this.html.style.height = height
    if (typeof(content) == 'string') {
      this.html.innerText = content
    } else if (typeof(content) == 'object') {
      this.html.appendChild(content)
    } else {
      throw new Error('Overlay initialized with invalid content type.')
    }
    this.hidden = !!hidden
    if (this.hidden) {
      this.html.style.display = 'none'
    }
  }

  hide() {
    this.hidden = true
    this.html.classList.remove('reveal')
    this.html.classList.add('hide')
    const onEnd = (() => {
      this.html.style.display = 'none'
      this.html.removeEventListener('animationend', onEnd)
    }).bind(this)
    const listener = this.html.addEventListener('animationend', onEnd)
  }

  show() {
    this.hidden = false
    this.html.style.display = 'flex'
    this.html.classList.remove('hide')
    this.html.classList.add('reveal')
  }
}

module.exports = Overlay
