class touchBar {
  constructor(elements, height) {
    this.elements = elements;
    this.height = height;
  }
}

class touchBarElement {
  constructor(callback, icon) {
    this.callback = callback;
    this.icon = icon;
  }
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = {
    touchBar,
    touchBarElement
  }
}
