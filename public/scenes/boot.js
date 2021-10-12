class Boot extends Phaser.Scene {
    //THIS SCENE IS WHAT STARTS THE GAME

    constructor () {
        //THIS SHOULD ONLY BE TRUE FOR THE BOOT SCENE
        super({key: 'Boot', active: true})
    }

    init () {

    }

    preload () {
        //this.load.bitmapFont('ClickPixel', 'assets/GUI_Pack/Fonts/Click_0.png', 'assets/GUI_Pack/Fonts/click.xml')
        this.load.bitmapFont('ClickPixel', 'assets/GUI_Pack/Fonts/WhitePeaberry.png', 'assets/GUI_Pack/Fonts/WhitePeaberry.xml')

    }

    create () {
        this.scene.start('Preload')
    }
}