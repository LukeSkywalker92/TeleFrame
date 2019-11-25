class TouchBar {
  constructor(elements, config) {
    self = this;
    this.elements = elements;
    this.height = config.height;
    this.hidden = true;
    const touchBarContainer = document.getElementById('touch-bar-container')
    touchBarContainer.style.height = this.height;
    touchBarContainer.style.bottom = "-" + this.height;
    const touchBarBlur = document.createElement('div');
    touchBarBlur.classList = "touch-bar-blur";
    const touchBar = document.createElement('div');
    touchBar.classList = "touch-bar";
    if (config.elements == undefined) {
      config.elements = Object.keys(elements)
    }
    config.elements.forEach(function (name) {
      const element = self.elements[name]
      const el = document.createElement('div')
      el.classList = "touchBarElement"
      el.style.lineHeight = self.height
      el.style.fontSize = ($('#touch-bar-container').height()*0.8) + 'px';
      $(el).on('touchend', function(event) {
        element.callback()
      });
      const icon = document.createElement('i')
      icon.classList = element.icon
      element.iconElement = icon
      el.appendChild(icon)
      touchBar.appendChild(el)
    })

    touchBarContainer.appendChild(touchBarBlur);
    touchBarContainer.appendChild(touchBar);
    $("#touch-container").on('touchend', function(event) {
      self.toggle()
    });
  }

  show() {
    $("#touch-container").animate({bottom:this.height}, 100);
    $("#touch-bar-container").animate({bottom:0}, 100);
    this.hidden = false;
  }

  hide() {
    $("#touch-container").animate({bottom:0}, 100);
    $("#touch-bar-container").animate({bottom:"-" + this.height}, 100);
    this.hidden = true;
  }

  toggle() {
    if (this.hidden) {
      this.show()
    } else {
      this.hide()
    }
  }

}

class TouchBarElement {
  constructor( icon, callback) {
    this.callback = callback;
    this.icon = icon;
  }
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = {
    TouchBar,
    TouchBarElement
  }
}
