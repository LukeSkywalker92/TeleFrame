class TouchBar {
  constructor(elements, config) {
    self = this;
    this.elements = elements;
    this.height = config.height;
    this.hidden = true;
    this.autHideTimerId = 0;
    this.startAutoHideTimer = () => {
      if (parseInt(config.autoHideTimeout) > 0) {
        self.autoHideTimerId = setTimeout(() => self.hide(), config.autoHideTimeout);
      }
    };
    // if not defined initialize autoHideTimeout to 30 seconds
    if (typeof config.autoHideTimeout === 'undefined') {
      config.autoHideTimeout = 30*1000;
    }
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
      try {
        const element = self.elements[name];
        const el = document.createElement('div');
        el.classList = name + " touchBarElement";
        el.style.lineHeight = self.height;
        el.style.fontSize = ($('#touch-bar-container').height()*0.8) + 'px';
        $(el).on('touchend', function(event) {
          // don't bubble up events to prevent disappearing sweetalert messages
          event.preventDefault();
          clearTimeout(self.autoHideTimerId);
          self.startAutoHideTimer();
          element.callback();
        });
        el.appendChild(element.iconElement);
        touchBar.appendChild(el);
      } catch(error) {
        console.error(`Failed to create touchbar element "${name}"!`, error);
      }
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
    this.startAutoHideTimer();
  }

  hide() {
    $("#touch-container").animate({bottom:0}, 100);
    $("#touch-bar-container").animate({bottom:"-" + this.height}, 100);
    this.hidden = true;
	  clearTimeout(self.autoHideTimerId);
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
    this.iconElement = document.createElement('i')
    this.iconElement.classList = this.icon
  }
}

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = {
    TouchBar,
    TouchBarElement
  }
}
