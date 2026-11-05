(function() {
    'use strict';

    console.log("InjecThor Canvas Macro Active!");

    let ballCoordinates = null;

    // Hook into the game engine's drawing frame to grab ball coordinates bypassing minification
    const nativeArc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, start, end, ccw) {
        if (radius === 10) { // Standard Haxball ball size matrix
            ballCoordinates = { x: x, y: y };
        }
        return nativeArc.apply(this, arguments);
    };

    // Execute physical key injection through InjecThor's browser overlay
    function fireSpacebar() {
        const target = document.body || document;
        target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', keyCode: 32, bubbles: true }));
        setTimeout(() => {
            target.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ', keyCode: 32, bubbles: true }));
        }, 25);
    }

    // High frequency loop matching mobile device frame updates
    function engineLoop() {
        if (ballCoordinates) {
            fireSpacebar();
            ballCoordinates = null; 
        }
        requestAnimationFrame(engineLoop);
    }
    
    engineLoop();
})();
      
