class Boot extends Phaser.Scene {
    //THIS SCENE IS WHAT STARTS THE GAME

    constructor () {
        //THIS SHOULD ONLY BE TRUE FOR THE BOOT SCENE
        super({key: 'Boot', active: true})
    }

    init () {

    }

    preload () {

    }

    create () {
        this.scene.start('Preload')
    }
}