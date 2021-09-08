class Preload extends Phaser.Scene {
    //THIS SCENE LOADS ALL THE ASSETS

    constructor () {
        
        super({key: 'Preload', active: false})
    }

    init () {

    }

    preload () {

    }

    create () {
        this.scene.start('MainMap')
    }
}