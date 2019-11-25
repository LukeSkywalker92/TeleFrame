class TouchBar {
  constructor(elements, height) {
    this.elements = elements;
    this.height = height;
    const touchBarContainer = document.getElementById('touch-bar-container')
    touchBarContainer.style.height = this.height;
    touchBarContainer.style.bottom = "-" + this.height;
    const touchBarBlur = document.createElement('div');
    touchBarBlur.classList = "touch-bar-blur";
    const touchBar = document.createElement('div');
    touchBar.classList = "touch-bar";
    touchBarContainer.appendChild(touchBarBlur);
    touchBarContainer.appendChild(touchBar);
  }

  show() {
    $("#touch-bar-container").animate({bottom:0}, 100);
  }

  hide() {
    $("#touch-bar-container").animate({bottom:"-" + this.height}, 100);
  }
}

class TouchBarElement {
  constructor(callback, icon) {
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
