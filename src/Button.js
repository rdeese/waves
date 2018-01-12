require('./button.less')

class Button {
  constructor(text, onClick) {
    this.html = document.createElement('div')
    this.html.classList.add('button-object')
    this.html.innerText = text
    this.html.addEventListener('click', (event) => {
      event.preventDefault()
      onClick()
    })
  }
}

module.exports = Button
