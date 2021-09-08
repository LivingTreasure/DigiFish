class MainMap extends Phaser.Scene {
    //THIS SCENE IS THE MAIN SCREEN

    constructor () {
        
        super({key: 'MainMap', active: false})
    }

    init () {
        this.CONFIG = this.sys.game.CONFIG;
    }

    preload () {

        this.load.image('dirt', 'assets/images/water/TS_Dirt_Water.png');
        this.load.image('grass', 'assets/images/water/TS_Water.png');
        this.load.image('extra', 'assets/images/water/water_misc_16x16.png');
        this.load.image('tree', 'assets/images/other/Palmtree_n_fruits.png');

            // load the JSON file
        this.load.tilemapTiledJSON('map', 'assets/json/DigiFishMainMapLong.json')
    }

    create () {

        const map = this.make.tilemap({ key: 'map'})
        const tileset = map.addTilesetImage('TS_Water','grass')
        const tileset2 = map.addTilesetImage('TS_Dirt_Water','dirt')
        const tileset3 = map.addTilesetImage('water_misc_16x16','extra')
        const tileset4 = map.addTilesetImage('Palmtree_n_fruits','tree')

        const allLayers = [tileset, tileset2, tileset3, tileset4]

        var layer1 = map.createLayer('Tile Layer 1', allLayers, 0, 0).setScale(this.assetsScaleFactor)
        var layer2 = map.createLayer('Tile Layer 2', allLayers, 0, 0).setScale(this.assetsScaleFactor)
    }
}