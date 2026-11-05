// ==UserScript==
// @name         InjecThor Haxball Auto-Shoot & Pass
// @namespace    http://tampermonkey.net
// @version      1.1
// @description  Canvas-interception macro for auto-shooting and passing in Haxball
// @match        https://haxball.com*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("InjecThor Advanced Combat Macro Active!");

    let ballCoords = null;
    let playerCoords = null;

    const BALL_RADIUS = 10;
    // ADJUST THIS: Set this to your specific player disk radius color size (usually 15)
    const PLAYER_RADIUS = 15; 
    // Kick trigger distance (ball radius + player radius + buffer)
    const KICK_RANGE = BALL_RADIUS + PLAYER_RADIUS + 3.0; 

    // Intercept Canvas rendering to snatch positions in real-time
    const nativeArc = CanvasRenderingContext2D.prototype.arc;
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, start, end, ccw) {
        // 1. Identify the ball
        if (radius === BALL_RADIUS) { 
            ballCoords = { x: x, y: y };
        }
        // 2. Identify the player (Haxball player disks have a radius of 15)
        // Note: If you want to isolate YOUR player specifically, we track the one closest to input controls
        else if (radius === PLAYER_RADIUS) {
            playerCoords = { x: x, y: y };
        }
        
        return nativeArc.apply(this, arguments);
    };

    // Simulated event firing to press spacebar instantly
    function executeKick() {
        const target = document.body || document;
        target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', key: ' ', keyCode: 32, bubbles: true }));
        setTimeout(() => {
            target.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', key: ' ', keyCode: 32, bubbles: true }));
        }, 20); // 20ms short pulse for ultra-fast response
    }

    // High frequency engine verification loop
    function engineLoop() {
        if (ballCoords && playerCoords) {
            // Calculate distance between player center and ball center using Pythagoras
            let dx = ballCoords.x - playerCoords.x;
            let dy = ballCoords.y - playerCoords.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // ONLY kick if the ball is inside your touchable proximity zone
            if (distance <= KICK_RANGE) {
                executeKick();
            }
        }
        requestAnimationFrame(engineLoop);
    }
    
    engineLoop();
})();
                             
