const App = function() {
    'use strict';

    this.VERSION    = '0.0.1';
    this.IS_DEV     = true;
}

App.prototype.start = function() {
    'use strict';

    //SCENES
    let scenes = [];

    scenes.push(Boot);
    scenes.push(Preload);
    scenes.push(MainMap);

    //GAME CONFIG
    const config = {
        type            : Phaser.AUTO,
        parent          : 'phaser-app',
        title           : 'DigiFish',
        width           : 320,
        height          : 160,
        scene          : scenes,
        pixelArt        : true,
        backgroundColor : 0x000000,
        physics: {
            default: 'arcade',
            arcade: {
            debug: true,
            },
        },
        scale: {
            // Fit to window
            mode: Phaser.Scale.FIT,
        }
    };

    //CREATE GAME APP
    let game = new Phaser.Game(config);

    //GLOBALS
    game.IS_DEV = this.IS_DEV;
    game.VERSION = this.VERSION;

    game.CONFIG = {
        width : config.width,
        height : config.height,
        centerX : Math.round(0.5 * config.width),
        centerY : Math.round(0.5 * config.height),
        tile : 8

    };

    //SOUND
    //game.sound_on = true;

}