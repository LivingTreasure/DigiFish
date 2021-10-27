class Preload extends Phaser.Scene {
    //THIS SCENE LOADS ALL THE ASSETS

    constructor () {

        super({key: 'Preload', active: false})
    }

    init () {

    }

    preload () {

        this.load.spritesheet('fish', 'assets/Images/other/FishIcons_n_junk_16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('baitAndHooks', 'assets/Images/other/baits_16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('uiContainers', 'assets/Images/GUI_Pack/Containers/Frames_BrownBG_32x32export.png', {
            frameWidth: 32,
            frameHeight: 32
        })

        this.load.spritesheet('walking', 'assets/Images/Tiny Adventure Pack/Character v2/Char1/Char1_walk_16px.png', {
            frameWidth: 16,
            frameHeight: 16
        })


    }

    async create () {
        var moveData = await this.getMoveFromDB();

        this.scene.start(moveData.currentScene, {x: moveData.playerX, y: moveData.playerY});
    }

    async getMoveFromDB() {
        const response = await axios.get('/api/move')
        return response.data
    }
}
