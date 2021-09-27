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
        console.log("Start Preload")
        this.scene.start('MainMap')
    }
}