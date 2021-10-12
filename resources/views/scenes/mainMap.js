class MainMap extends Phaser.Scene {
    //THIS SCENE IS WHAT STARTS THE GAME

    constructor () {
        
        super({key: 'MainMap', active: false})
    }

    init () {
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload () {

    }

    create () {
        this.text = this.add.text(this.CONFIG.centerX, this.CONFIG.centerY, 'Main Map')
        this.text.setOrgin(0.5);
        this.text.setColor('#FF0000');
    }
}