require('./button.less')

class Button {
  constructor(text, onClick) {
    this.html = document.createElement('div')
    this.html.classList.add('button-object')
    this.html.innerText = text
    this.html.addEventListener('click', () => {
      onClick()
    })
  }
}

module.exports = Button
