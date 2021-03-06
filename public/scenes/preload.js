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

        this.load.spritesheet('guiIcons', 'assets/Images/GUI_Pack/Icons/Menu_Icons_16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })

        this.load.spritesheet('coin', 'assets/GUI_Pack/Icons/Coins_16x16.png', {
            frameWidth: 16,
            frameHeight: 16
        })


    }

    async create () {
        var moveData = await this.getMoveFromDB();
        var inventory = await this.getInventoryFromDB();
        var sceneData = {};
        var sceneToLoad = "MainMap";

        if("currentScene" in moveData) {
            sceneToLoad = moveData['currentScene'];
            sceneData['x'] = moveData.playerX;
            sceneData['y'] = moveData.playerY;
        }

        if(inventory && inventory.length !== 0) {
            sceneData['inventory'] = inventory.inventory;
        }
        
        this.scene.start(sceneToLoad, sceneData);
    }

    async getMoveFromDB() {
        const response = await axios.get('/api/move')
        return response.data
    }

    async getInventoryFromDB() {
        const response = await axios.get('/api/inventory')
        return response.data
    }
}
