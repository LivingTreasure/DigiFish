class Preload extends Phaser.Scene {
    //THIS SCENE IS WHAT STARTS THE GAME

    constructor () {
        
        super({key: 'Preload', active: false})
    }

    init () {

    }

    preload () {

    }

    create () {
        this.scene.start('mainMap')
    }
}