const Hammer = require('hammerjs');
const $ = require('jquery');


/**
 * Initialize touch gesture handling
 * @param  {object} config  TeleFrame configuration object
 * @param  {object} options object providing callbacks for loadImage and pause
 * {
 *  loadImage: function loadImage(next, fadeTime) {...},
 *  pause: function pause() {...}
 *  }
 * @return {undefined}
 */
const initGestures = (config, options) => {
  // initialize swipe/pinch gestures
  new Hammer.Manager(document.getElementById('touch-container'), {
    recognizers: [
      [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }],
      [Hammer.Pinch]
    ]
  })
  // Subscribe to the desired events
  .on('swipe pinch', function(event) {
    switch(event.type) {
      case 'swipe':
        if (typeof options.loadImage !== 'function') {
          $('.imgcontainer').animate({ left: (event.offsetDirection === Hammer.DIRECTION_LEFT ? '-=' : '+=') + '100%'}, 50,
            () => $(event.offsetDirection === Hammer.DIRECTION_LEFT ? '.nextImage' : '.previousImage').trigger('click')
          );
        } else {
          $('.imgcontainer').animate({ left: (event.offsetDirection === Hammer.DIRECTION_LEFT ? '-=' : '+=') + '100%'}, 50);
          options.loadImage(event.offsetDirection === Hammer.DIRECTION_LEFT, Math.max(config.fadeTime, 500) / 3);
        }
        break;
      case 'pinch':
        if (event.scale) {
          const MAX_SCALE_FACTOR = config.gestures.maxScaleFactor;
          const ZOOM_PERCENT = config.gestures.zoomPercentPerEvent;
          const $assetContainer = $container.find('.imgcontainer');
          if (typeof options.pauseCallback === 'function') {
            options.pauseCallback();
          }
          if ($assetContainer.length > 0) {
            let attrib = 'height';
            // get the current zomm (starts with '100%')
            let currentZoom = $assetContainer[0].style.width;
            if (currentZoom) {
              attrib = 'width';
            } else {
              currentZoom = $assetContainer[0].style.height;
            }
            currentZoom = parseInt(currentZoom.replace('%', '')) || 100;
            $assetContainer.css(`max-${attrib}`, '');
            $assetContainer[attrib](Math.min((100 * MAX_SCALE_FACTOR), Math.max((100 / MAX_SCALE_FACTOR), currentZoom + (event.scale > 1.0 ? ZOOM_PERCENT : -ZOOM_PERCENT))) + '%');
          }
        }
        break;
    }
  });
}

module.exports = initGestures;
